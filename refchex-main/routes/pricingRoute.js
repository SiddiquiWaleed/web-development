let express = require('express')
let router = express.Router()
let config = require('./../config')

router.get('/', (req, res) => {
    if(req.session.user) {
        res.render('pages/pricing', {
            baseRoute: config.web.baseURL,
            activeRoute: 'pricing',
            loggedIn: true
        })
    }
    else {
        res.render('pages/pricing', {
            baseRoute: config.web.baseURL,
            activeRoute: 'pricing',
            loggedIn: false
        })
    }
})

module.exports = router