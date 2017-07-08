// routes.js
'use strict'

var express = require('express'),
    router = express.Router(),
    pages = require('./pages.js')

module.exports.router = function() {
    router
    .all((req, res, next) => {
        console.log('Client routes');
        next();
    })
    .get('/', (req, res, next) => {
        console.log('Page /')
        pages.resolve('home', res)
    })
    .get('/:page', (req, res, next) => {
        console.log('Page /' + req.params.page)
        pages.resolve(req.params.page, res)
    })
    .use((req, res, next) => {
        console.log('Page bad request')
        pages.resolve('404', res)
    })
    return router
}
