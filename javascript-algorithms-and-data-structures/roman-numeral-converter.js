function convertToRoman(num) {
  // define arrays for the Roman numeral symbols and their corresponding values
  const symbols = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  
  let roman = "";
  
  // loop through the values array, subtracting the corresponding value from num until num is 0
  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      roman += symbols[i];
      num -= values[i];
    }
  }
  
  return roman;
}


convertToRoman(36);
