let conn = require('./connection')

module.exports = {
    getReference: (refID, canID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT reference.reference_id, reference.candidate_id, reference.referee_email, reference.referee_title,
             reference.referee_surname, reference.referee_name, reference.referee_company_name, reference.referee_designation, 
             reference.referee_address, reference.referee_postal_code, reference.referee_phone_number, 
             DATE_FORMAT(reference.start_date, "%Y-%m-%d") as start_date, DATE_FORMAT(reference.end_date, "%Y-%m-%d") as end_date, 
             reference_document.document_path FROM reference LEFT JOIN reference_document ON reference.reference_id = reference_document.reference_id 
             WHERE reference.reference_id = ? AND reference.candidate_id = ?`
            conn.query(sqlQuery,
                [refID, canID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    insertResponse: (response) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`INSERT INTO reference_response(reference_id, result, reason_for_leaving, number_of_sickness, 
        warnings, investigations, comment, please_explain_why) 
        VALUES(?,?,?,?,?,?,?,?)`
            conn.query(sqlQuery,
                [response.reference_id, response.result, response.reason_for_leaving, response.number_of_sickness,
                    response.warnings, response.investigations, response.comment, response.please_explain_why], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    changeStatusFromPendingToVerified: (refID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`UPDATE reference SET reference_status = ? WHERE reference_id = ?`
            conn.query(sqlQuery,
                ['verified', refID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    changeStatusFromPendingToUnVerified: (refID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`UPDATE reference SET reference_status = ? WHERE reference_id = ?`
            conn.query(sqlQuery,
                ['unverified', refID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    checkIfFormAlreadySubmitted: (refID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT * FROM reference_response WHERE reference_id = ?`
            conn.query(sqlQuery,
                [refID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    }

}