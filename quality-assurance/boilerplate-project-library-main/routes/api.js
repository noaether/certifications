/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
const Book = require('../models/book.js');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', function() {
  console.log('MongoDB database connection established successfully');
});

module.exports = function (app) {
  
  app.route('/api/books')
    .get(function (req, res){
      Book.find({}, (err, books) => {
        if (err) {
          return res.status(500).json({ error: 'Unable to get books.' });
        }
        res.json(books);
      });
    })
    
    .post(function (req, res){
      const { title } = req.body;
      if (!title) {
        return res.status(200).send('missing required field title');
      }
      const book = new Book({ title });
      book.save((err, savedBook) => {
        if (err) {
          return res.status(200).send('no book exists');
        }
        res.json({title: savedBook.title, _id: savedBook._id});
      });
    })
    
    .delete(function(req, res){
      Book.deleteMany({}, (err, response) => {
        if (err) {
          return res.status(500).json({ error: 'Unable to delete books.' });
        }
        res.send('complete delete successful');
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      const { id } = req.params;
      Book.findById(id, (err, book) => {
        if (err) {
          return res.status(200).send('no book exists');
        }
        if (!book) {
          return res.status(200).send('no book exists');
        }
        res.json({ title: book.title, _id: book._id, comments: book.comments});
      });
    })
    
    .post(function(req, res){
      const id = req.params.id;
      const comment = req.body.comment;
      if (!comment) {
        return res.status(200).send('missing required field comment');
      }
      Book.findByIdAndUpdate(id, { $push: { comments: comment } }, { new: true }, (err, updatedBook) => {
        if (err) {
          return res.status(200).send('no book exists' );
        }
        if (!updatedBook) {
          return res.status(200).send('no book exists' );
        }
        res.json({ title: updatedBook.title, _id: updatedBook._id, comments: updatedBook.comments});
      });
    })
  
    
    .put(function (req, res){
      const { id } = req.params;
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Please provide a book title.' });
      }
      Book.findByIdAndUpdate(id, { title }, { new: true }, (err, updatedBook) => {
        if (err) {
          return res.status(500).json({ error: 'Unable to update book.' });
        }
        if (!updatedBook) {
          return res.status(404).json({ error: 'Book not found.' });
        }
        res.json(updatedBook);
      });
    })
    
    .delete(function(req, res){
      const { id } = req.params;
      Book.findByIdAndRemove(id, (err, deletedBook) => {
        if (err) {
          return res.status(200).send('no book exists');
        }
        if (!deletedBook) {
          return res.status(200).send('no book exists');
        }
        res.send('delete successful');
      });
    });
};
