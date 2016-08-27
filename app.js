var GitHub     = require('github-api');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var passport = require('passport');
var config = require('./oauth.js');
var GithubStrategy = require('passport-github2').Strategy;
var cookieParser = require('cookie-parser');

var gh = new GitHub();
var router = express.Router();              // get an instance of the express Router
var allrepos;

// serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// config
passport.use(new GithubStrategy({
  clientID: config.github.clientID,
  clientSecret: config.github.clientSecret,
  callbackURL: config.github.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

var app = express();

  app.set('views', __dirname + '/public');
  app.set('view engine', 'jade');
  app.use(cookieParser());
  app.use(bodyParser());
  //app.use(express.methodOverride());

  app.use(passport.initialize());
    app.use(passport.session({ secret: 'my_precious' }));
  app.use(express.static(__dirname + '/public', { redirect : false }));

// routes


app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){});

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/dash');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


// test authentication
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.redirect('/dash');
// }

function loggedIn(req, res, next) {
    if (req.user) {
        res.redirect('/dash');
    } else {
        res.redirect('/error');
    }
}

app.get('/dash', function(req, res){
  res.render('dash', { user: req.user });
});

app.get('/', function(req, res){
  res.render('login', { user: req.user });
});








app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var yahoo = gh.getOrganization('AP-Elektronica-ICT');
yahoo.getRepos(function(err, repos) {
   allrepos = repos;
})

var port = process.env.PORT || 8080;        // set our port


router.route('/repos')
    // get all the repos
    .get(function(req, res) {
            res.send(allrepos);
    });
app.use('/api', router);

app.use(express.static('public'));
// app.get('/', function(req, res) {
//     res.sendFile(__dirname + '/public/index.html');
// });
// app.get('/dash', function(req, res) {
//     res.sendFile(__dirname + '/public/index2.html');
// });

app.listen(port);
console.log('Magic happens on port ' + port);
