let config = {}

config.web = {}
config.db = {}
config.stripe = {}

config.verification ={}

// Local Config
config.web.baseURL = 'http://localhost:3000/'
config.web.port = process.env.PORT || 3000
config.db.host = 'localhost'
config.db.user = 'root'
config.db.password = ''
config.db.dbName = 'refchex_db'
config.db.port = 3306

// Live Config
// config.web.baseURL = 'https://refchex.co.uk/'
// config.web.port = process.env.PORT || 3000
// config.db.host = 'localhost'
// config.db.user = 'refcafon_root'
// config.db.password = 'Createyour1'
// config.db.dbName = 'refcafon_refchex_db'
// config.db.port = 3306

// Stripe Config
config.stripe.publicKey = 'pk_test_51IIDHhJeK4mRRZQv87SfcTsJ5HcHncvxCxr3T6Ms9rm0MvkYYgkMa2278XbMoYCYTb6DKVznyKZTnja6bqaJwbNE00MM4IDJRL'
config.stripe.secretKey = 'sk_test_51IIDHhJeK4mRRZQvT81JI1d157eT4Dyg6hmlR07ygeyw1FVDiufZexhBIxieugcXwzccL00GOZB7lJFfecKCwvWV00T33wE6kc'

config.verification.OTPExpireTime = 600000

module.exports = config
