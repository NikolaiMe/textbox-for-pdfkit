const textboxStyle = {
  font: "Times-Roman",
  fontSize: 12,
  lineHeight: 1,
  align: "left",
  color: "#000000",
  removeSubsequentSpaces: true,
};

const longText =
  "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore. ";
const longWords = "Loremipsumdolorsitamet, consetetursadipscingelitr. ";
const newLineFirst = "dolore magna aliquyam erat, sed diam voluptua.";
const newLineSecond =
  "At vero eos et accusam et justo duo dolores et ea rebum. ";
const multiStyleLine1 = "Lorem ipsum ";
const multiStyleLine2 = "dolor ";
const multiStyleLine3 = "sit amet";
const lastLineWithStyle = "Diam voluptua";

const testText = [
  {
    text: longText,
  },
  {
    text: longWords,
  },
  {
    text: newLineFirst + "\n\n" + newLineSecond,
  },
  { text: multiStyleLine1, newLine: true },
  { text: multiStyleLine2, fontSize: 20 },
  { text: multiStyleLine3 },
  {
    text: lastLineWithStyle,
    fontSize: 9,
    newLine: true,
    align: "right",
    color: "#ff0000",
    lineHeight: 4,
    font: "Helvetica",
  },
];

const normalizedTestText = [
  {
    font: "Times-Roman",
    fontSize: 12,
    lineHeight: 12,
    align: "left",
    color: "#000000",
    removeSubsequentSpaces: true,
    text: longText,
    newLine: false,
  },
  {
    font: "Times-Roman",
    fontSize: 12,
    lineHeight: 12,
    align: "left",
    color: "#000000",
    removeSubsequentSpaces: true,
    text: longWords,
    newLine: false,
  },
  {
    font: "Times-Roman",
    fontSize: 12,
    lineHeight: 12,
    align: "left",
    color: "#000000",
    removeSubsequentSpaces: true,
    text: newLineFirst,
    newLine: false,
  },
  {
    font: "Times-Roman",
    fontSize: 12,
    lineHeight: 12,
    align: "left",
    color: "#000000",
    removeSubsequentSpaces: true,
    text: "",
    newLine: true,
  },
  {
    font: "Times-Roman",
    fontSize: 12,
    lineHeight: 12,
    align: "left",
    color: "#000000",
    removeSubsequentSpaces: true,
    text: newLineSecond,
    newLine: true,
  },
  {
    font: "Times-Roman",
    fontSize: 12,
    lineHeight: 12,
    align: "left",
    color: "#000000",
    removeSubsequentSpaces: true,
    text: multiStyleLine1,
    newLine: true,
  },
  {
    font: "Times-Roman",
    fontSize: 20,
    lineHeight: 12,
    align: "left",
    color: "#000000",
    removeSubsequentSpaces: true,
    text: multiStyleLine2,
    newLine: false,
  },
  {
    font: "Times-Roman",
    fontSize: 12,
    lineHeight: 12,
    align: "left",
    color: "#000000",
    removeSubsequentSpaces: true,
    text: multiStyleLine3,
    newLine: false,
  },
  {
    font: "Helvetica",
    fontSize: 9,
    lineHeight: 36,
    align: "right",
    color: "#ff0000",
    removeSubsequentSpaces: true,
    text: lastLineWithStyle,
    newLine: true,
  },
];

const testLine = [
  {
    font: "Times-Roman",
    fontSize: 12,
    lineHeight: 12,
    align: "left",
    color: "#000000",
    removeSubsequentSpaces: true,
    text: multiStyleLine1,
    width: 123,
    newLine: true,
  },
  {
    font: "Times-Roman",
    fontSize: 20,
    lineHeight: 12,
    align: "left",
    color: "#000000",
    removeSubsequentSpaces: true,
    text: multiStyleLine2,
    width: 45,
    newLine: false,
  },
  {
    font: "Times-Roman",
    fontSize: 12,
    lineHeight: 12,
    align: "left",
    color: "#000000",
    removeSubsequentSpaces: true,
    text: multiStyleLine3,
    width: 67,
    newLine: false,
  },
];

const testTextsForLineWidthMeasurement = [
  {
    text: "This is a test Text",
    expectedLength: 84.096,
    fontSize: 12,
    font: "Times-Roman",
  },
  {
    text: "This is another test Text with other length",
    expectedLength: 199.752,
    fontSize: 12,
    font: "Times-Roman",
  },
  {
    text: "This is a test Text",
    expectedLength: 98.11200000000001,
    fontSize: 14,
    font: "Times-Roman",
  },
  {
    text: "This is a test Text",
    expectedLength: 98.604,
    fontSize: 12,
    font: "Helvetica-Bold",
  },
];

exports.textboxStyle = textboxStyle;
exports.longText = longText;
exports.longWords = longWords;
exports.newLineFirst = newLineFirst;
exports.newLineSecond = newLineSecond;
exports.multiStyleLine1 = multiStyleLine1;
exports.multiStyleLine2 = multiStyleLine2;
exports.multiStyleLine3 = multiStyleLine3;
exports.lastLineWithStyle = lastLineWithStyle;
exports.testText = testText;
exports.normalizedTestText = normalizedTestText;
exports.testLine = testLine;
exports.testTextsForLineWidthMeasurement = testTextsForLineWidthMeasurement;
