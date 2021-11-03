let express = require('express')
let router = express.Router()
let config = require('./../config')

router.get('/', (req, res) => {
    if(req.session.user) {
        res.render('pages/aboutUs', {
            baseRoute: config.web.baseURL,
            activeRoute: 'aboutus',
            loggedIn: true
        })
    }
    else {
        res.render('pages/aboutUs', {
            baseRoute: config.web.baseURL,
            activeRoute: 'aboutus',
            loggedIn: false
        })
    }
})

module.exports = router