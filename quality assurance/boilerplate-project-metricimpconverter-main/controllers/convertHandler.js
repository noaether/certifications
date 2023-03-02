function ConvertHandler() {
  // input : 5mi
  // getNum(5mi) : 5
  // getUnit(5mi) : mi
  // getReturnUnit(mi) : km
  // spellOutUnit(mi) : miles
  // convert(5, mi) : 8.04672
  // getString(5, mi, 8.04672, km) : 5 miles converts to 8.04672 kilometers

  // input : 5mi
  // initUnit : mi

  this.getNum = function (input) {
    const numRegex =
      /^(\d+(\.\d+)?|\.\d+|\d+(\.\d+)?\/\d+(\.\d+)?)(?=[a-zA-Z]*$)/; // regex to match numerical value
    const match = input.match(numRegex); // match condition

    if (match) {
      if (match[0].includes('/')) {
        // if match contains a fraction
        const [dividend, divisor] = match[0].split('/');
        return parseFloat(dividend) / parseFloat(divisor);
      } else {
        // if match is a number
        return parseFloat(match[0]);
      }
    } else {
      // if no match is found
      return input.split('/').length > 2 ? 'invalid number' : 1;
    }
  };

  this.getUnit = function (input) {
    const validUnits = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];
    const unitRegex = /[a-zA-Z]+$/;
    const match = input.match(unitRegex);
    const unit = match ? match[0].toLowerCase() : '';

    if (validUnits.includes(unit)) {
      return unit === 'l' ? 'L' : unit;
    } else {
      return 'invalid unit';
    }
  };

  this.getReturnUnit = function (initUnit) {
    const conversionTable = {
      gal: 'L',
      L: 'gal',
      mi: 'km',
      km: 'mi',
      lbs: 'kg',
      kg: 'lbs',
    };
    return conversionTable[initUnit];
  };

  this.spellOutUnit = function (unit) {
    const conversionTable = {
      gal: 'gallons',
      L: 'liters',
      mi: 'miles',
      km: 'kilometers',
      lbs: 'pounds',
      kg: 'kilograms',
    };
    return conversionTable[unit];
  };

  this.convert = function (initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;

    switch (initUnit) {
      case 'gal':
        result = initNum * galToL;
        break;
      case 'L':
        result = initNum / galToL;
        break;
      case 'lbs':
        result = initNum * lbsToKg;
        break;
      case 'kg':
        result = initNum / lbsToKg;
        break;
      case 'mi':
        result = initNum * miToKm;
        break;
      case 'km':
        result = initNum / miToKm;
        break;
      default:
        result = null;
        break;
    }

    return result ? +result.toFixed(5) : result;
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    // 3.1 miles converts to 4.98895 kilometers
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`
  };
}

module.exports = ConvertHandler;
