const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const port = process.env.PORT || 5000;

//Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

//Handlebars Middleware
//load the view engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//static folder
app.use(express.static(path.join(__dirname, 'public')));


//Method-override middleware
app.use(methodOverride('_method'));

//express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true

}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Flash middleware
app.use(flash());

//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
//use routes
app.use('/ideas', ideas);
app.use('/users', users)

// How middleware works
// app.use((req, res,  next) => { //     console.log(Date.now());
//     req.name = 'Joshan';
//     next();
// });

// Index Route
app.get('/', (req, res) => {
    const title = 'Welcome to Home Page';
    res.render('index', {
        title: title
    });
});
app.get('/about', (req, res) => {
    const title = 'Welcome to About Page';
    res.render('about', {
        title: title
    });
});


app.listen(port, () => {
    console.log('Server staretd on port ' + port);
});