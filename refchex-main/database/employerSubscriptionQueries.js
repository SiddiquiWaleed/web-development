let conn = require('./connection')

module.exports = {
    checkSubscription: (empID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT * FROM employer_subscription WHERE employer_id = ? AND subscription_start_date <= CURDATE() AND subscription_end_date >= CURDATE()`
            conn.query(sqlQuery,
                [empID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    purchaseSubscription: (empID, tokenID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`INSERT INTO employer_subscription(employer_id, subscription_start_date, subscription_end_date, token_id)
            VALUES(?,CURDATE(),CURDATE() + INTERVAL 1 YEAR,?)`
            conn.query(sqlQuery,
                [empID, tokenID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    }
}