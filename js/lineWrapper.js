const {
  measureTextFragments,
  measureTextWidth,
  checkParagraphFitsInLine,
} = require("./textMeasurement");

const { createLine } = require("./dataRearanger");

function lineWrapParagraph(paragraph, textWidth, doc) {
  // this function turns paragraphs into printable, wrapped lines

  // First check, whether paragraph fits in one line --> If yes return paragraph as line
  if (checkParagraphFitsInLine(paragraph, textWidth)) {
    return [createLine(paragraph)];
  }
  // If it doesn't fit completely inside the line do the line wrapping stuff
  let spaceLeftInLine = textWidth;
  let line = [];
  let lines = [];
  paragraph.forEach((textpart) => {
    //First check whether the complete textpart fits in line
    if (textpart.width <= spaceLeftInLine) {
      //if yes: directly add it to the line
      line.push(textpart);
      spaceLeftInLine -= textpart.width;
    } else {
      //if it doesn't fit completely: add it word by word to the line
      const wrappedLines = wrapTextInLines(
        textpart,
        spaceLeftInLine,
        textWidth,
        doc
      );
      wrappedLines.forEach((wrappedLine, index, array) => {
        switch (index) {
          case 0:
            // First Array Item must be added to the current line
            // If there is an empty string (because line was already too full), don't add it
            if (wrappedLine.text !== "") line.push(wrappedLine);
            // If the line is currently empty and the wrapped Line does not fit (because its a long string without spaces), then it should be ignored.
            if (line.length > 0) {
              lines.push([...line]);
              line = [];
              spaceLeftInLine = textWidth;
            }
            break;
          case array.length - 1:
            // last Array Item must generate a new line (where more can be added)
            line.push(wrappedLine);
            spaceLeftInLine -= wrappedLine.width;
            break;
          default:
            // all other lines can just be added as line to the lines array
            // (because they are already full).
            lines.push([wrappedLine]);
            spaceLeftInLine = textWidth;
        }
      });
    }
  });
  // If the complete paragraph has been line wrapped: add the last line
  // to the lines array, even if it's not full, yet --> but only if it's not empty
  if (line.length !== 0) lines.push([...line]);

  // Generate from lines array normalized line objects.
  return lines.map((l) => {
    return createLine(l);
  });
}

function wrapTextInLines(textPart, widthLeft, widthTextbox, doc) {
  // This function splits up text into smallest fragments (words & spaces)
  // and adds then word by word to lines until line is full. Then the line
  // is added to a "lines-array". The first line can have less space (spaceLeft)
  // for all other lines it is expected, that the complete Texbox width
  // is available (widthTextbox)

  const { text, fontSize, font } = textPart;
  let spaceLeft = widthLeft;
  // This is some crazy positive lookbehind regex, it finds all spaces and "-"
  // This is neccessary that no characters are removed when splitting the text.
  const fragmentArray = text.split(/(?<=[ -])|(?= )/);
  const spaceWidth = measureTextWidth(" ", font, fontSize, doc);
  const fragmentArrayWithWidth = measureTextFragments(
    fragmentArray,
    spaceWidth,
    font,
    fontSize,
    doc
  );
  const lines = [];
  let lineText = "";
  let lineWidth = 0;
  fragmentArrayWithWidth.forEach((textFragment) => {
    // Here we fill fragment by Fragment in lines
    if (textFragment.width <= spaceLeft) {
      // If it fits in line --> Add to line
      lineWidth += textFragment.width;
      spaceLeft -= textFragment.width;
      lineText = lineText + textFragment.text;
    } else if (textFragment.text !== " ") {
      // If it doesn't fit, add full line to lines, and add text to new line.
      // If there are many spaces at a line end --> ignore them.
      lines.push({ ...textPart, text: lineText, width: lineWidth });
      lineText = "";
      lineWidth = 0;
      spaceLeft = widthTextbox;
      lineWidth += textFragment.width;
      spaceLeft -= textFragment.width;
      lineText = lineText + textFragment.text;
    }
  });
  if (lineText !== "") {
    lines.push({ ...textPart, text: lineText, width: lineWidth });
  }
  return lines;
}

function removeSubsequentSpaces(lines, doc) {
  // Words in Textfragments do always keep the space at the end. This is
  // for left aligned texts no problem but can look quite ugly for right
  // aligned texts. So there is the option to remove them (removing is default active)
  // The function basically just goes through every line and checks whether last
  // Character is a space. If yes it's removed
  return lines.map((line) => {
    const lastText = line.texts[line.texts.length - 1]; // last text item in line
    if (!lastText.removeSubsequentSpaces) return line;
    if (lastText.text.substring(lastText.text.length - 1) !== " ") return line;
    const newLastText = lastText.text.substring(0, lastText.text.length - 1);
    const newLastTextWidth = measureTextWidth(
      newLastText,
      lastText.font,
      lastText.fontSize,
      doc
    );
    lastText.text = newLastText;
    lastText.width = newLastTextWidth;
    let newLineWidth = 0;
    line.texts.forEach((text) => {
      newLineWidth += text.width;
    });
    line.width = newLineWidth;
    return line;
  });
}

exports.lineWrapParagraph = lineWrapParagraph;
exports.wrapTextInLines = wrapTextInLines;
exports.removeSubsequentSpaces = removeSubsequentSpaces;
