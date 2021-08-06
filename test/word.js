process.env.TESTENV = true

let Word = require('../app/models/word')
let User = require('../app/models/user')

const crypto = require('crypto')

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
chai.should()

chai.use(chaiHttp)

const token = crypto.randomBytes(16).toString('hex')
let userId
let wordId

describe('Words', () => {
  const wordParams = {
    word: '13 JavaScript tricks SEI instructors don\'t want you to know',
    definition: 'You won\'t believe number 8!',
    origin: 'Origin test',
    language: 'Language test',
    sentence: 'Sentence test'
  }

  before(done => {
    Word.deleteMany({})
      .then(() => User.create({
        email: 'caleb',
        hashedPassword: '12345',
        token
      }))
      .then(user => {
        userId = user._id
        return user
      })
      .then(() => Word.create(Object.assign(wordParams, {owner: userId})))
      .then(record => {
        wordId = record._id
        done()
      })
      .catch(console.error)
  })

  describe('GET /words', () => {
    it('should get all the words', done => {
      chai.request(server)
        .get('/words')
        .set('Authorization', `Token token=${token}`)
        .end((e, res) => {
          res.should.have.status(200)
          res.body.words.should.be.a('array')
          res.body.words.length.should.be.eql(1)
          done()
        })
    })
  })

  describe('GET /words/:id', () => {
    it('should get one word', done => {
      chai.request(server)
        .get('/words/' + wordId)
        .set('Authorization', `Token token=${token}`)
        .end((e, res) => {
          res.should.have.status(200)
          res.body.word.should.be.a('object')
          res.body.word.title.should.eql(wordParams.title)
          done()
        })
    })
  })

  describe('DELETE /words/:id', () => {
    let wordId

    before(done => {
      Word.create(Object.assign(wordParams, { owner: userId }))
        .then(record => {
          wordId = record._id
          done()
        })
        .catch(console.error)
    })

    it('must be owned by the user', done => {
      chai.request(server)
        .delete('/words/' + wordId)
        .set('Authorization', `Bearer notarealtoken`)
        .end((e, res) => {
          res.should.have.status(401)
          done()
        })
    })

    it('should be successful if you own the resource', done => {
      chai.request(server)
        .delete('/words/' + wordId)
        .set('Authorization', `Bearer ${token}`)
        .end((e, res) => {
          res.should.have.status(204)
          done()
        })
    })

    it('should return 404 if the resource doesn\'t exist', done => {
      chai.request(server)
        .delete('/words/' + wordId)
        .set('Authorization', `Bearer ${token}`)
        .end((e, res) => {
          res.should.have.status(404)
          done()
        })
    })
  })

  describe('POST /words', () => {
    it('should not POST an word without a title', done => {
      let noTitle = {
        text: 'Untitled',
        owner: 'fakedID'
      }
      chai.request(server)
        .post('/words')
        .set('Authorization', `Bearer ${token}`)
        .send({ word: noTitle })
        .end((e, res) => {
          res.should.have.status(422)
          res.should.be.a('object')
          done()
        })
    })

    it('should not POST a word without text', done => {
      let noText = {
        title: 'Not a very good word, is it?',
        owner: 'fakeID'
      }
      chai.request(server)
        .post('/words')
        .set('Authorization', `Bearer ${token}`)
        .send({ word: noText })
        .end((e, res) => {
          res.should.have.status(422)
          res.should.be.a('object')
          done()
        })
    })

    it('should not allow a POST from an unauthenticated user', done => {
      chai.request(server)
        .post('/words')
        .send({ word: wordParams })
        .end((e, res) => {
          res.should.have.status(401)
          done()
        })
    })

    it('should POST a word with the correct params', done => {
      let validWord = {
        title: 'I ran a shell command. You won\'t believe what happened next!',
        text: 'it was rm -rf / --no-preserve-root'
      }
      chai.request(server)
        .post('/words')
        .set('Authorization', `Bearer ${token}`)
        .send({ word: validWord })
        .end((e, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.have.property('word')
          res.body.word.should.have.property('title')
          res.body.word.title.should.eql(validWord.title)
          done()
        })
    })
  })

  describe('PATCH /words/:id', () => {
    let wordId

    const fields = {
      title: 'Find out which HTTP status code is your spirit animal',
      text: 'Take this 4 question quiz to find out!'
    }

    before(async function () {
      const record = await Word.create(Object.assign(wordParams, { owner: userId }))
      wordId = record._id
    })

    it('must be owned by the user', done => {
      chai.request(server)
        .patch('/words/' + wordId)
        .set('Authorization', `Bearer notarealtoken`)
        .send({ word: fields })
        .end((e, res) => {
          res.should.have.status(401)
          done()
        })
    })

    it('should update fields when PATCHed', done => {
      chai.request(server)
        .patch(`/words/${wordId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ word: fields })
        .end((e, res) => {
          res.should.have.status(204)
          done()
        })
    })

    it('shows the updated resource when fetched with GET', done => {
      chai.request(server)
        .get(`/words/${wordId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((e, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.word.title.should.eql(fields.title)
          res.body.word.text.should.eql(fields.text)
          done()
        })
    })

    it('doesn\'t overwrite fields with empty strings', done => {
      chai.request(server)
        .patch(`/words/${wordId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ word: { text: '' } })
        .then(() => {
          chai.request(server)
            .get(`/words/${wordId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((e, res) => {
              res.should.have.status(200)
              res.body.should.be.a('object')
              // console.log(res.body.word.text)
              res.body.word.title.should.eql(fields.title)
              res.body.word.text.should.eql(fields.text)
              done()
            })
        })
    })
  })
})
