function palindrome(str) {
  // Remove non-alphanumeric characters and convert to lowercase
  str = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
  // Check if the string is equal to its reverse
  return str === str.split('').reverse().join('');
}


palindrome("eye");
