const chai = require("chai");
let assert = chai.assert;
const ConvertHandler = require("../controllers/convertHandler.js");

let convertHandler = new ConvertHandler();

suite("Unit Tests", function () {
  suite("Function convertHandler.getNum(input)", function () {
    test("should correctly read a whole number input.", function () {
      assert.equal(convertHandler.getNum("42kg"), 42);
    });

    test("should correctly read a decimal number input.", function () {
      assert.equal(convertHandler.getNum("42.5kg"), 42.5);
    });

    test("should correctly read a fractional input.", function () {
      assert.equal(convertHandler.getNum("42/5kg"), 8.4);
    });

    test("should correctly read a fractional input with a decimal.", function () {
      assert.equal(convertHandler.getNum("42.5/5kg"), 8.5);
    });

    test("should return an error on double-fraction (i.e. 3/2/3).", function () {
      assert.equal(convertHandler.getNum("42.5/5/5kg"), "invalid number");
    });

    test("should correctly default to a numerical input of 1 when no numerical input is provided.", function () {
      assert.equal(convertHandler.getNum("kg"), 1);
    });
  });
  suite("Function convertHandler.getUnit(input)", function () {
    test("should correctly read each valid input unit.", function () {
      assert.equal(convertHandler.getUnit("42kg"), "kg");
      assert.equal(convertHandler.getUnit("42l"), "L");
      assert.equal(convertHandler.getUnit("42gal"), "gal");
      assert.equal(convertHandler.getUnit("42mi"), "mi");
      assert.equal(convertHandler.getUnit("42lbs"), "lbs");
    });

    test("should correctly return an error for an invalid input unit.", function () {
      assert.equal(convertHandler.getUnit("42kgs"), "invalid unit");
    });
  });
  suite("Function convertHandler.getReturnUnit(initUnit)", function () {
    test("should return the correct return unit for each valid input unit.", function () {
      assert.equal(convertHandler.getReturnUnit("kg"), "lbs");
      assert.equal(convertHandler.getReturnUnit("L"), "gal");
      assert.equal(convertHandler.getReturnUnit("gal"), "L");
      assert.equal(convertHandler.getReturnUnit("mi"), "km");
      assert.equal(convertHandler.getReturnUnit("lbs"), "kg");
    });
  });
  suite("Function convertHandler.spellOutUnit(unit)", function () {
    test("should return the correct return unit for each valid input unit.", function () {
      assert.equal(convertHandler.spellOutUnit("kg"), "kilograms");
      assert.equal(convertHandler.spellOutUnit("L"), "liters");
      assert.equal(convertHandler.spellOutUnit("gal"), "gallons");
      assert.equal(convertHandler.spellOutUnit("mi"), "miles");
      assert.equal(convertHandler.spellOutUnit("lbs"), "pounds");
    });
  });
  suite("Function convertHandler.convert(num, unit)", function () {
    test("should correctly convert gal to L.", function () {
      assert.equal(convertHandler.convert(1, "gal"), 3.78541);
    });

    test("should correctly convert L to gal.", function () {
      assert.equal(convertHandler.convert(1, "L"), 0.26417);
    });

    test("should correctly convert mi to km.", function () {
      assert.equal(convertHandler.convert(1, "mi"), 1.60934);
    });

    test("should correctly convert km to mi.", function () {
      assert.equal(convertHandler.convert(1, "km"), 0.62137);
    });

    test("should correctly convert lbs to kg.", function () {
      assert.equal(convertHandler.convert(1, "lbs"), 0.45359);
    });

    test("should correctly convert kg to lbs.", function () {
      assert.equal(convertHandler.convert(1, "kg"), 2.20462);
    });
  });
});
