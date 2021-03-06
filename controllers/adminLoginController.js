const db = require('../database');

exports.getAdminLogin = (req, res) => {
    res.render('adminViews/adminLogin',{layout: 'layouts/mainLayout', title: 'admin Login' });
};

exports.postAdminLogin = (req, res) => {

    const { username, password } = req.body;
    let errors = [];

    if (!username || !password) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (errors.length > 0) {
        res.render('adminViews/adminLogin',{layout: 'layouts/mainLayout', title: 'admin Login',
            errors,
            username,
            password
        });
    }
    else {
        const queryString = `SELECT * FROM happyhealth.usertbl WHERE userName = '${username}' and Password = '${password}' and Admin = 'Yes'`;

        db.query(queryString, function (err, result) {
            if (result.length > 0) {
                const userId = result[0]['userId'];
                req.session.userId = userId;
                res.redirect('/adminHome');
                console.log('************Admin Login successfully**************');
            } else {
                errors.push({ msg: 'Enter correct username or password' });
                res.render('adminViews/adminLogin',{layout: 'layouts/mainLayout', title: 'admin Login',
                    errors,
                    username,
                    password
                });
            }

        });

    }
};

exports.getAdminHome = (req, res) => {
    const userId = req.session.userId;
    res.render('adminViews/adminHome',{layout: 'layouts/adminLayout', title: 'admin Home'});
};

exports.getUserManagement = (req, res) => {
    const userId = req.session.userId;
    console.log(`User ID: ${userId}`, '--------getUserManagement controller');
    const allUsersQuery = `SELECT * FROM happyhealth.usertbl WHERE userId <> ${userId}`;
    db.query(allUsersQuery, function (err, result) {
        if (err) {
            throw err;
        } else {
            console.log(`${JSON.stringify(result)}`, '------------db users result');
            res.render('adminViews/userManagement',{layout: 'layouts/adminLayout', title: 'User Management', result})
            console.log('***********getUserManagement executed successfully*********');
        }
    });
};

exports.editUser = (req, res) => {
    const userId = req.params.userId;
    const body = req.body;
    var editQuery = `SELECT * FROM happyhealth.usertbl WHERE UserId = ${userId}`;
    db.query(editQuery, function (err, result) {
        if (err) {
            throw err;
        } else {
            console.log(result);
            res.render('editProfile', { result });
            console.log('***********editUser executed successfully*********');
        }

    });

};

exports.updateUser = (req, res) => {

    console.log(req.body);

    const userId = req.params.userId;
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;

    const updateQuery = `UPDATE happyhealth.usertbl SET Password = '${password}', Email = '${email}', Username = '${userName}' WHERE UserId = ${userId};`;

    db.query(updateQuery, function (err, result) {
        if (err) {
            throw err;
            return;
        }
        res.redirect('../userManagement');
        console.log("*************updateUser executed successfully***********");

    });


};

exports.deleteUser = (req, res) => {

    const userId = req.params.userId;
    const deleteQuery = `Delete FROM happyhealth.USERtbl WHERE UserId = '${userId}';`;

    db.query(deleteQuery, function (err) {
        if (err) {
            throw err;
        } else {
            res.redirect('/userManagement');
        }

    });
};




exports.getAdminAnalytics = (req, res) => {

    res.render('adminAnalytics');
};

exports.getAdminAnalyticsStep = (req, res) => {
    res.render('adminAnalyticsStep');
};

exports.getAdminAnalyticsSleep = (req, res) => {

 //   var query = `SELECT userId,date,sleepHours,sleepGoal FROM happyhealth.usermetricstbl;`


 var query = `select usertbl.userId, usertbl.userName, usermetricstbl.sleepHours, usermetricstbl.sleepGoal from usertbl inner join usermetricstbl where usertbl.userId =  usermetricstbl.userId;`

    db.query(query, function (err, result) {
        if (err) throw err;
        else {
            console.log(result);

            res.render('adminAnalyticsSleep', { obj : result }   );
        }
    });
};


exports.getAdminAnalyticsWater = (req, res) => {
    res.render('adminAnalyticsWater');
};

exports.getAdminAnalyticsMediation = (req, res) => {
    res.render('adminAnalyticsMeditation');
};

exports.getAdminAnalyticsFruits = (req, res) => {
    res.render('adminAnalyticsFruits');
};

exports.getAdminAnalyticsVegetables = (req, res) => {
    res.render('adminAnalyticsVegetables');
};