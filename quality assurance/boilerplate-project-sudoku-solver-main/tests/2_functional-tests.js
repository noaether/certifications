const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  suite('Routing test', () => {

    suite('POST request to /api/solve', () => {
      // #1
      test('solve a puzzle with valid puzzle string', (done) => {
        chai
          .request(server)
          .post('/api/solve')
          .send({puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
          .end(function(error, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
            done();
          });
      });

      // #2
      test('solve a puzzle with missing puzzle string', (done) => {
        chai
          .request(server)
          .post('/api/solve')
          .send({puzzle: ''})
          .end(function(error, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, 'Required field missing');
            done();
          });
      });

      // #3
      test('solve a puzzle with invalid characters', (done) => {
        chai
          .request(server)
          .post('/api/solve')
          .send({puzzle: 'AA5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
          .end(function(error, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, 'Invalid characters in puzzle');
            done();
          });
      });

      // #4
      test('solve a puzzle with incorrect length', (done) => {
        chai
          .request(server)
          .post('/api/solve')
          .send({puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'})
          .end(function(error, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
            done();
          });
      });

      // #5
      test('solve a puzzle that cannot be solved', (done) => {
        chai
          .request(server)
          .post('/api/solve')
          .send({puzzle: '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
          .end(function(error, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, 'Puzzle cannot be solved');
            done();
          });
      });
    });

    suite('POST request to /api/check', () => {
      // #1
      test('check a puzzle placement with all fields', (done) => {
        chai
          .request(server)
          .post('/api/check')
          .send({
            puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'A1',
            value: '1'
          })
          .end(function(error, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.valid, true);
            assert.notProperty(res.body, 'conflict');
            done();
          });
      });

      // #2
      test('check a puzzle placement with single placement conflict', (done) => {
        chai
          .request(server)
          .post('/api/check')
          .send({
            puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'A2',
            value: '7'
          })
          .end(function(error, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.valid, false);
            assert.include(res.body.conflict, 'column');
            assert.notInclude(res.body.conflict, 'row');
            assert.notInclude(res.body.conflict, 'region');
            done();
          });
      });

      // #3
      test('check a puzzle placement with multiple placement conflicts', (done) => {
        chai
          .request(server)
          .post('/api/check')
          .send({
            puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'B1',
            value: '3'
          })
          .end(function(error, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.valid, false);
            assert.include(res.body.conflict, 'column');
            assert.include(res.body.conflict, 'row');
            assert.notInclude(res.body.conflict, 'region');
            done();
          });
      });

      // #4
      test('check a puzzle placement with all placement conflicts', (done) => {
        chai
          .request(server)
          .post('/api/check')
          .send({
            puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'B2',
            value: '2'
          })
          .end(function(error, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.valid, false);
            assert.include(res.body.conflict, 'column');
            assert.include(res.body.conflict, 'row');
            assert.include(res.body.conflict, 'region');
            done();
          });
      });

      // #5
      test('check a puzzle placement with missing required fields', (done) => {
        chai
          .request(server)
          .post('/api/check')
          .send({
            puzzle: '',
            coordinate: '',
            value: ''
          })
          .end(function(error, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, 'Required field(s) missing');
            done();
          });
      });

      // #6
      test('check a puzzle placement with invalid characters', (done) => {
        chai
          .request(server)
          .post('/api/check')
          .send({
            puzzle: 'AA5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'B2',
            value: '2'
          })
          .end(function(error, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, 'Invalid characters in puzzle');
            done();
          });
      });

      // #7
      test('check a puzzle placement with incorrect length', (done) => {
        chai
          .request(server)
          .post('/api/check')
          .send({
            puzzle: '5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'B2',
            value: '2'
          })
          .end(function(error, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
            done();
          });
      });

      // #8
      test('check a puzzle placement with invalid placement coordinate', (done) => {
        chai
          .request(server)
          .post('/api/check')
          .send({
            puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'Z1',
            value: '1'
          })
          .end(function(error, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, 'Invalid coordinate');
            done();
          });
      });

      // #9
      test('check a puzzle placement with invalid placement value', (done) => {
        chai
          .request(server)
          .post('/api/check')
          .send({
            puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
            coordinate: 'A2',
            value: '0'
          })
          .end(function(error, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, 'Invalid value');
            done();
          });
      });
    });
    
  });
});
