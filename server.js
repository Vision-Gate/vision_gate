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
app.get('/saves/:keyword', displaySearchResults)

app.post('/categories', conductSearch);
app.post('/newentry', addToBoard);

app.delete('/details/:user/:id', deleteEntry);
app.put('/details/:user/:id', updateEntry);

//Callbacks
function displayHomePage(req, res) {
  const url = `http://quotes.stormconsultancy.co.uk/popular.json`;
  superagent.get(url)
    .then(resultsFromAPI => {
      const quote = getRandomQuote(new createQuoteList(resultsFromAPI.body));
      console.log(quote)
      const ejsObject = {quote};
      res.render('./index.ejs', ejsObject);
    })
}

function displayUserboard(req, res) {
  res.render('./userboard.ejs')
}

function displayDetails(req, res) {
  res.render('./details.ejs')
}

function displaySearchResults(req, res) {
}

function conductSearch(req, res) {
  console.log(req.body, req.body.search_query);
  const url = `https://api.unsplash.com/search/photos?query=${req.body.search_query}&client_id=${UNSPLASH_KEY}`;
  superagent.get(url)
    .then(results => {
      const visionList = new createVisionList(results.body.results);
      console.log(visionList);
      const query = req.body
      const ejsObject = {visionQuery: {visionList, query}};
      res.render('./saves.ejs', ejsObject);
    })
  
  // res.redirect('/saves')
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


// Image functions
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

// Quote functions

function Quote (quote, author) {
  this.quote = quote;
  this.author = author;
}

function createQuoteList (object) {
  return object.map (obj => {
  return new Quote(obj.quote, obj.author);
  });
}

function getRandomQuote (quoteList) {
  const idx = Math.floor(Math.random() * Math.floor(quoteList.length));
  return quoteList[idx];
}

client.connect()
  .then( () => {
    app.listen(PORT, () => console.log(`listening on port: ${PORT}`))
  })