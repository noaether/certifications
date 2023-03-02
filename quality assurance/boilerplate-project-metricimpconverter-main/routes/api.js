"use strict";

const expect = require("chai").expect;
const ConvertHandler = require("../controllers/convertHandler.js");

module.exports = function (app) {
  let convertHandler = new ConvertHandler();

  app.get("/api/convert", (req, res) => {
    const input = req.query.input; // 10L
    const initNum = convertHandler.getNum(input); // 10
    const initUnit = convertHandler.getUnit(input); // L
    const returnNum = convertHandler.convert(initNum, initUnit); // 2.64172
    const returnUnit = convertHandler.getReturnUnit(initUnit); // gal
    const string = convertHandler.getString(
      initNum,
      initUnit,
      returnNum,
      returnUnit
    ); // 10 liters converts to 2.64172 gallons

    if (initNum === "invalid number" && initUnit === "invalid unit") {
      res.send("invalid number and unit");
    } else if (initNum === "invalid number") {
      res.send("invalid number");
    } else if (initUnit === "invalid unit") {
      res.send("invalid unit");
    } else {
      res.json({
        initNum,
        initUnit,
        returnNum,
        returnUnit,
        string,
      });
    }
  });
};
