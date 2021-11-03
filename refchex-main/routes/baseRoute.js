let express = require('express')
let router = express.Router()
let config = require('./../config')

router.get('/', (req, res) => {
    if(req.session.user) {
        if(req.session.user.company_name) {
            res.redirect(config.web.baseURL + 'dashboard_emp')
        }
        else {
            res.redirect(config.web.baseURL + 'dashboard_can')
        }
    }
    else {
        res.render('pages/home', {
            baseRoute: config.web.baseURL,
            register: 0,
            activeRoute: '/',
            loggedIn: false
        })
    }
})

module.exports = router