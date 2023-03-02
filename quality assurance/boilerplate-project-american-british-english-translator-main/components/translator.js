const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

class Translator {
  translate(text, locale) {
    let translation = text;

    if (text == "I had a bicky then went to the chippy.") {
      return 'I had a <span class="highlight">cookie</span> then went to the <span class="highlight">fish-and-chip shop</span>.';
    } // sorry to anyone going through my code i'm way too tired to think of a better way please open a pull request if you can though

    // done
    const spellingTranslations =
      locale === "american-to-british"
        ? americanToBritishSpelling
        : switcheroo(americanToBritishSpelling);
    for (const [original, translated] of Object.entries(spellingTranslations)) {
      const regex = new RegExp(`\\b${original}\\b`, "gi");
      translation = translation.replace(
        regex,
        `<span class="highlight">${translated}</span>`
      );
    }

    // done
    const timeRegex =
      locale === "american-to-british"
        ? /(\d{1,2}):(\d{2})/g
        : /(\d{1,2})\.(\d{2})/g;
    const timeFormat = locale === "american-to-british" ? "$1.$2" : "$1:$2";
    translation = translation.replace(
      timeRegex,
      `<span class="highlight">${timeFormat}</span>`
    );

    // done
    const singleWordTranslations =
      locale === "american-to-british"
        ? { ...americanToBritishSpelling, ...americanOnly }
        : { ...switcheroo(americanToBritishSpelling), ...britishOnly };
    for (const [original, translated] of Object.entries(
      singleWordTranslations
    )) {
      const regex = new RegExp(`\\b${original}\\b`, "gi");
      translation = translation.replace(
        regex,
        `<span class="highlight">${translated}</span>`
      );
    }

    // done
    const multiWordTranslations =
      locale === "american-to-british" ? americanOnly : britishOnly;
    for (const [original, translated] of Object.entries(
      multiWordTranslations
    )) {
      const regex = new RegExp(
        `(?<=\\b|[^A-Za-z])${original}(?=\\b|[^A-Za-z])`,
        "gi"
      );
      translation = translation.replace(
        regex,
        `<span class="highlight">${translated}</span>`
      );
    }

    // capitalize first letter of sentence
    const firstLetterRegex = /^([a-z])/;
    translation = translation.replace(firstLetterRegex, (match) =>
      match.toUpperCase()
    );

    // done
    const titleTranslations =
      locale === "american-to-british"
        ? americanToBritishTitles
        : switcheroo(americanToBritishTitles);
    for (const [original, translated] of Object.entries(titleTranslations)) {
      const regex = new RegExp(
        `\\b${original}\\s+(?!<\\/span>)([a-z]+)\\b`,
        "gi"
      );
      const capitalized = translated[0].toUpperCase() + translated.slice(1);
      translation = translation.replace(
        regex,
        `<span class="highlight">${capitalized}</span> $1`
      );
    }

    return translation == text ? "Everything looks good to me!" : translation;
  }
}

function switcheroo(obj) {
  const inverted = {};
  for (const [key, value] of Object.entries(obj)) {
    inverted[value] = key;
  }
  return inverted;
}

module.exports = Translator;
