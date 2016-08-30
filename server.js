var express = require('express');
var passport = require('passport');
var util = require('util');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var GitHubStrategy = require('passport-github2').Strategy;
var partials = require('express-partials');
var GitHub     = require('github-api');

var allrepos;
var myToken;

var GITHUB_CLIENT_ID = "ec4c9e858d45e4073e06";
var GITHUB_CLIENT_SECRET = "4b01e644d0a2057d09f05923442fb78325676a0a";

//Het complete GitHub profiel wordt ge(de)serialized. Hier start de passport session
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Eigen GitHub strategy binnen passport. Wanneer de authenticatie geverifieerd is, worden te tokens en het profiel gereturned
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://stagerepohelper.herokuapp.com/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      myToken = accessToken;
    process.nextTick(function () {

      return done(null, profile);
    });
  }
));

var gh = new GitHub({
  token: myToken
});

var allrepos;
var yahoo = gh.getOrganization('AP-Elektronica-ICT');
yahoo.getRepos(function(err, repos) {
   allrepos = repos;
})

var app = express();

app.set('views', __dirname + '/public');
app.set('view engine', 'jade');
app.use(partials());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
//Passport wordt geinitialiseerd
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));


app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.get('/', ensureAuthenticated, function(req, res){
  res.render('dash', { user: req.user });
});
//Hier wordt na authenticatie opnieuw verwezen naar de applicatie
app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
      // functie wordt niet opgeroepen omdat de request meteen naar GitHub gaat
  });

//De callback URL die eveneens aan GitHub gegeven moet worden. Wat er moet gebeuren na authenticatie, en wat er moet gebeuren als het mislukt (terug naar login scherm)
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

app.get('/repos', function(req, res){
  res.send(allrepos);
});

app.get('/user', ensureAuthenticated, function(req, res){
  res.send(req.user);
});

var port = process.env.PORT || 8080;
app.listen(port);
console.log('Magic happens on port 8080');

// functie om uit te maken of er een sessie plaatsvindt. Als er een gebruiker is (req.user) wordt de volgende stap toegelaten, anders wordt het login scherm opnieuw geladen
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
