let express = require('express')
let router = express.Router()
let config = require('./../config')

/*
 https://www.refchex.co.uk/logout/
*/
router.get('/', (req, res) => {
    req.session.destroy()
    res.redirect('/?logged_out')
})

module.exports = router