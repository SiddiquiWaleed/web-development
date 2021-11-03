// Universal route imports
let express = require('express')
let router = express.Router()
let config = require('./../config')
let path = require('path')
let fs = require('fs')
let bcrypt = require('bcrypt-nodejs');
let saltRounds = 10;

// Imports specific for this Route
let nodemailer = require('nodemailer')
let registrationQueries = require('./../database/registrationQueries')

function generateOTP() {
    let digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

function sendOTPCode(OTP, toEmail) {
    return new Promise((resolve, reject) => {
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
            to: toEmail,
            subject: 'OTP',
            html: `
            <!DOCTYPE html>
                <html>
                    <head>
                    </head>
                    <body style="background-color: #557A95;">
                            <div style=";max-width:650px; margin:30px auto;  font-family: sans-serif; padding:15px; background-color: #fff; box-shadow: 0px 0px 19px -6px #33333340;">
                            <img src="https://refchex.co.uk/img/Refchex%20Logo%20Black.png" style="max-width: 80px; margin: 15px 0;">
                            <h1 style="margin:0;">Verification Needed</h1>
                            <h2>Please confirm your sign-up request.</h2>
                            <p>We have detected an account creation request, please confirm your identity by using the below verification code:</p>
                            <span style="background:#557A95; color:#fff; padding:25px 50px; display:inline-block; font-size:28px; border-radius: 4px;">${OTP}</span>
                            <p>To verify your account is safe, please use the above code to enable your account, it will expire in 10 minutes.</p>
                        </div>
                    </body>
                </html>
            `
        }

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error)
                reject(err)
            } else {
                console.log('Email sent: ' + info.response);
                resolve(info)
            }
        })
    })
}

function renameFileWithUniqueName(previousName) {
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

async function uploadFile (req) {
    let filePaths = []
    for (const file of Object.entries(req.files)) {

        let fileObject = file[1]
        let uploadPath = path.join(__dirname, '../','public', 'uploads', fileObject.name)

        let newName = renameFileWithUniqueName(fileObject.name)
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

router.get('/', (req, res) => {
    res.render('pages/home', {
        baseRoute: config.web.baseURL,
        register: 1,
        activeRoute: 'register',
        loggedIn: false
    })
})

router.post('/generate_otp', async (req, res) => {
    let newUser
    if(req.body.registerType === 'candidate') {
        newUser = {
            registerType: req.body.registerType,
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            username: req.body.username,
            phone: req.body.phone,
            password: req.body.password,
            birthday: req.body.birthday,
            gender: req.body.gender
        }
    }
    else {
        newUser = {
            registerType: req.body.registerType,
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            username: req.body.username,
            company_name: req.body.companyName,
            designation: req.body.designation,
            phone: req.body.phone,
            password: req.body.password,
            gender: req.body.gender
        }
    }


    // Hash Password
    bcrypt.hash(newUser.password, null, null, function(err, hash) {
        newUser.password = hash
    });

    // Store new user in session
    req.session.newUser = newUser

    let OTP = generateOTP()
    let timestamp = new Date().getTime()

    let expiry = timestamp + config.verification.OTPExpireTime

    req.session.newUserVerification = {
        OTP: OTP,
        timestamp: timestamp,
        expiry: expiry
    }

    let emailSent = await sendOTPCode(OTP, newUser.email)
    // Mail Sent
    if(emailSent) {
        res.send({
            status: 250
        })
    }
    // Some error occured while sending mail
    else {
        res.send({
            status: -1
        })
    }
})

router.post('/verifyotp', async (req, res) => {
    if(req.session.newUserVerification.expiry > new Date().getTime()) {
        let unverifiedcode = req.body.code
        if(Number(unverifiedcode) === Number(req.session.newUserVerification.OTP)) {
            let currentCount = await registrationQueries.getCurrentUserCount()
            let row
            if(req.session.newUser.registerType === 'candidate') {
                row = await registrationQueries.registerNewCandidate(req.session.newUser, currentCount[0])
                req.session.newUser.candidate_id = currentCount[0].count
            }
            else {
                row = await registrationQueries.registerNewEmployer(req.session.newUser, currentCount[0])
                req.session.newUser.employer_id = currentCount[0].count
            }
            await registrationQueries.increamentCurrentUserCount()

            // OTP verified
            res.send({
                status: 200
            })
        }
        else {
            // OTP not verified
            res.send({
                status: 404
            })
        }
    }
    else {
        // OTP expired
        res.send({
            status: 900
        })
    }
})

router.get('/firstTimeSettings', (req, res) => {
    if(req.session.newUser) {
        res.render('pages/firstTimeSettings', {
            baseRoute: config.web.baseURL,
            newUser: req.session.newUser,
            activeRoute: 'register/firstTimeSettings'
        })
    }
    else {
        res.redirect(config.web.baseURL + '?error')
    }
})

router.post('/register_new_user', async (req, res) => {
    if(req.session.newUser) {
        if(req.session.newUser.registerType === 'candidate') {
            let filePath
            if(req.files)
                filePath = await uploadFile(req)
            else
                filePath[0] = null
            let newUser = req.session.newUser
            newUser.profile_pic = filePath[0]
            newUser.bio = req.body.bio
            newUser.address = req.body.address
            newUser.iin = req.body.iin
            await registrationQueries.firstTimeSettingsCandidate(newUser)
            req.session.user = newUser
            res.send({
                msg: 'go to can dashboard'
            })
        }
        else {
            let filePath
            if(req.files)
                filePath = await uploadFile(req)
            else
                filePath[0] = null
            let newUser = req.session.newUser
            newUser.profile_pic = filePath[0]
            newUser.address = req.body.address
            newUser.postal_code = req.body.postalCode
            console.log(newUser)
            await registrationQueries.firstTimeSettingsEmployer(newUser)
            req.session.user = newUser
            res.send({
                msg: 'go to emp dashboard'
            })
        }
    }
    else {
        res.redirect(config.web.baseURL + '?error')
    }
})

router.post('/check_email', async (req, res) => {
    let email = req.body.email
    let result = await registrationQueries.checkIfCandidateEmailExists(email)
    console.log(result)
    if(result.length === 0) {
        console.log('len = 0')
        res.send({
            msg: 'not_exists'
        })
    }
    else {
        res.send({
            msg: 'exists'
        })
    }
})

module.exports = router
