var low = require("lowdb");
var fs = require("lowdb/adapters/FileSync");
var adapter = new fs("db.json");
var db = low(adapter);

// init the data store
// ---------------------------
db.defaults({ posts: [] }).write();

// add post
// ----------------------------
db.get("posts")
  .push({ id: 1, title: "lowdb is cool", published: true })
  .write();
db.get("posts")
  .push({ id: 2, title: "Nice work fella!", published: true })
  .write();
db.get("posts")
  .push({ id: 3, title: "Awesome tricks", published: true })
  .write();
db.get("posts")
  .push({ id: 4, title: "Random title counts", published: false })
  .write();

//db.get("posts").pop().write();

let json = db.get("posts").value();

console.log(json);

// count posts
// ----------------------------
console.log(json.length);

// find all posts ids
// ----------------------------
for (let i = 0; i < json.length; i++) {
  console.log(json[i].id);
}

// all matches of published false
// ----------------------------
for (let i = 0; i < json.length; i++) {
  if (json[i].published === false) {
    console.log("Title:", json[i].title);
  }
}

// find post with published true
// ----------------------------
for (let i = 0; i < json.length; i++) {
  if (json[i].published === true) {
    console.log("Title:", json[i].title);
  }
}
