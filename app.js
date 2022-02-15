//Requiring packages
var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    mongoose         = require("mongoose"),
    // seedDB           = require("./seed"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    User             = require("./models/user"),
    methodOverride   = require("method-override"),
    flash            = require("connect-flash");
    cookieParser     = require("cookie-parser");
    j_food           = require("./models/j_food"),
    Comment          = require("./models/comment"),
    User             = require("./models/user"),
    MongoClient      = require('mongodb').MongoClient
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    j_foodRoutes = require("./routes/j_foods"),
    indexRoutes      = require("./routes/index");

//Using packages
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mydb';
const port = process.env.PORT || 3000;

mongoose.connect(uri, { useNewUrlParser: true}, err => {
    console.log('Database connection error: ' + err)
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(cookieParser('secret'));



//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "yennb",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

//Use routes
app.use(indexRoutes);
app.use("/j_foods", j_foodRoutes);
app.use("/j_foods/:id/comments", commentRoutes);

//PORT to listen for request
app.listen(port,()=>{
    console.log(`server up at https://localhost:${port}`);
})
