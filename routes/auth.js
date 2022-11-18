const express = require('express');
const router = express.Router(); //call router from express
const {login,register} = require("../controllers/auth");

router.post("/register",register); //same as router.route('/register').post(register)
router.post("/login",login); //same as router.route('/login').post(login)

module.exports = router;