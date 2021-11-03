let conn = require('./connection')

module.exports = {
    addNewReference: (reference) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`INSERT INTO reference(candidate_id, referee_email, referee_title, referee_surname, referee_name, referee_company_name,
            referee_designation, referee_address, referee_postal_code, referee_phone_number, start_date, end_date) 
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`
            conn.query(sqlQuery,
                [reference.candidateID, reference.refereeEmail, reference.refereeTitle, reference.refereeSurname, reference.refereeName,
                reference.refereeCompanyName, reference.refereeDesignation, reference.refereeAddress, reference.refereePostalCode,
                reference.refereePhoneNumber, reference.startDate, reference.endDate], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    insertDocumentPath: (referenceID, documentPath) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`INSERT INTO reference_document(reference_id, document_path) VALUES(?,?)`
            conn.query(sqlQuery,
                [referenceID, documentPath], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    getPendingReferencesCount: (canID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT COUNT(*) as pending_count FROM reference WHERE candidate_id = ? AND reference_status = 'pending'`
            conn.query(sqlQuery,
                [canID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    getVerifiedReferencesCount: (canID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT COUNT(*) as verified_count FROM reference WHERE candidate_id = ? AND reference_status = 'verified'`
            conn.query(sqlQuery,
                [canID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    getUnVerifiedReferencesCount: (canID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT COUNT(*) as unverified_count FROM reference WHERE candidate_id = ? AND reference_status = 'unverified'`
            conn.query(sqlQuery,
                [canID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    getPendingReferences: (canID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT * FROM reference WHERE candidate_id = ? AND reference_status = ?`
            conn.query(sqlQuery,
                [canID, 'pending'], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    getVerifiedReferences: (canID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT * FROM reference WHERE candidate_id = ? AND reference_status = ?`
            conn.query(sqlQuery,
                [canID, 'verified'], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    getUnVerifiedReferences: (canID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT * FROM reference WHERE candidate_id = ? AND reference_status = ?`
            conn.query(sqlQuery,
                [canID, 'unverified'], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    getVerifiedReferenceWithResponse: (refID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT reference.reference_id, reference.candidate_id, reference. referee_email, 
                    reference.referee_title, reference.referee_surname, reference.referee_name, reference.referee_company_name, 
                    reference.referee_designation, reference.referee_address, reference.referee_postal_code, 
                    reference.referee_phone_number, DATE_FORMAT(reference.start_date, "%Y-%m-%d") as start_date, 
                    DATE_FORMAT(reference.end_date, "%Y-%m-%d"), reference_response.reason_for_leaving, 
                    reference_response.number_of_sickness, reference_response.warnings, reference_response.investigations, 
                    reference_response.comment FROM reference INNER JOIN reference_response ON 
                    reference.reference_id = reference_response.reference_id WHERE reference.reference_id = ?`
            conn.query(sqlQuery,
                [refID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    getAllReferencesOfCandidate: (canID) => {
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

    getReferenceByRefID: (refID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT * FROM reference WHERE reference_id = ?`
            conn.query(sqlQuery,
                [refID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    changeStatusToPending: (refID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`UPDATE reference SET reference_status = ? WHERE reference_id = ?`
            conn.query(sqlQuery,
                ['pending', refID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    referenceIsOfCurrentUser: (canID, refID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT * FROM reference WHERE candidate_id = ? AND reference_id = ?`
            conn.query(sqlQuery,
                [canID, refID], (err, rows) => {
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
            let sqlQuery =`UPDATE candidate SET first_name = ?, last_name = ?, username = ?, phone = ?, birthday = ?, gender = ?, bio = ?, iin = ?, address = ? WHERE candidate_id = ?`
            conn.query(sqlQuery,
                [user.firstName, user.lastName, user.username, user.phone, user.birthday, user.gender, user.bio, user.iin, user.address, user.candidate_id], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    getCandidate: (canID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT *, DATE_FORMAT(birthday, "%Y-%m-%d") as birth_day FROM candidate WHERE candidate_id = ?`
            conn.query(sqlQuery,
                [canID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    updateProfilePic: (profilePic, canID) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`UPDATE candidate SET profile_pic = ? WHERE candidate_id = ?`
            conn.query(sqlQuery,
                [profilePic, canID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    changePassword: (canID, password) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`UPDATE candidate SET password = ? WHERE candidate_id = ?`
            conn.query(sqlQuery,
                [password, canID], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    }

}