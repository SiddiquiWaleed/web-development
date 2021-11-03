let conn = require('./connection')

module.exports = {
    getCandidateFromID: (canID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT * FROM candidate WHERE candidate_id = ?`
            conn.query(sqlQuery,
                [canID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    getReferencesOfCandidate: (canID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT * FROM reference WHERE candidate_id = ?`
            conn.query(sqlQuery,
                [canID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    getReferenceWithResponse: (refID, canID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT reference.reference_id, reference.candidate_id, reference.referee_email, reference.referee_title,
             reference.referee_surname, reference.referee_name, reference.referee_company_name, reference.referee_designation, 
             reference.referee_address, reference.referee_postal_code, reference.referee_phone_number, 
             DATE_FORMAT(reference.start_date, "%Y-%m-%d") as start_date, DATE_FORMAT(reference.end_date, "%Y-%m-%d") as end_date, 
             reference_document.document_path, reference_response.reference_response_id, reference_response.result, reference_response.reason_for_leaving, 
             reference_response.number_of_sickness, reference_response.warnings, reference_response.investigations, reference_response.comment, 
             reference_response.please_explain_why FROM reference LEFT JOIN reference_document ON reference.reference_id = reference_document.reference_id 
             LEFT JOIN reference_response ON reference.reference_id = reference_response.reference_id
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

    updateSettings: (user) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`UPDATE employer SET first_name = ?, last_name = ?, username = ?, phone = ?, company_name = ?, designation = ?, gender = ?, postal_code = ?, address = ? WHERE employer_id = ?`
            conn.query(sqlQuery,
                [user.firstName, user.lastName, user.username, user.phone, user.companyName, user.designation, user.gender, user.postalCode, user.address, user.employer_id], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    getEmployer: (empID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT * FROM employer WHERE employer_id = ?`
            conn.query(sqlQuery,
                [empID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    updateProfilePic: (profilePic, empID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`UPDATE employer SET profile_pic = ? WHERE employer_id = ?`
            conn.query(sqlQuery,
                [profilePic, empID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    changePassword: (empID, password) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`UPDATE employer SET password = ? WHERE employer_id = ?`
            conn.query(sqlQuery,
                [password, empID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    }
}