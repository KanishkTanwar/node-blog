var bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer      = require("express-sanitizer"),
    mongoose       = require("mongoose"),
    express        = require("express"),
    app            = express();

mongoose.connect("mongodb://localhost:27017/blog_app");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("static"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
  title: String,
  body: String,
  image: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function (req, res) {
  res.redirect("/blogs")
})

app.get("/blogs", function (req, res) {
  Blog.find({}, function(err, blogs){
    if(err){
      console.log("error");
    } else {
      res.render("index", {blogs: blogs})
    }
  })
})

app.get("/blogs/new", function (req, res) {
      res.render("new");
})

app.post("/blogs", function (req, res) {
  console.log(req.body.blog.body);
  req.body.blog.body = req.sanitize(req.body.blog.body)
  Blog.create(req.body.blog, function(err, blog){
      if(err){
        console.log("error");
      } else {
        res.redirect("/blogs")
      }
  })
})

app.get("/blogs/:id", function (req, res) {
  Blog.findById(req.params.id, function(err, blogFound){
    if(err){
      console.log("Not found");
    } else {
      res.render("show", {blog: blogFound})
    }
  })
})


app.get("/blogs/:id/edit", function (req, res) {
  Blog.findById(req.params.id, function(err, blogFound){
    if (err){
      res.redirect("/blogs")
    } else {
      res.render("edit", {blog: blogFound})

    }
  })
})

app.put("/blogs/:id", function (req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body)
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blogFound){
    if (err){
      res.redirect("/blogs")
    } else {
      res.redirect("/blogs")
    }
  })
})

app.delete("/blogs/:id", function (req, res) {
  Blog.findByIdAndDelete(req.params.id, function(err){
    if (err){
      res.redirect("/blogs")
    } else {
      res.redirect("/blogs")
    }
  })
})

app.listen(8000, function () {
  console.log("connected");
})
