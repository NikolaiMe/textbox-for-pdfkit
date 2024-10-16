const getFontAscent = require("./fontHandler");
const { normalizeTexts, summarizeParagraphs } = require("./dataRearanger");
const { measureTextsWidth } = require("./textMeasurement");
const { lineWrapParagraph, removeSubsequentSpaces } = require("./lineWrapper");

// This is the main package of textbox-for-pdfkit. It is the main function
// which prepares the data by calling all the subfunctions.
// Also it handles the drawing of the text on the pdf, after it was prepared.

// Default Style. If one style attribute is not set when calling addTextbox, the
// respective default attribute is set.
const defaultStyle = {
  font: "Times-Roman",
  fontSize: 12,
  lineHeight: 1,
  align: "left",
  color: "#000000",
  removeSubsequentSpaces: true,
  link: null,
  oblique: 0,
  underline: false,
};

// This is the only function which is needed in the end. It calls
// every needed function step by step. Details what all functions
// are doing can be found in the respective packages (where the functions
// are defined)

function addTextbox(text, doc, posX, posY, width, style = {}, height = null) {
  const textboxStyle = { ...defaultStyle, ...style };
  const normalizedTexts = normalizeTexts(text, textboxStyle);
  const textsWithWidth = measureTextsWidth(normalizedTexts, doc);
  const paragraphedTexts = summarizeParagraphs(textsWithWidth);
  const lines = paragraphedTexts.flatMap((pTexts) => {
    return lineWrapParagraph(pTexts, width, doc);
  });
  const optimizedLines = removeSubsequentSpaces(lines, doc);

  const baseline = style.baseline || "alphabetic";

  drawTextLinesOnPDF(optimizedLines, width, posX, posY, textboxStyle, doc, baseline, height);
}

// This function takes the prepared Data and draws everything on the right
// position of the PDF

function drawTextLinesOnPDF(lines, width, posX, posY, defaultStyle, doc, baseline, height) {
  let currentHeight = 0;
  let yPosition =
    posY + getFontAscent(defaultStyle.font, defaultStyle.fontSize);
  lines.forEach((line, index) => {
    currentHeight += line.lineHeight;
    // we'll not go over the provided height, if any
    if (height && (currentHeight > height))
      return;
    if (index !== 0) yPosition += line.lineHeight;
    let xPosition = getLineStartXPosition(line, width, posX);
    line.texts.forEach((textPart) => {
      doc
        .font(textPart.font)
        .fontSize(textPart.fontSize)
        .fillColor(textPart.color)
        .text(textPart.text, xPosition, yPosition, {
          link: textPart.link,
          align: "left",
          baseline: baseline,
          oblique: textPart.oblique,
          underline: textPart.underline,
          strike: textPart.strike,
        });
      xPosition += textPart.width;
    });
  });
}

// This function handles the setting of the line start X-position
// depending on its "align" attribute
function getLineStartXPosition(line, width, posX) {
  const spaceLeft = width - line.width;
  if (spaceLeft < 0) return posX;

  switch (line.align) {
    case "left":
      return posX;
    case "center":
      return posX + spaceLeft / 2;
    case "right":
      return posX + spaceLeft;
    default:
      return posX;
  }
}

module.exports = addTextbox;
