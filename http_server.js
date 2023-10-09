// add http server
// -----------------------
const express = require("express");
const app = express();

var low = require("lowdb");
var fs = require("lowdb/adapters/FileSync");
var adapter = new fs("db.json");
var db = low(adapter);
let json = db.get("posts").value();

// configure express to serve static files from public directory
// ------------------------------------------------------------------
app.use(express.static("public"));

// init the data store
db.defaults({ posts: [] }).write();

// list posts
app.get("/data", function (req, res) {
  res.send(json);
});

// ----------------------------------------------------
// add post - test using:
//      curl http://localhost:3000/posts/ping/1/false
// ----------------------------------------------------
app.get("/posts/:title/:id/:published", function (req, res) {
  var post = {
    id: req.params.id,
    title: req.params.title,
    published: req.params.published,
  };

  db.get("posts").push(post).write();
  console.log(json);
  res.send(json);
});

// ----------------------------------------------------
// filter by published state - test using:
//      curl http://localhost:3000/published/true
// ----------------------------------------------------
app.get("/published/:boolean", function (req, res) {
  let publishedBoolean = [];
  if (req.params.boolean === "true") {
    json.filter((item) => {
      if (item.published === true || item.published === "true") {
        publishedBoolean.push(item);
      } else return;
    });
  } else {
    json.filter((item) => {
      if (item.published === false || item.published === "false") {
        publishedBoolean.push(item);
      } else return;
    });
  }
  res.send(publishedBoolean);
});

// ----------------------------------------------------
// update published value - test using:
//      curl http://localhost:3000/published/1/true
// ----------------------------------------------------
app.get("/published/:id/:boolean", function (req, res) {
  let boolVal = req.params.boolean === "true";
  let updatedArray = [];
  for (let i = 0; i < json.length; i++) {
    if (parseInt(json[i].id) === parseInt(req.params.id)) {
      json[i].published = boolVal;
      db.get("posts").write();
      updatedArray.push(json[i]);
    }
  }
  res.send(updatedArray);
});

// ----------------------------------------------------
// delete entry by id - test using:
//      curl http://localhost:3000/delete/5
// ----------------------------------------------------
app.get("/delete/:id/", function (req, res) {
  let numberReqId = parseInt(req.params.id);
  for (let i = 0; i < json.length; i++) {
    let numberId = parseInt(json[i].id);
    if (numberId === numberReqId) {
      json.splice(i, 1);
      db.get("posts").write();
    }
  }
  res.send(json);
});

// start server
// -----------------------
app.listen(3000, function () {
  console.log("Running on port 3000!");
});
