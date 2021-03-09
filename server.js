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
const UNSPLASH_KEY = process.env.UNSPLASH_KEY

//Routes
app.get('/', displayHomePage);
app.get('/userboard', displayUserboard);
app.get('/details/:user/:id', displayDetails);
app.get('/about_us', displayAboutUs);
app.get('/saves', displaySearchResults)

// app.post('/categories', conductSearch);
app.post('/newentry', addToBoard);

app.delete('/details/:user/:id', deleteEntry);
app.put('/details/:user/:id', updateEntry);

//Callbacks
function displayHomePage(req, res) {
  res.render('./index.ejs')
}

function displayUserboard(req, res) {
  res.render('./userboard.ejs')
}

function displayDetails(req, res) {
  res.render('./details.ejs')
}

function displaySearchResults(req, res) {
  const url = `https://api.unsplash.com/search/photos?query=${req.body.query}&client_id=${UNSPLASH_KEY}`;
  superagent.get(url)
    .then(results => {
      const visionList = new createVisionList(results.body.results);
      console.log(visionList);
      const ejsObject = {visionList};
      res.render('./saves.ejs', ejsObject);
    })
}

function addToBoard(req, res) {
  
}


function deleteEntry(req, res) {
  
}

function updateEntry(req, res) {
  
}

function displayAboutUs(req, res) {
  res.render('./about_us.ejs')
}

function Vision (username, image_url, description, goal_deadline) {
  this.username = username;
  this.image_url - image_url;
  this.description = description;
  this.goal_deadline = goal_deadline;
}

function createVisionList (object) {
  return object.map(image => {
  return image.urls.regular;
  })
}

client.connect()
  .then( () => {
    app.listen(PORT, () => console.log(`listening on port: ${PORT}`))
  })