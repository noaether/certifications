let express = require('express');
let app = express();
let bodyParser = require('body-parser')

console.log("Hello World")

app.get("/",
  function(req, res) {
    res.sendFile(__dirname + "/views/index.html");
  }
)
app.use("/public/", express.static(__dirname + "/public/"));

app.use("/json", function(req, res, next) {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
})

app.get("/json",
  function(req, res) {
    const json = process.env.MESSAGE_STYLE == "uppercase" ? { "message": "HELLO JSON" } : { "message": "Hello json" }
    res.json(json);
  }
)

app.get('/now', function(req, res, next) {
  req.time = new Date().toString();  // Hypothetical synchronous operation
  next();
}, function(req, res) {
  res.send({"time": req.time});
});

app.get('/:word/echo', function(req, res) {
  res.json({echo: req.params.word})
})

app.use("/name", bodyParser.urlencoded({extended: false}))

app.route("/name").get(
  function(req, res) { res.json({'name': `${req.query.first} ${req.query.last}`})}
).post(
  function(req, res) { res.json({'name': `${req.body.first} ${req.body.last}`})}
);

module.exports = app;
