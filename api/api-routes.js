// routes.js
'use strict'

var express = require('express'),
    router = express.Router()

module.exports.router = function() {
    router
    .get('/:call', (req, res, next) => {
        console.log('GET API call /' + req.params.call)
        res.status(200).send('[GET] hello')
    })
    .post('/:call', (req, res, next) => {
        console.log('POST API call /' + req.params.call)
        res.status(200).send('[POST] hello')
    })
    .put('/:call', (req, res, next) => {
        console.log('PUT API call /' + req.params.call)
        res.status(200).send('[PUT] hello')
    })
    .delete('/:call', (req, res, next) => {
        console.log('DELETE API call /' + req.params.call)
        res.status(200).send('[DELETE] hello')
    })
    .use((req, res, next) => {
        res.status(400).send('Bad Request')
    })
    return router
}
