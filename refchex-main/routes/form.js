let express = require('express')
let router = express.Router()
let config = require('./../config')
let fillFormQueries = require('./../database/fillFormQueries')

let submitMsg = `
<!DOCTYPE html>
        <html>
            <head>
                <link rel="stylesheet" type="text/css" href="http://localhost:3000/Bootstrap/dist/css/bootstrap.css">
            </head>
            <body>
                <div style="display: flex;justify-content: center;">
                    <div class="alert alert-success" role="alert" style="width: 350px;margin-top: 40px;background-color: #557A95;color: #fff">
                        <h4 class="alert-heading">Response Submitted</h4>
                        <p>You Response Has Been Submitted</p>
                        <hr style="border-top-color: #ffffff;">
                        <p class="mb-0">Close the window whenever you are ready.</p>
                    </div>
                </div>
            </body>
</html>
`

router.get('/fill_ref_form/:refID/:canID', async (req, res) => {
    let refID = req.params.refID
    let canID = req.params.canID

    let responseSubmitted = await fillFormQueries.checkIfFormAlreadySubmitted(refID)

    if(responseSubmitted.length > 0) {
        res.send(submitMsg)
    }
    else {
        let reference = await fillFormQueries.getReference(refID, canID)

        res.render('pages/fillForm', {
            reference: reference[0],
            baseRoute: config.web.baseURL,
            activeRoute: 'form',
            loggedIn: false,
            documents: reference
        })
    }
})

router.post('/submit_response', async (req, res) => {
    let result = req.body.optionsRadios
    let response

    if(result === 'verified') {
        await fillFormQueries.changeStatusFromPendingToVerified(req.body.refID)
        response = {
            reference_id: req.body.refID,
            result: 'verified',
            reason_for_leaving: req.body.reasonForLeaving,
            number_of_sickness: req.body.numberOfSickness,
            warnings: req.body.warnings,
            investigations: req.body.investigations,
            comment: req.body.comments,
            please_explain_why: null
        }
    }
    else {
        await fillFormQueries.changeStatusFromPendingToUnVerified(req.body.refID)
        response = {
            reference_id: req.body.refID,
            result: 'not_verified',
            reason_for_leaving: null,
            number_of_sickness: null,
            warnings: null,
            investigations: null,
            comment: null,
            please_explain_why: req.body.pleaseExplainWhy
        }
    }

    await fillFormQueries.insertResponse(response)

    res.send(submitMsg)

})

module.exports = router