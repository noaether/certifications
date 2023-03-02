"use strict";

const Translator = require("../components/translator.js");

module.exports = function (app) {
  const translator = new Translator();

  app.route("/api/translate").post((req, res) => {
    const { text, locale } = req.body;

    if (typeof text !== "string" || typeof locale !== "string") {
      return res.json({ error: "Required field(s) missing" });
    }

    if (text.length === 0) {
      return res.json({ error: "No text to translate" });
    }

    if (!["american-to-british", "british-to-american"].includes(locale)) {
      return res.json({ error: "Invalid value for locale field" });
    }

    const translation = translator.translate(text, locale);

    if (translation === text) {
      return res.json({ text, translation: "Everything looks good to me!" });
    }

    return res.json({ text, translation });
  });
};
