let express = require('express')
let router = express.Router()
let config = require('./../config')

router.get('/', (req, res) => {
    if(req.session.user) {
        res.render('pages/contact', {
            baseRoute: config.web.baseURL,
            activeRoute: 'contact',
            loggedIn: true
        })
    }
    else {
        res.render('pages/contact', {
            baseRoute: config.web.baseURL,
            activeRoute: 'contact',
            loggedIn: false
        })
    }
})

module.exports = router