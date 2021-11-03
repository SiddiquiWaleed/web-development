let express = require('express')
let router = express.Router()
let config = require('./../config')
let candidateSubscriptionQueries = require('./../database/candidateSubscriptionQueries')
let stripe = require('stripe')(config.stripe.secretKey)

router.post('/check_subscription', async (req, res) => {
    if(req.session.user) {
        let result = await candidateSubscriptionQueries.checkSubscription(req.session.user.candidate_id)
        if(result.length > 0) {
            res.send({
                msg: 'valid'
            })
        }
        else {
            res.send({
                msg: 'not valid'
            })
        }
    }
    else {
        res.redirect(config.web.baseURL + '?session_expired')
    }
})

router.get('/', (req, res) => {
    res.render('pages/candidateSubscription', {
        baseRoute: config.web.baseURL,
        activeRoute: 'candidate_subscription',
        stripePublicKey: config.stripe.publicKey
    })
})

router.post('/purchase', async (req, res) => {

    let stripeTokeID = req.body.stripeTokenID
    let price = req.body.price

    stripe.charges.create({
        amount: price * 100,
        source: stripeTokeID,
        currency: 'gbp'
    }).then(function (){
        console.log('Charge Successful')
        candidateSubscriptionQueries.purchaseSubscription(req.session.user.candidate_id, stripeTokeID)
        res.send({
            msg: 'purchased'
        })
    }).catch(function () {
        console.log('Charge failed')
        res.send({
            msg: 'failed'
        })
    })

})

module.exports = router