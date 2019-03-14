const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const User = require("../models/user");

// login user
// :/api/user/login
router.post("/login", (req, res, next) => {
    console.log('/api/user/login');
    console.log(req.body.email);
    // validate credentials
    // if email exists
    let fetchedUser;
    User.findOne({
        email: req.body.email
    })
        .then(user => {
            // user exists, email exists
            console.log(user);
            if(!user){
                // user does not exist
                // console.log('User email does not exist');
                return res.status(401).json({
                    message: "Auth Failed! No Email exists!"
                })
            }
            // user was found
            // compare the passwords
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            console.log(result);
            // console.log(user);
            // true if they are the same passws
            if(!result) {
                // passwords dont match
                console.log('Password mismatch');
                return res.status(401).json({
                    message: "Auth Failed! Password Mismatch"
                });
            }
            // we have valid password
            // give them a valid json token
            const token = jwt.sign({
                email: fetchedUser.email,
                userId: fetchedUser._id,
            }, "kitt kats make me walk like im listening to bass music bro", {
                expiresIn: "1h"
            });

            console.log("Result from attempt at login:");
            console.log(fetchedUser);

            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id,
                firstName: fetchedUser.firstname,
                lastName: fetchedUser.lastname,
                email: fetchedUser.email,
                studentID: fetchedUser.studentID,
                phone: fetchedUser.phone,
                userLevel: fetchedUser.userLevel,
                message: "User Auth Successful!"
            })
        })
        .catch(err => {
            // catch any errors
            console.log(err);
            console.log('final catch');
            return res.status(401).json({
                message: "Auth Failed! No User Email Found"
            });
        });
});

// GET @ /api/user/getInfo/:id
router.get("/getInfo", checkAuth, (req, res, next) => {
    console.log("Searching and returing sanatized user Info");

    User.findOne({ _id: req.body.userId})
    .then(userInfo => {
        console.log("unsanatized user inf");
        console.log(userInfo);
    })
    .catch(err => {
        console.log("error retreiving sanatized user info");
        console.log(err);
    })
})

// create new user
router.post("/signup", (req, res, next) => {
    // create new user and store to database

    console.log("create user data");
    console.log(req.body);

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hash,
                studentID: req.body.studentID,
                phone: req.body.phone,
                userLevel: req.body.userLevel
            });
            console.log("user being saved to db");
            console.log(user);
            user.save()
                .then(result => {
                    console.log("created new user successfully");
                    res.status(201).json({
                        message: "User Created Successfull!",
                        result: result
                    });
                })
                .catch(err => {
                    console.log("new user create failed");
                    res.status(500).json({message: "User Email Alread Exists"})
                });
        })
    
    


});

// Development route to create new admin user
router.get("/createAdminUser", (req, res, next) => {
    console.log("create new admin user with email admin@uark.edu and password test");

    bcrypt.hash("test", 10)
        .then(hash => {
            const user = new User({
                firstname: "ADMIN",
                lastname: "USER",
                email: "admin@uark.edu",
                password: hash,
                studentID: "000000000",
                phone: "000000000",
                userLevel: "admin"
            });
            user.save()
                .then(result => {
                    console.log("created new admin user successfully");
                    res.status(201).json({
                        message: "User Created Successfull!",
                        result: result
                    });
                })
                .catch(err => {
                    console.log("new user create failed");
                    res.status(500).json({message: "User Email Alread Exists"})
                });
        })
}); // end create admin user

router.get("/createEmployeeUser", (req, res, next) => {
    console.log("create new Employee user with email Employee@uark.edu and password test");

    bcrypt.hash("test", 10)
        .then(hash => {
            const user = new User({
                firstname: "Employee",
                lastname: "User",
                email: "employee@uark.edu",
                password: hash,
                studentID: "1212121212",
                phone: "000000000",
                userLevel: "employee"
            });
            user.save()
                .then(result => {
                    console.log("created new admin user successfully");
                    res.status(201).json({
                        message: "User Created Successfull!",
                        result: result
                    });
                })
                .catch(err => {
                    console.log("new user create failed");
                    res.status(500).json({message: "User Email Alread Exists"})
                });
        })
}); // end create admin user

router.get("/createStudentUser", (req, res, next) => {
    console.log("create new student user with email student@uark.edu and password test");

    bcrypt.hash("test", 10)
        .then(hash => {
            const user = new User({
                firstname: "Student",
                lastname: "User ",
                email: "student@uark.edu",
                password: hash,
                studentID: "123456789",
                phone: "000000000",
                userLevel: "student"
            });
            user.save()
                .then(result => {
                    console.log("created new admin user successfully");
                    res.status(201).json({
                        message: "User Created Successfull!",
                        result: result
                    });
                })
                .catch(err => {
                    console.log("new user create failed");
                    res.status(500).json({message: "User Email Alread Exists"})
                });
        })
}); // end create admin user

// TODO MAKE NEW USERS
// GET@ /api/users
router.get("", checkAuth, (req, res, next) => {
    console.log('GET @ /api/users');
    console.log('returning list of all users');
    
    User.find({}).then(result => {
        console.log('result of getallUsers');
        console.log(result);
        res.status(201).json({
            message: "All Users fetched successfully",
            result: result
        });
    })
})



module.exports = router;