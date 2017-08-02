// mdwebsite.js
'use strict'

var express = require('express'),
    helmet = require('helmet'),
    hbs = require('express-handlebars'),
    app = express(),
    port = process.env.PORT || 5533

app.engine('.hbs', hbs({
    extname: '.hbs',
}))
app.set('view engine', '.hbs')

app.use(helmet())
app.use(express.static('static'))
app.use('/api', require('./api/api-routes.js').router())
app.use(require('./core/page-routes.js').router())
app.use((req, res, next) => {
    res.status(400).send('Bad Request')
})
app.listen(port, function() {
    console.log('Listening to ' + port)
})
