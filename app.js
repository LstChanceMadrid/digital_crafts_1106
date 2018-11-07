
const express = require('express');
const mustacheExpress = require('mustache-express');
const app = express();
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const connectionString = "postgres://localhost:5432/blogdb";
const db = pgp(connectionString);

const session = require('express-session');
const sess = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
  }

app.use(bodyParser.urlencoded({ extended: false }));
app.use('css', express.static('css'));
app.use(session(sess));

app.engine('mustache', mustacheExpress());

app.set('views', "./views"); 
app.set('view engine', 'mustache');

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/register', (req, res) => {
    
    let username = req.body.username;
    let password = req.body.password;

    db.none('INSERT INTO users(username, password) VALUES($1, $2)',[username, password]).then(() => {
        res.redirect('/');
    });
});

app.post('/log-in', (req, res) => {
    
    let username = req.body.username;
    let password = req.body.password;

    db.one('SELECT username, password FROM users WHERE username = $1 AND password = $2;', [username, password]).then(result => {
        if (result) {
            console.log(result);
            res.render('home');
        } else {
            res.send('you suck!');
        }
    }).catch(error => {
        console.log(error)
    })
})





app.listen(3000, (req, res) => {
    console.log('Server running...');
});