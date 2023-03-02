'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      if (!solver.validateChar(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      if (!solver.validateLength(puzzle)) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      // Check for valid coordinate and value input and 
      let row = coordinate.match(/^[a-i](?=[1-9]$)/gi);
      let column = coordinate.match(/(?<=^[a-i])[1-9]$/gi);
      value = value.match(/^[1-9]$/g);

      if (!row || !column) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (!value) {
        return res.json({ error: 'Invalid value' });
      }

      // Run check placement function
      row = row[0];
      column = column[0];
      value = value[0];
      let valid = true;
      let conflict = [];

      if (!solver.checkRowPlacement(puzzle, row, column, value)) {
        valid = false;

        conflict.push('row');
      }

      if (!solver.checkColPlacement(puzzle, row, column, value)) {
        valid = false;

        conflict.push('column');
      }

      if (!solver.checkRegionPlacement(puzzle, row, column, value)) {
        valid = false;

        conflict.push('region');
      }

      if (!valid) {
        return res.json({
          valid: valid,
          conflict: conflict
        });
      } else {
        return res.json({
          valid: valid
        });
      }

    });

  app.route('/api/solve')
    .post((req, res) => {
      let { puzzle } = req.body;

      if (!puzzle) {
        return res.json({
          error: 'Required field missing'
        });
      } else if (!solver.validateChar(puzzle)) {
        return res.json({
          error: 'Invalid characters in puzzle'
        });
      } else if (!solver.validateLength(puzzle)) {
        return res.json({
          error: 'Expected puzzle to be 81 characters long'
        });
      } else if (!solver.solve(puzzle)) {
        return res.json({
          error: 'Puzzle cannot be solved'
        });
      } else {
        return res.json({
          solution: solver.solve(puzzle)
        });
      }
    });
};