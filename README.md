# textbox-for-pdfkit

A package to easily create beautiful Textboxes with [PDFKit](https://www.npmjs.com/package/pdfkit)

## Description

PDFKit is a wonderful package to easily create PDFs in Node and in browser applications. But there is one issue which was reported several times but was never fixed: When using the "continued: true"-keyword in texts, combined with a text-alignment which is not "left", things start to get messy (see [1](https://github.com/foliojs/pdfkit/issues/774), [2](https://github.com/foliojs/pdfkit/issues/240)). So for example if you want to use multiple font sizes, fonts or colors in the same line, while having a text which is not left aligned, this won't work. This issue can be solved with this package.

The idea behind textbox-for-pdfkit is to define an area where some text shall be written and just pass an array of text-objects to that text-area. Each of those text-objects can have a individual styling. textbox-for-pdfkit handles the rest for you: It does line wrapping, alignment of texts and the styling.

textbox-for-pdfkit is made for smaller texts which need much styling and need to be positioned anywhere freely on the page. It's similar to the text box you know e.g. from MS Word or Excel. This does also mean that it is not designed for large multipage texts. Please rely in those cases on the standard-PDFKit-way to add texts.

## Installation

Install by using [npm](http://npmjs.org/). Use the following command after installing npm.

    npm install textbox-for-pdfkit

## Example

Let's create a pdf with a textbox. The resulting pdf for the code below [you can find here](https://github.com/NikolaiMe/textbox-for-pdfkit/raw/main/examples/test.pdf).

```javascript
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
  the textArray, the doc, the x-position, the y-postion and the width of your 
  textbox. Optional you can also pass some default stylings --> If you don't give 
  a special style to a text-object in the text-area (like I did e.g. in the very 
  first text object of the array) the text will just inherit the default style 
  from the textbox.
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

```

## Usage

The Package can only be used together with [PDFKit](https://www.npmjs.com/package/pdfkit). The package has basically just one function which needs to be called: `addTextbox()`. This is also the only function which is exported by the package. 

Import the function as follows:
```javascript
const addTextbox = require("textbox-for-pdfkit");
```

### The `addTextbox()` function
Syntax:
```javascript
addTextbox(textArray, doc, posX, posY, width, defaultStyle, height);
```
Function parameter description:
- **textArray:** An array of [Text Objects](#text-objects)
- **doc:** The doc object you get from PDFKit
- **posX:** The X-Position of the upper left corner of your Textbox (in PDF-points)
- **posY:** The Y-Position of the upper left corner of your Textbox (in PDF-points)
- **width:** The width of your Textbox (in PDF-points)
- **defaultStyle:** (optional) An object which defines the default styling of the whole textbox. The same styling keywords as in [Text Objects](#text-objects) (except "text", and "newline" attributes) can be used
- **height:** (optional) The maximum height of your Textbox (in PDF-points)

### <a name="text-objects"></a>Text Objects

A Text Object can have the following attributes

```javascript
{
  text: string,  
  font: string,
  fontSize: number,
  lineHeight: number,
  align: string,
  color: string,
  oblique: number,
  newline: bool,
  // -- the following are only working with a workaround described in last chapter ---
  link: string,
  underline: bool,
  strike: bool,
}
```
The Object attributes in detail:

**text** *(mandatory)*
- It contains the text which shall be written
- You can use '\n' for creating a new line

**font** *(optional)*
- Name of the font in which the text shall be written

**fontsize** *(optional)*
- The fontsize (in PDF-points) in which the text shall be written

**line height** *(optional)*
- The distance between two lines

**align** *(optional)*
- Horizontal text alignment
- Possible values: "left", "right", "center"

**color** *(optional)*
- The color in which the text shall be written
- Format: Either use standard css colors (like "red", "blue"...) or use html-notation ("#rrggbb")

**oblique** *(optional)*
- If you use another number then 0 your text will be italic by the degrees of the given number.
- Number space: 0 - 90

**newline** *(optional)*
- If set to `true` the text will start in a new line
- If set to `false` the text will be written in the same line as the text before

**link** *(optional)*
- **Known issue:** The clickable link is not directly on the text, but a little bit below. More info in chapter [Workaround for underline/strike/link issues](#workaround).
- Give a link in that string and the text will be a clickable link 

**underline** *(optional)*
- **Known issue:** The line is not directly under the text, but too low. More info in chapter [Workaround for underline/strike/link issues](#workaround).
- If set to `true` the given text will be underlined

**strike** *(optional)*
- **Known issue:** The line is not directly under the text, but too low. More info in chapter [Workaround for underline/strike/link issues](#workaround).
- If set to `true` the given text will be underlined

## <a name="workaround"></a>Workaround for underline/strike/link issues
*This workaround is available starting from version 0.2.0*

There is a [bug](https://github.com/foliojs/pdfkit/issues/994) in PDFKit library, which causes underlines, strike-through-lines and links to appear below its expected position. This bug only appears when using a different [text-baseline](https://www.w3schools.com/tags/canvas_textbaseline.asp) than "top". Unfortunately this library needs for most use cases the text-baseline "alphabetic".

But there are some use-cases where the "alphabetic" baseline is not needed. For example, when using only one type of font, with only one font-size. In this use case, text baseline "top" does the job perfectly, too.

So if you just want some centered, or right aligned text, which has some links, underlines or strikes inside, but never changes text size or font, then you will be glad to have this new feature.

If you add to the "default Style" of your textbox the line `baseline: "top"` (as shown in the example below) the features "link", "underline" and "strike" work as expected.

**!BUT!** If you add this, and use different fonts or different font-sizes you will see that your text is not correctly aligned.

Example [you can the find the result of the example here](https://github.com/NikolaiMe/textbox-for-pdfkit/raw/main/examples/testPartTwo.pdf):
```
   const testTextArrayTwo = [
    {
      text: "text 2 ",
    },
    { text: "striked", strike: true },
    {
      text: " ",
    },
    { text: "underlined", underline: true },
    {
      text: " ",
    },
    { text: "link", link: "www.google.com", color:"blue" },
  ];

  addTextbox(testTextArrayTwo, doc, 100, 100, 200, {
    color: "black",
    fontSize: 13,
    lineHeight: 1.5,
    align: "center",
    // this "baseline"-line below is very important to make strike, underline and link work
    baseline: "top",
  });
```

## Projects which use textbox-for-pdfkit
[jungeTrauer](https://jungetrauer.de/designer/TRAUERKARTE_HAND_001)

## Thank You
[PDFKit](https://www.npmjs.com/package/pdfkit) - For creating such a powerful PDF Creator.

[fontkit](https://www.npmjs.com/package/fontkit) - For providing the tools to measure fonts and texts.
