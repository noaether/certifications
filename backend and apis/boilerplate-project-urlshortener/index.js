require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dns = require("dns");
const { Schema } = mongoose;

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(function(req, res, next) {
  var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
  var origin = req.headers.origin || '*';
  if (!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1) {
    console.log(origin);
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  }
  next();
});

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define URL schema
const urlSchema = new Schema({
  original_url: { type: String, required: true },
  short_url: { type: Number, required: true }
});

// Define URL model
const Url = mongoose.model("Url", urlSchema);

// Get the next available short URL
async function getNextShortUrl() {
  const result = await Url.findOne().sort({ short_url: -1 }).exec();
  if (result) {
    return result.short_url + 1;
  } else {
    return 1;
  }
}

// Handle POST request to create short URL
app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;
  // Verify URL
  const parsedUrl = new URL(url);
  dns.lookup(parsedUrl.hostname, async (err) => {
    if (err) {
      res.json({ error: "invalid URL" });
    } else {
      // Check if URL already exists
      const existingUrl = await Url.findOne({ original_url: url }).exec();
      if (existingUrl) {
        res.json({
          original_url: existingUrl.original_url,
          short_url: existingUrl.short_url
        });
      } else {
        // Create new short URL
        const shortUrl = await getNextShortUrl();
        const newUrl = new Url({
          original_url: url,
          short_url: shortUrl
        });
        await newUrl.save();
        res.json({
          original_url: newUrl.original_url,
          short_url: newUrl.short_url
        });
      }
    }
  });
});

// Handle GET request to redirect short URL
app.get("/api/shorturl/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;
  // Find URL by short URL
  const url = await Url.findOne({ short_url: shortUrl }).exec();
  if (url) {
    res.redirect(url.original_url);
  } else {
    res.json({ error: "short URL not found" });
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
