const chai = require("chai");
const assert = chai.assert;

const Translator = require("../components/translator.js");

const translator = new Translator();

suite("Unit Tests", () => {
  suite("Translate to British English", () => {
    test("Translate Mangoes are my favorite fruit. to British English", (done) => {
      let str = "Mangoes are my favorite fruit.";
      let strChange =
        'Mangoes are my <span class="highlight">favourite</span> fruit.';
      let locale = "american-to-british";

      assert.equal(translator.translate(str, locale), strChange);
      done();
    });

    test("Translate I ate yogurt for breakfast. to British English", (done) => {
      let str = "I ate yogurt for breakfast.";
      let strChange =
        'I ate <span class="highlight">yoghurt</span> for breakfast.';
      let locale = "american-to-british";

      assert.equal(translator.translate(str, locale), strChange);
      done();
    });

    test("Translate We had a party at my friend's condo. to British English", (done) => {
      let str = "We had a party at my friend's condo.";
      let strChange =
        'We had a party at my friend\'s <span class="highlight">flat</span>.';
      let locale = "american-to-british";

      assert.equal(translator.translate(str, locale), strChange);
      done();
    });

    test("Translate Can you toss this in the trashcan for me? to British English", (done) => {
      let str = "Can you toss this in the trashcan for me?";
      let strChange =
        'Can you toss this in the <span class="highlight">bin</span> for me?';
      let locale = "american-to-british";

      assert.equal(translator.translate(str, locale), strChange);
      done();
    });

    test("Translate The parking lot was full. to British English", (done) => {
      let str = "The parking lot was full.";
      let strChange = 'The <span class="highlight">car park</span> was full.';
      let locale = "american-to-british";

      assert.equal(translator.translate(str, locale), strChange);
      done();
    });

    test("Translate Like a high tech Rube Goldberg machine. to British English", (done) => {
      let str = "Like a high tech Rube Goldberg machine.";
      let strChange =
        'Like a high tech <span class="highlight">Heath Robinson device</span>.';
      let locale = "american-to-british";

      assert.equal(translator.translate(str, locale), strChange);
      done();
    });

    test("Translate To play hooky means to skip class or work. to British English", (done) => {
      let str = "To play hooky means to skip class or work.";
      let strChange =
        'To <span class="highlight">bunk off</span> means to skip class or work.';
      let locale = "american-to-british";

      assert.equal(translator.translate(str, locale), strChange);
      done();
    });

    test("Translate No Mr. Bond, I expect you to die. to British English", (done) => {
      let str = "No Mr. Bond, I expect you to die.";
      let strChange =
        'No <span class="highlight">Mr</span> Bond, I expect you to die.';
      let locale = "american-to-british";

      assert.equal(translator.translate(str, locale), strChange);
      done();
    });

    test("Translate Dr. Grosh will see you now. to British English", (done) => {
      let str = "Dr. Grosh will see you now.";
      let strChange =
        '<span class="highlight">Dr</span> Grosh will see you now.';
      let locale = "american-to-british";

      assert.equal(translator.translate(str, locale), strChange);
      done();
    });

    test("Translate Lunch is at 12:15 today. to British English", (done) => {
      let str = "Lunch is at 12:15 today.";
      let strChange = 'Lunch is at <span class="highlight">12.15</span> today.';
      let locale = "american-to-british";

      assert.equal(translator.translate(str, locale), strChange);
      done();
    });
  });

  suite("Translate to American English", () => {
    test("We watched the footie match for a while.", (done) => {
      let str = "We watched the footie match for a while.";
      let strChange =
        'We watched the <span class="highlight">soccer</span> match for a while.';
      let locale = "british-to-american";

      assert.equal(translator.translate(str, locale), strChange);
      done();
    });

    test("Paracetamol takes up to an hour to work.", (done) => {
      let str = "Paracetamol takes up to an hour to work.";
      let strChange =
        '<span class="highlight">Tylenol</span> takes up to an hour to work.';
      let locale = "british-to-american";

      assert.equal(translator.translate(str, locale), strChange);
      done();
    });

    test("First, caramelise the onions.", (done) => {
      let str = "First, caramelise the onions.";
      let strChange =
        'First, <span class="highlight">caramelize</span> the onions.';
      let locale = "british-to-american";

      assert.equal(translator.translate(str, locale), strChange);
      done();
    });

    test("I spent the bank holiday at the funfair.", (done) => {
      let str = "I spent the bank holiday at the funfair.";
      let strChange =
        'I spent the <span class="highlight">public holiday</span> at the <span class="highlight">carnival</span>.';
      let locale = "british-to-american";

      assert.equal(translator.translate(str, locale), strChange);
      done();
    });

    test("I had a bicky then went to the chippy.", (done) => {
      let str = "I had a bicky then went to the chippy.";
      let strChange =
        'I had a <span class="highlight">cookie</span> then went to the <span class="highlight">fish-and-chip shop</span>.';
      let locale = "british-to-american";

      assert.equal(translator.translate(str, locale), strChange);
      done();
    });

    test("I've just got bits and bobs in my bum bag.", (done) => {
      let str = "I've just got bits and bobs in my bum bag.";
      let strChange =
        'I\'ve just got <span class="highlight">odds and ends</span> in my <span class="highlight">fanny pack</span>.';
      let locale = "british-to-american";

      assert.equal(translator.translate(str, locale), strChange);
      done();
    });

    test("The car boot sale at Boxted Airfield was called off.", (done) => {
      let str = "The car boot sale at Boxted Airfield was called off.";
      let strChange =
        'The <span class="highlight">swap meet</span> at Boxted Airfield was called off.';
      let locale = "british-to-american";

      assert.equal(translator.translate(str, locale), strChange);
      done();
    });

    test("Have you met Mrs Kalyani?", (done) => {
      let str = "Have you met Mrs Kalyani?";
      let strChange =
        'Have you met <span class="highlight">Mrs.</span> Kalyani?';
      let locale = "british-to-american";

      assert.equal(translator.translate(str, locale), strChange);
      done();
    });

    test("Prof Joyner of King's College, London.", (done) => {
      let str = "Prof Joyner of King's College, London.";
      let strChange =
        '<span class="highlight">Prof.</span> Joyner of King\'s College, London.';
      let locale = "british-to-american";

      assert.equal(translator.translate(str, locale), strChange);
      done();
    });

    test("Tea time is usually around 4 or 4.30.", (done) => {
      let str = "Tea time is usually around 4 or 4.30.";
      let strChange =
        'Tea time is usually around 4 or <span class="highlight">4:30</span>.';
      let locale = "british-to-american";

      assert.equal(translator.translate(str, locale), strChange);
      done();
    });
  });

  suite("Highlight Translation", () => {
    test("Mangoes are my favorite fruit.", (done) => {
      let str = "Mangoes are my favorite fruit.";
      let locale = "british-to-american";

      assert.equal(
        translator.translate(str, locale),
        "Everything looks good to me!"
      );
      done();
    });

    test("I ate yogurt for breakfast.", (done) => {
      let str = "I ate yogurt for breakfast.";
      let locale = "british-to-american";

      assert.equal(
        translator.translate(str, locale),
        "Everything looks good to me!"
      );
      done();
    });

    test("We watched the footie match for a while.", (done) => {
      let str = "We watched the footie match for a while.";
      let locale = "american-to-british";

      assert.equal(
        translator.translate(str, locale),
        "Everything looks good to me!"
      );
      done();
    });

    test("Paracetamol takes up to an hour to work.", (done) => {
      let str = "Paracetamol takes up to an hour to work.";
      let locale = "american-to-british";

      assert.equal(
        translator.translate(str, locale),
        "Everything looks good to me!"
      );
      done();
    });
  });
});
