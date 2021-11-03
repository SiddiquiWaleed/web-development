let conn = require('./connection')

module.exports = {
    registerNewCandidate: (newUser, currentCount) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`
                INSERT INTO
                candidate(candidate_id, first_name, last_name, email, username, phone, password, birthday, gender)
                VALUES(?,?,?,?,?,?,?,?,?)`
            conn.query(sqlQuery,
                [ currentCount.count, newUser.first_name, newUser.last_name, newUser.email, newUser.username, newUser.phone, newUser.password,
                    newUser.birthday, newUser.gender ], (err, rows) => {
                if (err)
                    reject(err)
                else
                    resolve(rows)
            })
        })
    },

    registerNewEmployer: (newUser, currentCount) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`
                INSERT INTO
                employer(employer_id, first_name, last_name, designation, company_name, email, username, phone, password, gender)
                VALUES(?,?,?,?,?,?,?,?,?,?)`
            conn.query(sqlQuery,
                [ currentCount.count, newUser.first_name, newUser.last_name, newUser.designation, newUser.company_name, newUser.email, newUser.username,
                    newUser.phone, newUser.password, newUser.gender ], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    firstTimeSettingsCandidate: (newUser) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`
                UPDATE candidate SET profile_pic = ?, bio = ?, iin = ?, address = ? WHERE candidate_id = ?`
            conn.query(sqlQuery,
                [ newUser.profile_pic, newUser.bio, newUser.iin, newUser.address, newUser.candidate_id ], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    firstTimeSettingsEmployer: (newUser) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`
                UPDATE employer SET profile_pic = ?, address = ?, postal_code = ? WHERE employer_id = ?`
            conn.query(sqlQuery,
                [ newUser.profile_pic, newUser.address, newUser.postal_code, newUser.employer_id ], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    getCurrentUserCount: () => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT * FROM user_counter LIMIT 1`
            conn.query(sqlQuery, [], (err, rows) => {
                    if (err)
                        reject(err)
                    else
                        resolve(rows)
                })
        })
    },

    increamentCurrentUserCount: () => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`UPDATE user_counter SET count = count + 1`
            conn.query(sqlQuery, [], (err, rows) => {
                if (err)
                    reject(err)
                else
                    resolve(rows)
            })
        })
    },

    checkIfCandidateEmailExists: (email) => {
        return new Promise((resolve, reject) => {
            let sqlQuery =`SELECT * FROM candidate WHERE email = ?`
            conn.query(sqlQuery, [email], (err, rows) => {
                if (err)
                    reject(err)
                else
                    resolve(rows)
            })
        })
    }
}