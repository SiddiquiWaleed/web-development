// Universal route imports
let express = require('express')
let router = express.Router()
let config = require('./../config')
let path = require('path')
let fs = require('fs')
let nodemailer = require('nodemailer')
let candidateDashboardQueries = require('./../database/candidateDashboardQueries')
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

function renameFileWithUniqueName(previousName) {
    let dots = previousName.split('.')
    let dt = new Date();
    let newFileName = ''
    for(let i = 0; i < dots.length - 1; i++) {
        newFileName += dots[i]
    }
    newFileName += '1212____1212'
    newFileName += dt.getTime()
    newFileName += '.' + dots[dots.length - 1]
    return newFileName
}

function moveFile(uploadPath, newPath, fileObject) {
    return new Promise((resolve, reject) => {
        fileObject.mv(uploadPath, function(err) {
            if (err)
                reject(err)
            else
                fs.renameSync(uploadPath, newPath)
                resolve()
        })
    })
}

async function uploadFile (req) {
    let filePaths = []

    if(req.files.refereeDocuments.length === undefined) {
        let fileObject = req.files.refereeDocuments
        let uploadPath = path.join(__dirname, '../','public', 'uploads', fileObject.name)

        let newName = renameFileWithUniqueName(fileObject.name)
        let newPath = path.join(__dirname, '../','public', 'uploads', newName)

        let DBPath = path.join('uploads', newName)
        filePaths.push(DBPath)

        await moveFile(uploadPath, newPath, fileObject)
        return filePaths
    }

    for(let i = 0; i < req.files.refereeDocuments.length; i++) {
        let fileObject = req.files.refereeDocuments[i]
        let uploadPath = path.join(__dirname, '../','public', 'uploads', fileObject.name)

        let newName = renameFileWithUniqueName(fileObject.name)
        let newPath = path.join(__dirname, '../','public', 'uploads', newName)

        let DBPath = path.join('uploads', newName)
        filePaths.push(DBPath)

        await moveFile(uploadPath, newPath, fileObject)
    }
    return filePaths
}

function sendMailToReferee(data) {
    let transporter = nodemailer.createTransport({
        host: 'refchex.co.uk',
        port: 465,
        secure: true,
        auth: {
            user: 'no-reply@refchex.co.uk',
            pass: '60_@Wi.~^V}A'
        }
    })

    let mailOptions = {
        from: 'no-reply@refchex.co.uk',
        to: data.reference.referee_email,
        subject: 'Fill Candidate Form',
        html: `        
        <!DOCTYPE html>
        <html>
        <head>
        </head>
        <body style="background-color: #557A95;">
          <div style="max-width:650px; margin:30px auto; font-family: sans-serif; padding:15px; background-color: #fff; box-shadow: 0px 0px 19px -6px #33333340;">
            <img src="https://refchex.co.uk/img/Refchex%20Logo%20Black.png" style="max-width: 80px; margin: 15px 0;">
            <h2>Dear ${data.reference.referee_title}. ${data.reference.referee_name} ${data.reference.referee_surname}</h2>
            <p>${data.candidate.first_name} ${data.candidate.last_name} has been offered a job and she is seeking her references through Refchex to be provided to her new employer via Refchex database. We would be grateful if you could complete the following information to confirm her employment. This will be then placed on database for her to forward to her employers. Refchex is used to ensure that the recruitment process is swift and easy. Please note that under the Data Protection Act of 1998 and Freedom of Information Act 2000 individuals may request access to any information that is held on them.</p>
          
            <p>Please fill out this form by clicking the link velow.</p>
            <a href="${config.web.baseURL}form/fill_ref_form/${data.refID}/${data.candidate.candidate_id}" style="padding: 1rem 6rem;
            font-size: 0.875rem;
            line-height: 1.5;
            border-radius: 0.3rem;color: #fff;
            background-color: #557A95;
            border-color: #557A95; text-decoration: none;margin-top:15px; display:inline-block;">Fill Form</a>
          </div>
        </body>
        </html>
        `
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}

router.get('/', async (req, res) => {
    if(req.session.user) {

        let pending = await candidateDashboardQueries.getPendingReferencesCount(req.session.user.candidate_id)
        let verified = await candidateDashboardQueries.getVerifiedReferencesCount(req.session.user.candidate_id)
        let unverified = await candidateDashboardQueries.getUnVerifiedReferencesCount(req.session.user.candidate_id)

        let AllReferences = await candidateDashboardQueries.getAllReferencesOfCandidate(req.session.user.candidate_id)

        let pendingCount = pending[0]
        let verifiedCount = verified[0]
        let UnverifiedCount = unverified[0]

        res.render('pages/candidateDashboard', {
            user: req.session.user,
            baseRoute: config.web.baseURL,
            activeRoute: 'dashboard_can',
            stripePublicKey: config.stripe.publicKey,
            loggedIn: true,
            pendingCount: pendingCount.pending_count,
            VerifiedCount: verifiedCount.verified_count,
            UnVerifiedCount: UnverifiedCount.unverified_count,
            AllReferences: AllReferences
        })
    }
    else {
        res.redirect(config.web.baseURL + '?session_expired')
    }
})

router.post('/add_new_ref', async (req, res) => {
    if(req.session.user) {
        let filePaths = []

        if(req.files) {
            filePaths = await uploadFile(req)
        }

        let reference = {
            candidateID: req.session.user.candidate_id,
            startDate: req.body.startDate.replace(/\//g, '-'),
            endDate: req.body.endDate.replace(/\//g, '-'),
            refereeEmail: req.body.refereeEmail,
            refereeTitle: req.body.refereeTitle,
            refereeSurname: req.body.refereeSurname,
            refereeName: req.body.refereeName,
            refereeCompanyName: req.body.refereeCompanyName,
            refereeDesignation: req.body.refereeDesignation,
            refereeAddress: req.body.refereeAddress,
            refereePostalCode: req.body.refereePostalCode,
            refereePhoneNumber: req.body.refereePhoneNumber
        }

        let dateArr = reference.startDate.split("-");
        let year = dateArr[2];
        let day = dateArr[0];
        reference.startDate = `${year}-${dateArr[1]}-${day}`;

        dateArr = reference.endDate.split("-");
        year = dateArr[2];
        day = dateArr[0];
        reference.endDate = `${year}-${dateArr[1]}-${day}`;

        let row = await candidateDashboardQueries.addNewReference(reference)

        for(let i = 0; i < filePaths.length; i++) {
            await candidateDashboardQueries.insertDocumentPath(row.insertId, filePaths[i])
        }

        res.sendStatus(200)
    }
    else {
        res.redirect(config.web.baseURL + '?session_expired')
    }
})

router.post('/send_mail_to_referee', async (req, res) => {
    let refID = req.body.refID
    let reference = await candidateDashboardQueries.getReferenceByRefID(refID)

    try {
        sendMailToReferee({
            reference: reference[0],
            candidate: {
                candidate_id: req.session.user.candidate_id,
                first_name: req.session.user.first_name,
                last_name: req.session.user.last_name
            },
            refID: reference[0].reference_id
        })
        await candidateDashboardQueries.changeStatusToPending(refID);
    }
    catch (Exception) {

    }
    res.send({
        msg: 'mail sent'
    })
})

router.get('/view_pending', async (req, res) => {
    if(req.session.user) {
        let pendingReferences = await candidateDashboardQueries.getPendingReferences(req.session.user.candidate_id)
        res.render('pages/viewPending', {
            user: req.session.user,
            baseRoute: config.web.baseURL,
            activeRoute: 'viewPending',
            loggedIn: true,
            pendingReferences: pendingReferences
        })
    }
    else {
        res.redirect(config.web.baseURL + '?session_expired')
    }
})

router.get('/view_verified', async (req, res) => {
    if(req.session.user) {
        let verifiedReferences = await candidateDashboardQueries.getVerifiedReferences(req.session.user.candidate_id)
        res.render('pages/viewVerified', {
            user: req.session.user,
            baseRoute: config.web.baseURL,
            activeRoute: 'viewPending',
            loggedIn: true,
            verifiedReferences: verifiedReferences
        })
    }
    else {
        res.redirect(config.web.baseURL + '?session_expired')
    }
})

router.get('/view_unverified', async (req, res) => {
    if(req.session.user) {
        let unverifiedReferences = await candidateDashboardQueries.getUnVerifiedReferences(req.session.user.candidate_id)
        res.render('pages/viewUnVerified', {
            user: req.session.user,
            baseRoute: config.web.baseURL,
            activeRoute: 'viewPending',
            loggedIn: true,
            unverifiedReferences: unverifiedReferences
        })
    }
    else {
        res.redirect(config.web.baseURL + '?session_expired')
    }
})

router.get('/verified/:refID', async (req, res) => {
    let refID = req.params.refID
    let reference = await candidateDashboardQueries.getVerifiedReferenceWithResponse(refID)
    res.render('pages/verifiedReference', {
        baseRoute: config.web.baseURL,
        activeRoute: 'verifiedReference',
        loggedIn: true,
        reference: reference[0]
    })
})

router.get('/ref/:refID', async (req, res) => {
    if(req.session.user) {
        let refID = req.params.refID
        let result = await candidateDashboardQueries.getReferenceWithResponse(refID, req.session.user.candidate_id)
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

router.get('/profile_settings_can', async (req, res) => {
    if(req.session.user) {
        res.render('pages/profileSettingsCandidate', {
            user: req.session.user,
            baseRoute: config.web.baseURL,
            activeRoute: 'dashboard_can/profile_settings_can',
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
            candidate_id: req.session.user.candidate_id,
            firstName: req.body.first_name,
            lastName: req.body.last_name,
            iin: req.body.iin,
            gender: req.body.gender,
            username: req.body.username,
            address: req.body.address,
            bio: req.body.bio,
            phone: req.body.phone,
            birthday: req.body.datetimepicker
        }

        if(user.gender === 'MA') {
            user.gender = 'male'
        }
        else {
            user.gender = 'female'
        }

        user.birthday = user.birthday.replace(/\//g,"-")

        let dateArr = user.birthday.split("-");
        let year = dateArr[2];
        let day = dateArr[0];

        user.birthday = `${year}-${dateArr[1]}-${day}`;

        await candidateDashboardQueries.updateSettings(user)

        let filePath
        if(req.files) {
            filePath = await changeProfilePic(req)
            await candidateDashboardQueries.updateProfilePic(filePath[0], req.session.user.candidate_id)
        }

        // update session
        let updatedUser = await candidateDashboardQueries.getCandidate(req.session.user.candidate_id)
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

        let candidate = await candidateDashboardQueries.getCandidate(req.session.user.candidate_id)

        bcrypt.compare(currentPassword, candidate[0].password, async function(err, result) {
            if(result) {
                bcrypt.hash(newPassword, null, null, async function(err, hash) {
                    await candidateDashboardQueries.changePassword(req.session.user.candidate_id, hash)
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