const { htmlToText } = require('html-to-text');

const html = '<p>Hello, <strong>world!</strong></p>';
const text = htmlToText(html);

console.log(text); // output: "Hello, world!"
