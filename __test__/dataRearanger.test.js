const {
  summarizeParagraphs,
  normalizeTexts,
  normalizeLinebreaks,
  normalizeLineHeight,
  createLine,
} = require("../dataRearanger");

const {
  textboxStyle,
  longText,
  newLineFirst,
  newLineSecond,
  multiStyleLine2,
  lastLineWithStyle,
  testText,
  normalizedTestText,
  testLine,
} = require("./testData");

test("dataRearanger: NormalizeTexts creates a new text object when linebreaks are found inside text", () => {
  // There are 7 Text objects in testText which contain two "\n" linebreaks
  const normalizedText = normalizeTexts(testText, textboxStyle);

  // After normalization there must be 9 Textobjects
  expect(normalizedText.length).toBe(9);

  // The texts which contained "\n" earlier don't contain the "\n" anymore
  expect(normalizedText[2].text).toBe(newLineFirst);
  expect(normalizedText[3].text).toBe("");
  expect(normalizedText[4].text).toBe(newLineSecond);

  // The new created Text objects have set the "newLine" attributes to true
  expect(normalizedText[2].newLine).toBe(false);
  expect(normalizedText[3].newLine).toBe(true);
  expect(normalizedText[4].newLine).toBe(true);
});

test("dataRearanger: NormalizeTexts adds styling correctly", () => {
  const normalizedText = normalizeTexts(testText, textboxStyle);

  // Text which is not styled inherits everything from the textbox default style
  expect(normalizedText[0].text).toBe(longText);
  expect(normalizedText[0].font).toBe(textboxStyle.font);
  expect(normalizedText[0].fontSize).toBe(textboxStyle.fontSize);
  expect(normalizedText[0].align).toBe(textboxStyle.align);
  expect(normalizedText[0].color).toBe(textboxStyle.color);
  expect(normalizedText[0].lineHeight).toBe(
    textboxStyle.lineHeight * textboxStyle.fontSize
  );
  expect(normalizedText[0].newLine).toBe(false);
  expect(normalizedText[0].removeSubsequentSpaces).toBe(true);

  // Text which is styled partly, takes the available styles from text and everything else from textbox
  expect(normalizedText[6].text).toBe(multiStyleLine2);
  expect(normalizedText[6].font).toBe(textboxStyle.font);
  expect(normalizedText[6].fontSize).toBe(testText[4].fontSize);
  expect(normalizedText[6].align).toBe(textboxStyle.align);
  expect(normalizedText[6].color).toBe(textboxStyle.color);
  expect(normalizedText[6].lineHeight).toBe(
    textboxStyle.lineHeight * textboxStyle.fontSize
  );
  expect(normalizedText[6].newLine).toBe(false);
  expect(normalizedText[6].removeSubsequentSpaces).toBe(true);

  // Text which is styled completely takes everything from text.
  expect(normalizedText[8].text).toBe(lastLineWithStyle);
  expect(normalizedText[8].font).toBe(testText[6].font);
  expect(normalizedText[8].fontSize).toBe(testText[6].fontSize);
  expect(normalizedText[8].align).toBe(testText[6].align);
  expect(normalizedText[8].color).toBe(testText[6].color);
  expect(normalizedText[8].lineHeight).toBe(
    testText[6].lineHeight * testText[6].fontSize
  );
  expect(normalizedText[8].newLine).toBe(true);
  expect(normalizedText[8].removeSubsequentSpaces).toBe(true);
});

test("dataRearanger: normalizeLineHeight does its job correctly", () => {
  // If there is neither lineHeight nor font size defined --> take fontsize and lineHeight from
  // Textbox and multiply
  const textWithoutStyleNormalized = normalizeLineHeight(
    testText[0],
    textboxStyle
  );
  expect(textWithoutStyleNormalized.lineHeight).toBe(
    textboxStyle.lineHeight * textboxStyle.fontSize
  );

  // If there is fontSize but no lineHeight defined --> take fontsize and lineHeight from
  // Textbox and multiply
  const textWithFontSizeNormalized = normalizeLineHeight(
    testText[4],
    textboxStyle
  );
  expect(textWithFontSizeNormalized.lineHeight).toBe(
    textboxStyle.lineHeight * textboxStyle.fontSize
  );

  // If there is lineHeight but no font size defined --> take fontsize from textbox and lineHeight from
  // text object and multiply
  const textWithLineHeight = { ...testText, lineHeight: 2 };
  const textWithLineHeightNormalized = normalizeLineHeight(
    textWithLineHeight,
    textboxStyle
  );
  expect(textWithLineHeightNormalized.lineHeight).toBe(
    textWithLineHeight.lineHeight * textboxStyle.fontSize
  );

  // If there is both lineHeight and font size defined --> take fontsize and lineHeight from
  // text object and multiply
  const textWithFullStyleNormalized = normalizeLineHeight(
    testText[6],
    textboxStyle
  );
  expect(textWithFullStyleNormalized.lineHeight).toBe(
    testText[6].lineHeight * testText[6].fontSize
  );
});

test("dataRearanger: normalizeLinebreaks finds all newline markers in text and generates an array item for every line", () => {
  const multilineText = {
    font: "Times-Roman",
    fontSize: 12,
    lineHeight: 12,
    align: "left",
    color: "#000000",
    removeSubsequentSpaces: true,
    text: "This\nis\na\ntext\nwith\nmany\nnew Lines\n\n\nand even more",
    newLine: false,
  };
  const lineArray = normalizeLinebreaks(multilineText);

  // Each line inherits the attribute from the object which generated the lines
  lineArray.forEach((textItem) => {
    expect(textItem.font).toBe(multilineText.font);
    expect(textItem.fontSize).toBe(multilineText.fontSize);
    expect(textItem.lineHeight).toBe(multilineText.lineHeight);
    expect(textItem.align).toBe(multilineText.align);
    expect(textItem.color).toBe(multilineText.color);
    expect(textItem.removeSubsequentSpaces).toBe(
      multilineText.removeSubsequentSpaces
    );
  });

  // Each line has set the newLine attribute correctly and has the correct text
  expect(lineArray[0].text).toBe("This");
  expect(lineArray[0].newLine).toBe(false);

  expect(lineArray[1].text).toBe("is");
  expect(lineArray[1].newLine).toBe(true);

  expect(lineArray[2].text).toBe("a");
  expect(lineArray[2].newLine).toBe(true);

  expect(lineArray[3].text).toBe("text");
  expect(lineArray[3].newLine).toBe(true);

  expect(lineArray[4].text).toBe("with");
  expect(lineArray[4].newLine).toBe(true);

  expect(lineArray[5].text).toBe("many");
  expect(lineArray[5].newLine).toBe(true);

  expect(lineArray[6].text).toBe("new Lines");
  expect(lineArray[6].newLine).toBe(true);

  expect(lineArray[7].text).toBe("");
  expect(lineArray[7].newLine).toBe(true);

  expect(lineArray[8].text).toBe("");
  expect(lineArray[8].newLine).toBe(true);

  expect(lineArray[9].text).toBe("and even more");
  expect(lineArray[9].newLine).toBe(true);
});

test("dataRearanger: summarizeParagraphs summarizes paragraphs correctly", () => {
  const summarizedText = summarizeParagraphs(normalizedTestText);

  // As our test data contains 5 paragraphs --> Number of found paragraphs must be 5
  expect(summarizedText.length).toBe(5);

  // Data is not changed after generating paragraphs and order is still correct
  counter = 0;
  summarizedText.forEach((paragraph) => {
    paragraph.forEach((text) => {
      expect(text.font).toBe(normalizedTestText[counter].font);
      expect(text.fontSize).toBe(normalizedTestText[counter].fontSize);
      expect(text.lineHeight).toBe(normalizedTestText[counter].lineHeight);
      expect(text.align).toBe(normalizedTestText[counter].align);
      expect(text.color).toBe(normalizedTestText[counter].color);
      expect(text.removeSubsequentSpaces).toBe(
        normalizedTestText[counter].removeSubsequentSpaces
      );
      expect(text.text).toBe(normalizedTestText[counter].text);
      expect(text.newLine).toBe(normalizedTestText[counter].newLine);
      counter++;
    });
  });

  // Paragraphs are summarized correctly
  expect(summarizedText[0].length).toBe(3);
  expect(summarizedText[1].length).toBe(1);
  expect(summarizedText[2].length).toBe(1);
  expect(summarizedText[3].length).toBe(3);
  expect(summarizedText[4].length).toBe(1);
});

test("dataRearanger: createLine formats Line data correctly", () => {
  const line1 = createLine(testLine);

  // Line infos are summarized correctly
  expect(line1.width).toBe(123 + 45 + 67);
  expect(line1.lineHeight).toBe(12);
  expect(line1.align).toBe("left");

  // All data is transfered correctly into line
  line1.texts.forEach((text, index) => {
    expect(text.font).toBe(testLine[index].font);
    expect(text.fontSize).toBe(testLine[index].fontSize);
    expect(text.lineHeight).toBeUndefined();
    expect(text.align).toBeUndefined();
    expect(text.color).toBe(testLine[index].color);
    expect(text.removeSubsequentSpaces).toBe(
      testLine[index].removeSubsequentSpaces
    );
    expect(text.text).toBe(testLine[index].text);
    expect(text.width).toBe(testLine[index].width);
    expect(text.newLine).toBe(testLine[index].newLine);
  });

  // Now play around with style data of line text and check whether they are added to line object correctly

  testLine[1].lineHeight = 24;
  testLine[1].width = 89;
  const line2 = createLine(testLine);
  // Line infos are summarized correctly --> Width and lineHeight is adapted
  expect(line2.width).toBe(123 + 89 + 67);
  expect(line2.lineHeight).toBe(24);
  expect(line2.align).toBe("left");

  testLine[1].align = "right";
  const line3 = createLine(testLine);
  // Line infos are summarized correctly --> no changes because first text defines the alignment of the line
  expect(line3.width).toBe(123 + 89 + 67);
  expect(line3.lineHeight).toBe(24);
  expect(line3.align).toBe("left");

  testLine[0].align = "right";
  const line4 = createLine(testLine);
  // Line infos are summarized correctly --> align changes because first text defines the alignment of the line
  expect(line4.width).toBe(123 + 89 + 67);
  expect(line4.lineHeight).toBe(24);
  expect(line4.align).toBe("right");
});
