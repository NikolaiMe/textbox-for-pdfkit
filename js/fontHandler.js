var fontkit = require("fontkit");

// Here we just return the ascents for the used font.
// Its needed to correctly align the font inside of a textbox.
// As fontkit only works with extra added .otf .ttf fonts
// but doesn't know anything about the pdfKit standard fonts, the ascents
// for the default fonts are returned manually. All other
// fonts get measured by fontkit.
// Thanks fontkit for being awesome ♥!

function getFontAscent(font, fontSize) {
    let ascentPerPoint = 0;
    switch (font) {
      case "Courier":
      case "Courier-Bold":
      case "Courier-Oblique":
      case "Courier-BoldOblique":
        ascentPerPoint = 629 / 1000;
        break;
      case "Helvetica":
      case "Helvetica-Bold":
      case "Helvetica-Oblique":
      case "Helvetica-BoldOblique":
        ascentPerPoint = 718 / 1000;
        break;
      case "Times-Roman":
      case "Times-Bold":
      case "Times-Italic":
      case "Times-BoldItalic":
        ascentPerPoint = 683 / 1000;
        break;
      case "Symbol":
      case "ZapfDingbats":
        ascentPerPoint = 500 / 1000;
        break;
      default:
        ascentPerPoint =
          fontkit.openSync(font).ascent / fontkit.openSync(font).unitsPerEm;
    }
  
    return fontSize * ascentPerPoint;
  }

  module.exports = getFontAscent;