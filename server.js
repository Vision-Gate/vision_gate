'use strict';

//#region Dependencies
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg')
const app = express();
const methodOverride = require('method-override');
//#endregion
//#region Middleware
app.use(express.static('./public'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
//#endregion
//#region Environment Variables
const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT;
const UNSPLASH_KEY = process.env.UNSPLASH_KEY
//#endregion
//#region Routes
app.get('/', displayHomePage);
app.get('/userboard', populateDefaultUserboard);
app.post('/details', displayDetails);
app.get('/about_us', displayAboutUs);
app.get('/saves', displaySearchResults)

app.post('/search', conductSearch);
app.post('/userboard',displayUsersboard);
app.post('/newentry', addToBoard);

app.delete('/details/:user/:id', deleteEntry);
app.put('/details/:user/:id', updateEntry);
//#endregion
//#region Route Callbacks
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
function populateDefaultUserboard(req,res){
  const sqlString = 'SELECT * FROM visions WHERE username=$1;';
  const sqlArr = ['default'];
  client.query(sqlString,sqlArr)
  .then(result => 
  {
    const visionList = result.rows;
    const userList= [];
    result.rows.map(user =>{
      if(!userList.includes(user.username)){
        userList.push(user.username);
      }
    });
    includeSavedUsersToDropdown(visionList,userList,res);
  })
}
function includeSavedUsersToDropdown(visionList,userList,res){
  const sqlStr = 'SELECT * FROM users;';
  const sqlArr = [];
  let currentUserList = [];
  client.query(sqlStr,sqlArr)
  .then(results =>{
    results.rows.forEach(user => {
      if(!currentUserList.includes(user.username)){
        currentUserList.push(user.username);
      }
    })
    const combinedUsers = userList.concat(currentUserList);
    const ejsObj = {visionQuery: {combinedUsers,visionList}};
    res.render('./default_board.ejs',ejsObj);
  })
}
function displayUsersboard(req, res) {
  const sqlUserString = 'SELECT * FROM users;';
  const sqlUserArr = [];
  client.query(sqlUserString,sqlUserArr)
  .then(savedUserResult =>{
    const sqlString = 'SELECT * FROM visions WHERE username=$1;';
    const sqlArr = [req.body.choice];
    const userList = [];
    savedUserResult.rows.map(user =>{if(!userList.includes(user.username))
      {
        userList.push(user.username);
        userList.push(user.id);
      } 
    });
    client.query(sqlString,sqlArr)
    .then(visionResult => 
    {
      const visionList = visionResult.rows;
      const ejsObj = {visionQuery: {userList,visionList}};
      res.render('./userboard.ejs',ejsObj);
    })
  })
  .catch(error => handleError(error,res));
}
function displayDetails(req, res) {
  const sqlStr = `SELECT * FROM visions WHERE id=$1;`;
  const sqlArr= [req.body.id];
  client.query(sqlStr,sqlArr)
  .then(result =>{
    const user = [result.rows[0]];
    const ejsObj = {visionList:user};
    res.render('./details.ejs',ejsObj);
  })
}
function displaySearchResults(req, res) {
  res.render('./saves.ejs');
}
function conductSearch(req, res) {
  const sqlStr = 'INSERT INTO users(username) VALUES($1);';
  const sqlArr = [req.body.username];
  client.query(sqlStr,sqlArr).then(console.log(`Added ${req.body.username} to Users`));
  const url = `https://api.unsplash.com/search/photos?query=${req.body.search_query}&client_id=${UNSPLASH_KEY}`;
  superagent.get(url)
  .then(results => {
      const visionList = new createVisionList(results.body.results,req.body.username);
      console.log(visionList);
      const query = req.body
      const ejsObject = {visionQuery: {visionList, query}};
      res.render('./saves.ejs', ejsObject);
  })
  .catch(error => handleError(error,res));
}
function addToBoard(req, res) {
  const sqlStr = 'INSERT INTO visions(image_url,username) VALUES($1,$2) RETURNING id;';
  const sqlArr = [req.body.image,req.body.username];
  client.query(sqlStr,sqlArr)
  .then(result =>{ console.log(`Added Entry to the DB`)})
  .catch(error => handleError(error,res));
}
function deleteEntry(req, res) {
  console.log('in the delete function');
  const sqlString = 'DELETE FROM visions WHERE id=$1;';
  const sqlArr = [req.params.id];
  client.query(sqlString, sqlArr)
    .then(res.redirect('./userboard.ejs'))
}
function updateEntry(req, res) {
  console.log('in the update function', req.body);
  const sqlStr = 'UPDATE visions SET description=$1, deadline=$2 WHERE id=$3;'; //need image to transfer id when brought to details page
  const sqlArr = [req.body.description, req.body.deadline, req.params.id];
  client.query(sqlStr, sqlArr)
    .then
    (res.redirect('./userboard.ejs')) // add specific username extension with 140, 141?
}
function displayAboutUs(req, res) {
  res.render('./about_us.ejs')
}
function handleError(error,res){
  res.status(500).send("Something went wrong. ",error)
}
//#endregion
//#region Vision Constructors
function Vision (
  username, image_url, description,
  goal_deadline, image_author,image_author_url) {

  this.username = username;
  this.image_url = image_url;
  this.description = description;
  this.goal_deadline = goal_deadline;
  this.image_author = image_author;
  this.image_author_url = image_author_url;
}
function createVisionList (object,username) {
  return object.map(image => {
    return new Vision(username, image.urls.regular, "", "", image.user.name,
                    image.user.portfolio_url  )
                    })
}
//#endregion
//#region Quote Functions
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
//#endregion
//#region Server | Database Connections
client.connect()
  .then( () => {
    app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`))
  })
//#endregion