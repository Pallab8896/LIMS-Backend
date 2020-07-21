var express = require("express"),
    app = express(),
    port = process.env.PORT || 4001;
mongoose = require("mongoose");
bodyParser = require("body-parser");
users = require("./Models/user-login-model");
books = require("./Models/books-model");
borrowedBooks = require("./Models/borrow-book-model");

mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/LIMS');
// mongoose.connect('mongodb+srv://LIMS:Pass%258896@cluster0-8le1t.mongodb.net/test?retryWrites=true&w=majority');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "HEAD,GET,POST,PATCH,OPTIONS,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var routes = require('./Routes/Routes'); //importing route
routes(app); //register the route

app.listen(port, () => {
  console.log('Server Started');
});

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});