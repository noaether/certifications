function rot13(str) {
  // define an empty string to store the decoded string
  let decoded = "";
  
  // loop through each character in the string
  for (let i = 0; i < str.length; i++) {
    // get the ASCII code of the character
    let charCode = str.charCodeAt(i);
    
    // decode alphabetic characters using the ROT13 cipher
    if (charCode >= 65 && charCode <= 90) { // check if the character is uppercase
      charCode = ((charCode - 65 + 13) % 26) + 65; // apply the ROT13 cipher
    }
    
    // add the decoded character to the decoded string
    decoded += String.fromCharCode(charCode);
  }
  
  return decoded;
}


rot13("SERR PBQR PNZC");
