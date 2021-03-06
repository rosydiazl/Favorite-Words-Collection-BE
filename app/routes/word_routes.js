// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for words
const Word = require('../models/word')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existent document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /words
router.get('/words', requireToken, (req, res, next) => {
  Word.find({ owner: req.user.id })
    .then(words => {
      // `words` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return words.map(word => word.toObject())
    })
    // respond with status 200 and JSON of the words
    .then(words => res.status(200).json({ words: words }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /words/5a7db6c74d55bc51bdf39793
router.get('/words/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  // req.params.id will be set based on the `:id` in the route
  Word.find({ owner: req.user.id, _id: id })
    .then(handle404)
    // if `findById` is successful, respond with 200 and "word" JSON
    // .then(word => res.status(200).json({ word: word.toObject() }))
    .then(words => {
      console.log('Word is: ', words) // what is word?
      return res.status(200).json({ word: words[0].toObject() })
    })
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /words
router.post('/words', requireToken, (req, res, next) => {
  // set owner of new word to be current user
  // console.log(req.body)
  req.body.word.owner = req.user.id

  Word.create(req.body.word)
    // respond to successful `create` with status 201 and JSON of new "word"
    .then(word => {
      res.status(201).json({ word: word.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /words/5a7db6c74d55bc51bdf39793
router.patch('/words/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.word.owner
  // get id of words form params
  const id = req.params.id
  // get words data from request
  const wordData = req.body.word

  Word.findById(id)
    .then(handle404)
    .then(word =>
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, word)

      // pass the result of Mongoose's `.update` to the next `.then`
      // return word.updateOne(req.body.word)
    )
    // update word
    .then(word => {
      // update word with wordData
      Object.assign(word, wordData)
      // save word to mongodb
      return word.save()
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /words/5a7db6c74d55bc51bdf39793
router.delete('/words/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Word.findById(id)
  // Handle 404 error if it wasn't found
    .then(handle404)
    .then(word => {
      // throw an error if current user doesn't own `word`
      requireOwnership(req, word)
      // delete the word ONLY IF the above didn't throw
      word.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
