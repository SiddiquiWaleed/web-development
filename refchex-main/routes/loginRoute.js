// Universal route imports
let express = require('express')
let router = express.Router()
let config = require('./../config')
let loginQueries = require('./../database/loginQueries')
let bcrypt = require('bcrypt-nodejs');
let saltRounds = 10;

router.post('/', async (req, res) => {
    let emailOrID = req.body.emailOrID
    let password = req.body.password

    let candidateLoginVerified = await loginQueries.checkCandidateLogin(emailOrID)
    let employerLoginVerified = await loginQueries.employerLoginVerified(emailOrID)

    if(candidateLoginVerified.length > 0) {
        bcrypt.compare(password, candidateLoginVerified[0].password, function(err, result) {
            if(result) {
                req.session.user = candidateLoginVerified[0]
                res.redirect(config.web.baseURL + 'dashboard_can')
            }
            else {
                res.redirect(config.web.baseURL + '?login_failed')
            }
        })
    }
    else if(employerLoginVerified.length > 0) {
        bcrypt.compare(password, employerLoginVerified[0].password, function(err, result) {
            if(result) {
                req.session.user = employerLoginVerified[0]
                res.redirect(config.web.baseURL + 'dashboard_emp')
            }
            else {
                res.redirect(config.web.baseURL + '?login_failed')
            }
        });
    }
    else {
        res.redirect(config.web.baseURL + '?login_failed')
    }
})

module.exports = router