
const express = require("express");
const { authenticateUser } = require("../middlewares/auth.middlewares");
const { register, login, getUserForms, getAllForms, submitFormResponse,getFormById } = require("../controllers/authcontrollers");
 
const router = express.Router();
 
router.post("/register", register);
router.post("/login", login);

router.get("/user/:userId/forms", authenticateUser, getUserForms);
router.get("/forms", authenticateUser, getAllForms); 
router.post("/form/:formId/submit", authenticateUser, submitFormResponse); 
router.get("/forms/:id",authenticateUser, getFormById);

 
module.exports = router;
 