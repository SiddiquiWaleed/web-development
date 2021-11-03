let conn = require('./connection')

module.exports = {
    getAllCandidatesFAQ: () => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT * FROM faq WHERE faq_type = ?`
            conn.query(sqlQuery,
                ['candidate'], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    getAllEmployersFAQ: () => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT * FROM faq WHERE faq_type = ?`
            conn.query(sqlQuery,
                ['employer'], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },
}