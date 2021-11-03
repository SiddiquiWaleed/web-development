let express = require('express')
let router = express.Router()
let config = require('./../config')
let faqQueries = require('./../database/faqQueries')

router.get('/', async (req, res) => {
    let allCanFAQ = await faqQueries.getAllCandidatesFAQ()
    let allEmpCan = await faqQueries.getAllEmployersFAQ()

    if(req.session.user) {
        res.render('pages/faq', {
            baseRoute: config.web.baseURL,
            activeRoute: 'faq',
            loggedIn: true,
            allCanFAQ: allCanFAQ,
            allEmpCan: allEmpCan
        })
    }
    else {
        res.render('pages/faq', {
            baseRoute: config.web.baseURL,
            activeRoute: 'faq',
            loggedIn: false,
            allCanFAQ: allCanFAQ,
            allEmpCan: allEmpCan
        })
    }
})

module.exports = router