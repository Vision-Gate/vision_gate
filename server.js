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
app.get('/userboard', populateDefaultUsers);
app.get('/details/:user/:id', displayDetails);
app.get('/about_us', displayAboutUs);
app.get('/saves', displaySearchResults)

app.post('/search', conductSearch);
// app.post('/userboard',displayUserboard);
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

function populateDefaultUsers(req,res){
  const sqlString = 'SELECT * FROM visions WHERE username=$1;';
  const sqlArr = ['default'];
  client.query(sqlString,sqlArr)
  .then(result => 
  {
    console.log(`Displaying visions for ${result.rows[0].username} user`);
    const visionList = result.rows;
    const userList= [];
    result.rows.map(user =>{
      if(!userList.includes(user.username)){
        userList.push(user.username);
      }
    });
    console.log(userList);
    const ejsObj = {visionQuery: {userList,visionList}};
    res.render('./default_board.ejs',ejsObj);
  })
}
//Populate Saved Images
function populateUsers(req, res) {
  //User is whatever is currently selected
  // const sqlUsers = 'SELECT DISTINCT username FROM users;';
  // const sqlUsersArr = [];
  // client.query(sqlUsers)
  // .then(userResults => 
  // {
  //     console.log(userResults);
  //     console.log(`Users: ${userResults.rows[0]}`);
      console.log(req.body);
      const sqlString = 'SELECT * FROM visions WHERE username=$1;';
      const sqlArr = ['drae'];
      client.query(sqlString,sqlArr)
      .then(result => 
      {
        console.log(result.rows);
        console.log(`Displaying visions for ${result.rows}`);
        const visionList = result.rows;
        // const userList = userResults.rows;
        // const ejsObj = {visionQuery: {userList,visionList}};
        res.render('./userboard.ejs');
      })
  // })
}

function displayDetails(req, res) {
  res.render('./details.ejs')
}

function displaySearchResults(req, res) {
  res.render('./saves.ejs');
}
function conductSearch(req, res) {
  
  console.log(req.body.username, req.body.search_query);
  const sqlStr = 'INSERT INTO users(username) VALUES($1);';
  const sqlArr = [req.body.username];
  client.query(sqlStr,sqlArr).then(console.log(`Added ${req.body.username} to Users`));
  
  const url = `https://api.unsplash.com/search/photos?query=${req.body.search_query}&client_id=${UNSPLASH_KEY}`;
  superagent.get(url)
    .then(results => {
      const visionList = new createVisionList(results.body.results);
      // console.log(visionList);
      const query = req.body
      const ejsObject = {visionQuery: {visionList, query}};
      res.render('./saves.ejs', ejsObject);
    })
}
function addToBoard(req, res) {
  const sqlStr = 'INSERT INTO visions(image_url,username) VALUES($1,$2) RETURNING id;';
  const sqlArr = [req.body.image,req.body.username];
  client.query(sqlStr,sqlArr)
  .then(result =>{ console.log(`Added Entry to the DB`)})
  .catch(error => res.send("Something went wrong: ", error));
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