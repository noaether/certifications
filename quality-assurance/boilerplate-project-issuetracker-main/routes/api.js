'use strict';

const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  project: { type: String, required: true },
  assigned_to: { type: String },
  status_text: { type: String },
  open: { type: Boolean, default: true },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now }
});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = function (app) {

  app.route('/api/issues/:project')
    // Create a new issue
    .post(function (req, res) {
      const project = req.params.project;
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        res.status(200).json({ error: 'required field(s) missing' });
        return { error: 'required field(s) missing' };
      } else {
        const issue = new Issue({
          project,
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to || '',
          status_text: req.body.status_text || '',
          created_on: new Date(),
          updated_on: new Date(),
          open: true
        });
        issue.save(function (err, savedIssue) {
          if (err) {
            res.status(500).send(err);
          } else {
            res.json(savedIssue);
          }
        });
      }
    })
    // Retrieve all issues for a project
    .get(function (req, res) {
      const project = req.params.project;
      const query = req.query;

      Issue.find({ project, ...query }, function (err, issues) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(issues);
        }
      })
    })
    // Update an existing issue
    .put(function (req, res) {
      const project = req.params.project;
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;
      if (!_id) {
        res.json({ error: 'missing _id' });
      } else if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open) {
        res.json({ error: 'no update field(s) sent', '_id': _id });
      } else {
        Issue.findById(_id, function (err, issue) {
          if (err || !issue) {
            res.json({ error: 'could not update', '_id': _id });
          } else {
            issue.issue_title = issue_title || issue.issue_title;
            issue.issue_text = issue_text || issue.issue_text;
            issue.created_by = created_by || issue.created_by;
            issue.assigned_to = assigned_to || '';
            issue.status_text = status_text || '';
            issue.updated_on = new Date();
            issue.open = open !== undefined ? open : issue.open;
            issue.save(function (err, savedIssue) {
              if (err) {
                res.json({ error: 'could not update', '_id': _id });
              } else {
                res.json({ result: 'successfully updated', '_id': _id });
              }
            });
          }
        })
      }
    })
    // Delete an issue
    .delete(function (req, res) {
      const project = req.params.project;
      const _id = req.body._id;
      Issue.findByIdAndDelete(_id, function (err, issue) {
        if (!_id) {
          return res.json({ error: 'missing _id' });
        } else if (!issue || err) {
          return res.json({ error: 'could not delete', _id });
        } else {
          return res.json({ result: 'successfully deleted', _id });
        }
      });
    });
};
