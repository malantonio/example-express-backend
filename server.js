// for this app we'll make a url shortener
var express = require('express')
var app = express()

// middleware that parses the body of a request (POST/PUT) from JSON
var bodyParser = require('body-parser')

// our simple random string generator
var generateShortUrl = require('./generate-short-url')

var mysql = require('mysql')
var config = require('./config.json')
var dbConfig = config.db
var connection = mysql.createConnection(dbConfig)
connection.connect()

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(__dirname + '/static'))

//
// our backend api routes
//

// get all urls
app.get('/api/urls', function (req, res) {
  var query = 'SELECT * from urls LIMIT 25'

  connection.query(query, function (err, results) {
    if (err) { /* handle errors */ }

    res.send(results)
  })
})

// get url by id/short_code
app.get('/api/urls/:id', function (req, res) {
  var id = req.params.id

  if (!id) return

  // if :id is a base10 number, we're using the id field, otherwise
  // we're using the short_url field
  var parsed = parseInt(id, 10)
  var field = parsed ? 'id' : 'short_code'

  // using ?? wraps the value in ticks (`), whereas a single ?
  // will use quotes
  var query = 'SELECT * from urls where ?? = ?'
  var data = [field, id]

  connection.query(query, data, function (err, results) {
    if (err) { /* handle errors */ }

    if (results.length > 1) { /* handle duplicates */ }
    else if (results.length < 1) { /* handle no results */ }
    else {
      res.send(results[0])
    }
  })
})

// add a url and generate a short-code for it
app.post('/api/urls', function (req, res) {
  var full_url = req.body.full_url
  var short_code = generateShortUrl()
  var data = {
    full_url: full_url,
    short_code: short_code
  }

  console.log(data)

  connection.query('INSERT INTO `urls` SET ?', data, function (err, results) {
    if (err) console.log(err)

    res.send({id: results.insertId, short_url: config.base_url + '/' + short_code})
  })
})

// update a url
// this one's probably of no use for our urls example, but you'd
// treat it just like the POST route + use req.params.id as the
// query's id

// app.put('/urls/:id', function (req, res) {
//   var query = 'UPDATE urls SET ? WHERE id = ?'
// })

// remove a url (follows a path similar to GET /urls/:id)
app.delete('/api/urls/:id', function (req, res) {
  var query = 'DELETE from urls where ?? = ?'
  var id = req.params.id
  var parsed = parseInt(id, 10)
  var field = parsed ? 'id' : 'short_code'

  connection.query(query, [field, id], function (err, results) {
    if (err) res.send(err)

    res.send({'message': field + ':' + id + ' was successfully deleted'})
  })
})

// frontend usage of `/urls/:id`, if short_code exists,
// redirects to the full_url
//
// (be sure to position this after all of the GET requests,
// otherwise it'll match those urls as well)
app.get('/:url', function (req, res) {
  var url = req.params.url
  var query = 'SELECT full_url FROM urls WHERE short_code = ?'

  connection.query(query, [url], function (err, results) {
    if (results.length !== 1) { /* handle duplicates or no results */ }

    return res.redirect(results[0].full_url)
  })
})

app.listen(3000)