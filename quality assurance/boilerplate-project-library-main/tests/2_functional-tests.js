/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

const Book = require("../models/book.js");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function (done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "Test Book" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.property(res.body, "_id");
              assert.property(res.body, "title");
              assert.equal(res.body.title, "Test Book");
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, "missing required field title");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "title");
            assert.property(res.body[0], "_id");
            assert.property(res.body[0], "commentcount");
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get("/api/books/5f5f5f5f5f5f5f5f5f5f5f5f")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        const book = new Book({ title: "Test Book" });
        book.save((err, savedBook) => {
          if (err) {
            console.log("Error saving book for test:", err);
            done(err);
          } else {
            chai
              .request(server)
              .get("/api/books/" + savedBook._id)
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, "title");
                assert.property(res.body, "_id");
                assert.property(res.body, "comments");
                assert.isArray(res.body.comments);
                done();
              });
          }
        });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          const book = new Book({ title: "Test Book" });
          book.save((err, savedBook) => {
            if (err) {
              console.log("Error saving book for test:", err);
              done(err);
            } else {
              const comment = "Test comment";
              chai
                .request(server)
                .post("/api/books/" + savedBook._id)
                .send({ comment })
                .end(function (err, res) {
                  assert.equal(res.status, 200);
                  assert.property(res.body, "title");
                  assert.property(res.body, "_id");
                  assert.property(res.body, "comments");
                  assert.isArray(res.body.comments);
                  assert.include(res.body.comments, comment);
                  done();
                });
            }
          });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          const book = new Book({ title: "Test Book" });
          book.save((err, savedBook) => {
            if (err) {
              console.log("Error saving book for test:", err);
              done(err);
            } else {
              chai
                .request(server)
                .post("/api/books/" + savedBook._id)
                .end(function (err, res) {
                  assert.equal(res.status, 200);
                  assert.equal(res.text, "missing required field comment");
                  done();
                });
            }
          });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          const comment = "Test comment";
          chai
            .request(server)
            .post("/api/books/invalid_id")
            .send({ comment })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, "no book exists");
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        const book = new Book({ title: "Test Book" });
        book.save((err, savedBook) => {
          if (err) {
            console.log("Error saving book for test:", err);
            done(err);
          } else {
            chai
              .request(server)
              .delete("/api/books/" + savedBook._id)
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, "delete successful");
                done();
              });
          }
        });

        test("Test DELETE /api/books/[id] with id not in db", function (done) {
          const fakeId = "6113fa90298f2b2468f0c3d9"; // A fake id that is not in the db
          chai
            .request(server)
            .delete("/api/books/" + fakeId)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, "no book exists");
              done();
            });
        });
      });
    });
  });
});
