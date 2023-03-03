function telephoneCheck(str) {
  // define a regular expression to match valid US phone numbers
  let regex = /^(1\s?)?(\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;
  
  // test the input string against the regular expression
  return regex.test(str);
}

telephoneCheck("555-555-5555");
