let express = require('express')
let bodyParser = require('body-parser')
let expressSession = require('express-session')
let ejs = require('ejs')
let fileUpload = require('express-fileupload')
let config = require('./config')

// Import Routes
let baseRoute = require('./routes/baseRoute')
let registrationRoute = require('./routes/registrationRoute')
let candidateDashboard = require('./routes/candidateDashboardRoute')
let loginRoute = require('./routes/loginRoute')
let formRoute = require('./routes/form')
let candidateSubscriptionRoute = require('./routes/candidateSubscriptionRoute')
let faqRoute = require('./routes/faqRoute')
let pricingRoute = require('./routes/pricingRoute')
let logoutRoute = require('./routes/logoutRoute')
let employerDashboardRoute = require('./routes/employerDashboardRoute')
let employerSubscriptionRoute = require('./routes/employerSubscriptionRoute')
let contactRoute = require('./routes/contactRoute')
let aboutUsRoute = require('./routes/aboutUsRoute')
let adminRoute = require('./routes/adminRoute')

let app = express()
app.set('view engine', 'ejs')

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(fileUpload())

app.use(express.static(__dirname + '/public'))
app.use('/stylesheets/fontawesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free/'));

app.use(expressSession(
    {
        secret: 'secret_key',
        saveUninitialized: false,
        resave: true,
        rolling: true,
        cookie: {
            expires: 86400000
        }
    }
));
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
    next()
})

// Routes
app.use('/', baseRoute)
app.use('/register', registrationRoute)
app.use('/dashboard_can', candidateDashboard)
app.use('/login', loginRoute)
app.use('/form', formRoute)
app.use('/candidate_subscription', candidateSubscriptionRoute)
app.use('/faq', faqRoute)
app.use('/pricing', pricingRoute)
app.use('/logout', logoutRoute)
app.use('/dashboard_emp', employerDashboardRoute)
app.use('/employer_subscription', employerSubscriptionRoute)
app.use('/contact', contactRoute)
app.use('/aboutus', aboutUsRoute)
app.use('/admin', adminRoute)

app.listen(config.web.port, () => {
    console.log('Server Started')
})
