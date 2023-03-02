const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("POST request to /api/issues/{project}", function () {
    test("Create an issue with every field", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Every field filled in"
          );
          assert.equal(res.body.assigned_to, "Chai and Mocha");
          assert.equal(res.body.status_text, "In QA");
          assert.equal(res.body.open, true);
          done();
        });
    });

    test("Create an issue with only required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Required fields filled in",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Required fields filled in"
          );
          assert.equal(res.body.open, true);
          done();
        });
    });

    test("Create an issue with missing required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
    });
  });
  suite("GET request to /api/issues/{project}", function () {
    test("View issues on a project", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], "issue_title");
          assert.property(res.body[0], "issue_text");
          assert.property(res.body[0], "created_on");
          assert.property(res.body[0], "updated_on");
          assert.property(res.body[0], "created_by");
          assert.property(res.body[0], "assigned_to");
          assert.property(res.body[0], "open");
          assert.property(res.body[0], "status_text");
          assert.property(res.body[0], "_id");
          done();
        });
    });
    test("View issues on a project with one filter", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({ open: true })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body[0].open, true);
          done();
        });
    });
    test("View issues on a project with multiple filters", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({ open: true, assigned_to: "Chai and Mocha" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body[0].open, true);
          assert.equal(res.body[0].assigned_to, "Chai and Mocha");
          done();
        });
    });
  });
  suite("PUT request to /api/issues/{project}", function () {
    test("Update one field on an issue", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .end(function (err, res) {
          const id = res.body[0]._id;
          console.log(id);
          chai
            .request(server)
            .put("/api/issues/test")
            .send({
              _id: id,
              issue_title: "Updated Title",
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.result, 'successfully updated');
              assert.equal(res.body._id, id);
              done();
            });
        });
    });
    test("Update multiple fields on an issue", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .end(function (err, res) {
          const id = res.body[0]._id;
          chai
            .request(server)
            .put("/api/issues/test")
            .send({
              _id: id,
              issue_title: "Updated Title",
              issue_text: "Updated text",
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.result, 'successfully updated');
              assert.equal(res.body._id, id); 
              done();
            });
        });
    });
    test("Update an issue with missing _id", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          issue_title: "Updated Title",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });
    test("Update an issue with no fields to update", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .end(function (err, res) {
          const id = res.body[0]._id;
          chai
            .request(server)
            .put("/api/issues/test")
            .send({
              _id: id,
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, id);
              assert.equal(res.body.error, 'no update field(s) sent')
              done();
            });
        });
    });
    test("Update an issue with an invalid _id", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: "invalidid",
          issue_title: "Updated Title",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not update');
          assert.equal(res.body._id, 'invalidid')
          done();
        });
    });
  });
  suite("DELETE request to /api/issues/{project}", function () {
    test("Delete an issue", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .end(function (err, res) {
          const id = res.body[0]._id;
          chai
            .request(server)
            .delete("/api/issues/test")
            .send({
              _id: id,
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.result, 'successfully deleted');
              assert.equal(res.body._id, id)
              done();
            });
        });
    });
    test("Delete an issue with an invalid _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({
          _id: "invalidid",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not delete');
          assert.equal(res.body._id, 'invalidid' )
          done();
        });
    });
    test("Delete an issue with missing _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });
  });
});
