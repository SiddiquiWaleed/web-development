let conn = require('./connection')

module.exports = {
    checkCandidateLogin: (emailOrID) => {
        return new Promise((resolve, reject) => {
            if(emailOrID.includes("@")) {
                let sqlQuery =`SELECT *, DATE_FORMAT(birthday, "%Y-%m-%d") as birth_day FROM candidate WHERE email = ?`
                conn.query(sqlQuery,
                    [emailOrID], (err, rows) => {
                        if (err)
                            reject(err)
                        else
                            resolve(rows)
                })
            }
            else {
                let sqlQuery =`SELECT *, DATE_FORMAT(birthday, "%Y-%m-%d") as birth_day FROM candidate WHERE candidate_id = ?`
                conn.query(sqlQuery,
                    [emailOrID], (err, rows) => {
                        if (err)
                            reject(err)
                        else
                            resolve(rows)
                    })
            }

        })
    },

    employerLoginVerified: (emailOrID) => {
        return new Promise((resolve, reject) => {
            if(emailOrID.includes("@")) {
                let sqlQuery =`SELECT * FROM employer WHERE email = ?`
                conn.query(sqlQuery,
                    [emailOrID], (err, rows) => {
                        if (err)
                            reject(err)
                        else
                            resolve(rows)
                    })
            }
            else {
                let sqlQuery =`SELECT * FROM employer WHERE employer_id = ?`
                conn.query(sqlQuery,
                    [emailOrID], (err, rows) => {
                        if (err)
                            reject(err)
                        else
                            resolve(rows)
                    })
            }

        })
    }
}