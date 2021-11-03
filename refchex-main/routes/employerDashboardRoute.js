let express = require('express')
let router = express.Router()
let config = require('./../config')
let employerDashboardQueries = require('./../database/employerDashboardQueries')
let path = require('path')
let fs = require('fs')
let bcrypt = require('bcrypt-nodejs');
let saltRounds = 10;

async function changeProfilePic(req) {
    let filePaths = []
    for (const file of Object.entries(req.files)) {

        let fileObject = file[1]
        let uploadPath = path.join(__dirname, '../','public', 'uploads', fileObject.name)

        let newName = renameProfilePic(fileObject.name)
        let newPath = path.join(__dirname, '../','public', 'uploads', newName)

        let DBPath = path.join('uploads', newName)
        filePaths.push(DBPath)

        await fileObject.mv(uploadPath, function(err) {
            if (err)
                console.log(err)
            else
                fs.renameSync(uploadPath, newPath)
        })
        return filePaths
    }
}

function renameProfilePic(previousName) {
    let dots = previousName.split('.')
    let dt = new Date();
    let newFileName = ''
    for(let i = 0; i < dots.length - 1; i++) {
        newFileName += dots[i]
    }
    newFileName += '_' + dt.getFullYear()
        + '_' + (dt.getMonth()+1)
        + '_' + (dt.getDate())
        + '_' + (dt.getHours())
        + '_' + (dt.getMinutes())
        + '_' + (dt.getSeconds())
    newFileName += '.' + dots[dots.length - 1]
    return newFileName
}

router.get('/', (req, res) => {
    if(req.session.user) {
        res.render('pages/employerDashboard', {
            user: req.session.user,
            baseRoute: config.web.baseURL,
            activeRoute: 'dashboard_emp',
            stripePublicKey: config.stripe.publicKey,
            loggedIn: true,
        })
    }
    else {
        res.redirect(config.web.baseURL + '?session_expired')
    }
})

router.get('/candidate/:canID', async (req, res) => {
    let canID = req.params.canID
    let result = await employerDashboardQueries.getCandidateFromID(canID)
    let references = await employerDashboardQueries.getReferencesOfCandidate(canID)

    if(result.length > 0) {
        res.render('pages/candidateProfile', {
            user: req.session.user,
            baseRoute: config.web.baseURL,
            activeRoute: 'dashboard_emp/candidate',
            stripePublicKey: config.stripe.publicKey,
            loggedIn: true,
            candidate: result[0],
            references: references
        })
    }
    res.redirect(config.web.baseURL + 'dashboard_emp?can_id_not_found=true')
})

router.get('/ref/:refID/can/:canID', async (req, res) => {
    if(req.session.user) {
        let refID = req.params.refID
        let canID = req.params.canID
        let result = await employerDashboardQueries.getReferenceWithResponse(refID, canID)
        console.log(result)
        if(result.length > 0) {
            res.render('pages/viewReference', {
                user: req.session.user,
                baseRoute: config.web.baseURL,
                activeRoute: 'viewReference',
                loggedIn: true,
                reference: result[0],
                documents: result
            })
        }
    }
    else {
        res.redirect(config.web.baseURL + '?session_expired')
    }
})

router.get('/profile_settings_emp', async (req, res) => {
    if(req.session.user) {
        res.render('pages/profileSettingsEmployer', {
            user: req.session.user,
            baseRoute: config.web.baseURL,
            activeRoute: 'dashboard_emp/profile_settings_emp',
            stripePublicKey: config.stripe.publicKey,
            loggedIn: true,
        })
    }
    else {
        res.redirect(config.web.baseURL + '?session_expired')
    }
})

router.post('/change_settings', async (req, res) => {
    if(req.session.user) {
        let user = {
            employer_id: req.session.user.employer_id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            companyName: req.body.companyName,
            designation: req.body.designation,
            gender: req.body.gender,
            address: req.body.address,
            postalCode: req.body.postalCode,
            phone: req.body.phone
        }

        if(user.gender === 'MA') {
            user.gender = 'male'
        }
        else {
            user.gender = 'female'
        }

        await employerDashboardQueries.updateSettings(user)

        let filePath
        if(req.files) {
            filePath = await changeProfilePic(req)
            await employerDashboardQueries.updateProfilePic(filePath[0], req.session.user.employer_id)
        }

        // update session
        let updatedUser = await employerDashboardQueries.getEmployer(req.session.user.employer_id)
        req.session.user = updatedUser[0]

        res.send({
            msg: 'settings updated'
        })
    }
    else {
        res.redirect(config.web.baseURL + '?session_expired')
    }

})


router.post('/change_password', async (req, res) => {
    if(req.session.user) {
        let currentPassword = req.body.currentPassword
        let newPassword = req.body.newPassword

        let employer = await employerDashboardQueries.getEmployer(req.session.user.employer_id)

        bcrypt.compare(currentPassword, employer[0].password, async function(err, result) {
            if(result) {
                bcrypt.hash(newPassword, null, null, async function(err, hash) {
                    await employerDashboardQueries.changePassword(req.session.user.employer_id, hash)
                    res.send({
                        msg: 'password updated'
                    })
                });
            }
            else {
                res.send({
                    msg: 'password incorrect'
                })
            }
        })
    }
    else {
        res.redirect(config.web.baseURL + '?session_expired')
    }
})

module.exports = router