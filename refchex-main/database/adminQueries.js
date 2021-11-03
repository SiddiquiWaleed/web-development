let conn = require('./connection')

module.exports = {

    checkAdminLogin: (username, password) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT * FROM admin WHERE admin_username = ? AND admin_password = ? AND admin_id = 1`
            conn.query(sqlQuery,
                [username, password], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    insertFAQ: (faq) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`INSERT INTO faq(faq_question, faq_answer, faq_type) VALUES(?,?,?)`
            conn.query(sqlQuery,
                [faq.faq_question, faq.faq_answer, faq.faq_type], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

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

    deleteFAQ: (faqId) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`DELETE FROM faq WHERE faq_id = ?`
            conn.query(sqlQuery,
                [faqId], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    }

}