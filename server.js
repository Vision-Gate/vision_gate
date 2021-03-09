'use strict';

//Dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg')
const app = express();
const methodOverride = require('method-override');
require('dotenv').config();

const PORT = process.env.PORT;

//Middleware
// app.use(express.static('./views')); ?? do we need?
app.use(express.static('./public'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

//Database setup
const client = new pg.Client(process.env.DATABASE_URL);

//Routes
app.get('/', renderHomePage);
app.get('/search', redirectHome);
app.get('/userboard', displayUserboard);
app.get('/details/:user/:id', displayDetails);

app.post('/categories', conductSearch);
app.post('/newentry', addToBoard);

app.delete('/details/:user/:id', deleteEntry);
app.put('/details/:user/:id', updateEntry);

//Callbacks
function renderHomePage(req, res) {

}

function redirectHome(req, res) {
  
}

function displayUserboard(req, res) {
  
}

function displayDetails(req, res) {
  
}

function conductSearch(req, res) {
  
}

function addToBoard(req, res) {
  
}


function deleteEntry(req, res) {
  
}

function updateEntry(req, res) {
  
}

function Vision (username, image_url, description, goal_deadline) {
  this.username = username;
  this.image_url - image_url;
  this.description = description;
  this.goal_deadline = goal_deadline;
}

client.connect()
  .then( () => {
    app.listen(PORT, () => console.log(`listening on port: ${PORT}`))
  })