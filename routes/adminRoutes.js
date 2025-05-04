
const express = require('express');
const router = express.Router();
const AdminController = require('../controller/adminController')
const { adminAuthenticate } = require('../middleware/adminAuthenication')
const {
    signupvalidationRule,
    signupvalidation,
} = require("../middleware/signupvaliadtion");


router.post('/signup',
    signupvalidationRule(),
    signupvalidation,
    AdminController.handleCreateAdmin
);
router.post('/login', AdminController.handleSignIn);
router.get("/", adminAuthenticate, AdminController.getAdmin);
router.patch("/update",adminAuthenticate, AdminController.updateAdmin)


module.exports = router