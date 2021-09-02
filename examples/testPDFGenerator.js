const addTextbox = require("textbox-for-pdfkit"); // Import the package
const PDFDocument = require("pdfkit"); // Of course you need pdfkit
const fs = require("fs"); // fs is helpful for storing the pdf in your file system.

/* 
Creating the array of text objects
as you can see a text object contains a text attribute, plus styling attributes.
All of those text objects are packed into an array, which is later passed
to the textbox. This array is later passed to the textbox. You'll see below :)
*/
const testTextArray = [
  {
    text: "This is some text. ",
  },
  {
    text: "This is more text in the same line, but with larger font. ",
    fontSize: 20,
  },
  {
    text: "This is text with some\nnewlines\nin it. ",
  },
  { text: "blue text ", newLine: true, color: "blue" },
  { text: "red text ", color: "red" },
  { text: "green small text ", fontSize: 5, color: "green" },
  { text: "Different ", font: "Helvetica-Bold", newLine: true },
  { text: "fonts ", font: "Helvetica-Oblique" },
  { text: "in ", font: "Helvetica" },
  { text: "one ", font: "Courier" },
  { text: "Line ", font: "Times-BoldItalic" },
  {
    text: "- Oh its right aligned",
    fontSize: 9,
    newLine: true,
    align: "right",
  },
];

// The actual test-function

function testMe() {
  // You need to create a PDFKit document first
  const doc = new PDFDocument({
    size: [500, 500],
    margin: 0,
  });
  // Tell PDFKit where to store the PDF after creation
  doc.pipe(fs.createWriteStream(__dirname + "/test.pdf"));

  /* 
  Here we go! Let's add the Textbox to the doc.
  Just call the addTextbox() function (imported via the package) and pass
  the textArray, the doc, the x-position, the y-postion and the width of your textbox.
  Optional you can also pass some default stylings --> If you don't give a special
  style to a text-object in the text-area (like I did in the very first text object of the array)
  the text will just inherit the default style from the textbox.
  */
  addTextbox(testTextArray, doc, 100, 100, 200, {
    color: "black",
    fontSize: 13,
    lineHeight: 1.5,
    align: "center",
  });
  // That's it! Call doc.end() and the pdf with a wonderful textbox is created.
  doc.end();
}

exports.testMe = testMe;
