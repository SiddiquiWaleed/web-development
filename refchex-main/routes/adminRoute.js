let express = require('express')
let router = express.Router()
let config = require('./../config')
let adminQueries = require('./../database/adminQueries')

router.get('/', (req, res) => {
    res.render('pages/adminLoginPage', {
        baseRoute: config.web.baseURL,
        activeRoute: 'admin',
        loggedIn: false
    })
})

router.post('/admin_login', async (req, res) => {
    let username = req.body.username
    let password = req.body.password

    let adminLoginResult = await adminQueries.checkAdminLogin(username, password)

    if(adminLoginResult.length > 0) {
        req.session.admin = adminLoginResult[0]
        res.redirect(config.web.baseURL + 'admin/adminHome')
    }
    else {
        res.redirect(config.web.baseURL + 'admin?login_failed')
    }

})

router.get('/adminHome', async (req, res) => {
    if(req.session.admin) {
        let allCanFAQ = await adminQueries.getAllCandidatesFAQ()
        let allEmpFAQ = await adminQueries.getAllEmployersFAQ()

        res.render('pages/adminHome', {
            baseRoute: config.web.baseURL,
            allCanFAQ: allCanFAQ,
            allEmpFAQ: allEmpFAQ
        })
    }
    else {
        res.redirect(config.web.baseURL + 'admin?session_expired')
    }
})

// Add FAQ
router.post('/add_faq', async (req, res) => {
    if(req.session.admin) {
        let faq = {
            faq_question: req.body.faq_question,
            faq_answer: req.body.faq_answer,
            faq_type: req.body.faq_type,
        }

        await adminQueries.insertFAQ(faq)

        res.redirect(config.web.baseURL + 'admin/adminHome')
    }
    else {
        res.redirect(config.web.baseURL + 'admin?session_expired')
    }
})

// Delete FAQ
router.post('/delete_faq', async (req, res) => {
    if(req.session.admin) {
        await adminQueries.deleteFAQ(req.body.faqId)
        res.send({
            msg: 'deleted'
        })
    }
    else {
        res.redirect(config.web.baseURL + 'admin?session_expired')
    }
})


module.exports = router