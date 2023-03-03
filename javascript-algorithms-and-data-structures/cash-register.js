function checkCashRegister(price, cash, cid) {
  const currencyValues = {
    'PENNY': 0.01,
    'NICKEL': 0.05,
    'DIME': 0.1,
    'QUARTER': 0.25,
    'ONE': 1,
    'FIVE': 5,
    'TEN': 10,
    'TWENTY': 20,
    'ONE HUNDRED': 100
  };

  let change = cash - price;
  let totalCid = 0;
  let changeArray = [];

  // Sum the total cash in the drawer
  cid.forEach(currency => {
    totalCid += currency[1];
  });

  // If there isn't enough cash in the drawer or exact change can't be made, return INSUFFICIENT_FUNDS
  if (change > totalCid) {
    return {status: "INSUFFICIENT_FUNDS", change: []};
  }

  // If the amount of cash in the drawer is equal to the change, return CLOSED
  if (change === totalCid) {
    return {status: "CLOSED", change: cid};
  }

  // Otherwise, iterate through the currency units starting from the highest value and make change
  let cidIndex = cid.length - 1;
  while (change > 0 && cidIndex >= 0) {
    const currencyName = cid[cidIndex][0];
    const currencyValue = currencyValues[currencyName];
    let currencyAmount = cid[cidIndex][1];
    let currencySum = 0;

    // While there is still cash of the current currency in the drawer and the change owed is greater than or equal to the value of the currency, make change
    while (currencyAmount > 0 && change >= currencyValue) {
      currencyAmount -= currencyValue;
      change -= currencyValue;
      change = Math.round(change * 100) / 100; // Round change to avoid floating point errors
      currencySum += currencyValue;
    }

    // If change was made with the current currency, add it to the change array
    if (currencySum > 0) {
      changeArray.push([currencyName, currencySum]);
    }

    cidIndex--;
  }

  // If there is still change owed, return INSUFFICIENT_FUNDS
  if (change > 0) {
    return {status: "INSUFFICIENT_FUNDS", change: []};
  }

  // Otherwise, return the change array
  return {status: "OPEN", change: changeArray};
}


checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]);
