let conn = require('./connection')

module.exports = {
    checkSubscription: (canID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT * FROM candidate_subscription WHERE candidate_id = ? AND subscription_start_date <= CURDATE() AND subscription_end_date >= CURDATE()`
            conn.query(sqlQuery,
                [canID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    purchaseSubscription: (canID, tokenID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`INSERT INTO candidate_subscription(candidate_id, subscription_start_date, subscription_end_date, token_id) 
            VALUES(?,CURDATE(),CURDATE() + INTERVAL 1 YEAR,?)`
            conn.query(sqlQuery,
                [canID, tokenID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    }
}