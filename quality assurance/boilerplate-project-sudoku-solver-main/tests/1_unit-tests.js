const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {

  suite('SudokuSolver', () => {
    // #1
    test('a valid puzzle string of 81 characters', () => {
      assert.isTrue(solver.validateLength('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'));
    });

    // #2
    test('a puzzle string with invalid characters (not 1-9 or .)', () => {
      assert.isNotTrue(solver.validateChar('a..sdfqw.e...8.5.9.9.25..H.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...Z'))
    });

    // #3
    test('a puzzle string that is not 81 characters in length', () => {
      assert.isNotTrue(solver.validateLength('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'));
      assert.isNotTrue(solver.validateLength('5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3..6379..1'));
    });

    // #4
    test('a valid row placement', () => {
      assert.isTrue(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'a', 1, 1));
      assert.isTrue(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'b', 3, 5));
    });

    // #5
    test('an invalid row placement', () => {
      assert.isNotTrue(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'a', 1, 4));
      assert.isNotTrue(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'i', 6, 1));
    });

    // #6
    test('a valid column placement', () => {
      assert.isTrue(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'a', 1, 5));
      assert.isTrue(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'B', 3, 8));
    });

    // #7 
    test('an invalid column placement', () => {
      assert.isNotTrue(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'i', 7, 2));
      assert.isNotTrue(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'i', 7, 7));
    });

    // #8
    test('logic handles a valid region (3x3 grid) placement', () => {
      assert.isTrue(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'A', 1, 3));
      assert.isTrue(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'd', 1, 5));
    });

    // #9
    test('an invalid region (3x3 grid) placement', () => {
      assert.isNotTrue(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'A', 1, 6));
      assert.isNotTrue(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'g', 4, 6));
    });

    // #10
    test('valid puzzle strings pass the solver', () => {
      assert.isOk(solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'));
      assert.isOk(solver.solve('5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'));
    });

    // #11
    test('invalid puzzle strings fail the solver', () => {
      assert.isNotOk(solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'));
      assert.isNotOk(solver.solve('5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3...567.'));
    });

    // #12
    test('solver returns the the expected solution for an incomplete puzzle', () => {
      assert.equal(solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
    });
  });
});