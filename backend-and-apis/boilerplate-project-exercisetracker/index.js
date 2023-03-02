const express = require('express')
const app = express()
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
require('dotenv').config()

app.use(function(req, res, next) {
  var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
  var origin = req.headers.origin || '*';
  if (!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1) {
    console.log(origin);
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  }
  next();
})
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create a user schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Create an exercise schema and model
const exerciseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});
const Exercise = mongoose.model('Exercise', exerciseSchema);

// Create a new user
app.post('/api/users', function(req, res) {
  const username = req.body.username;
  const user = new User({ username });

  user.save((err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create new user' });
    } else {
      res.json({ username: data.username, _id: data._id });
    }
  });
});

app.get('/api/users', (req, res) => {
  User.find({}, (err, users) => {
    if (err) return console.error(err);
    res.json(users.map((user) => ({ username: user.username, _id: user._id })));
  });
});

// Add a new exercise to a user
app.post('/api/users/:_id/exercises', function(req, res) {
  const userId = req.params._id;
  const description = req.body.description;
  const duration = Number(req.body.duration);
  const date = req.body.date ? new Date(req.body.date) : new Date();

  const exercise = new Exercise({ userId, description, duration, date });

  exercise.save((err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create new exercise' });
    } else {
      User.findById(userId, (err, user) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to find user' });
        } else {
          const username = user.username;
          res.json({
            username,
            description,
            duration,
            date: date.toDateString(),
            _id: userId
          });
        }
      });
    }
  });
});

// Get the exercise log for a user
app.get('/api/users/:_id/logs', function(req, res) {
  const userId = req.params._id;
  const from = req.query.from ? new Date(req.query.from) : null;
  const to = req.query.to ? new Date(req.query.to) : null;
  const limit = req.query.limit ? parseInt(req.query.limit) : null;

  Exercise.find({ userId })
    .sort('-date')
    .exec((err, exercises) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to find exercises' });
      } else {
        if (from) {
          exercises = exercises.filter(exercise => exercise.date >= from);
        }
        if (to) {
          exercises = exercises.filter(exercise => exercise.date <= to);
        }
        if (limit) {
          exercises = exercises.slice(0, limit);
        }

        User.findById(userId, (err, user) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to find user' });
          } else {
            const username = user.username;
            const count = exercises.length;
            const log = exercises.map(exercise => ({
              description: exercise.description,
              duration: exercise.duration,
              date: exercise.date.toDateString()
            }));

            res.json({ username, count, _id: userId, log });
          }
        });
      }
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
