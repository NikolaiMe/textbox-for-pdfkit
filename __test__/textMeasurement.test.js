const PDFDocument = require("pdfkit");
const {
  measureTextsWidth,
  measureTextWidth,
  checkParagraphFitsInLine,
  measureTextFragments,
} = require("../textMeasurement");

const doc = new PDFDocument({
  size: [500, 500],
  margin: 0,
});

const {
  testTextsForLineWidthMeasurement,
  normalizedTestText,
} = require("./testData");

test("textMeasurement: measureTextWidth measures text width correctly", () => {
  testTextsForLineWidthMeasurement.forEach((text) => {
    const textWidth = measureTextWidth(
      text.text,
      text.font,
      text.fontSize,
      doc
    );
    expect(textWidth).toBe(text.expectedLength);
  });
});

test("textMeasurement: measureTextWidth measures all text width correctly and adds them to text object", () => {
  const expectedWidths = [
    523.344,
    251.988,
    231.06,
    0,
    273.192,
    67.33200000000001,
    47.22,
    37.668,
    57.294,
  ];
  const textsWithWidth = measureTextsWidth(normalizedTestText, doc);

  textsWithWidth.forEach((text, index) => {
    expect(text.width).toBe(expectedWidths[index]);
  });
});

test("textMeasurement: checkParagraphFitsInLine adds data correctly", () => {
  const testParagraph = [
    { width: 10 },
    { width: 20 },
    { width: 30 },
    { width: 41 },
  ];

  expect(checkParagraphFitsInLine(testParagraph, 200)).toBeTruthy();
  expect(checkParagraphFitsInLine(testParagraph, 101)).toBeTruthy();
  expect(checkParagraphFitsInLine(testParagraph, 100.9)).toBeFalsy();
  expect(checkParagraphFitsInLine(testParagraph, 10)).toBeFalsy();
});

test("textMeasurement: measureTextFragments measures fragments correctly", () => {
  const testFragments = ["hello", " ", "this", " ", "is", " ", "text"];
  const expectedWidths = [24, 10, 17.34, 10, 8.004, 10, 17.82];

  const measuredTextFragments = measureTextFragments(
    testFragments,
    10,
    "Times-Roman",
    12,
    doc
  );

  measuredTextFragments.forEach((text, index) => {
    expect(text.text).toBe(testFragments[index]);
    expect(text.width).toBe(expectedWidths[index]);
  });
});
