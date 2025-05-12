const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middlewares/auth.middlewares");
const { getDashboard, createForm, getForms, getResponses, getResponsesForUser, getFormByTitle, getFormById, updateFormById, deleteFormById } = require("../controllers/admincontroller");

const router = express.Router();


router.get("/", authenticateUser, authorizeRoles("admin"), getDashboard);
router.post("/form", authenticateUser, authorizeRoles("admin"), createForm);
router.get("/forms", authenticateUser, authorizeRoles("admin"), getForms);
router.get("/form/:id/responses", authenticateUser, authorizeRoles("admin"), getResponses);
router.get("/form/:id/responses/:userId", authenticateUser, authorizeRoles("admin"), getResponsesForUser);
router.get("/form", authenticateUser, authorizeRoles("admin"), getFormByTitle);
router.get("/form/:id", authenticateUser, authorizeRoles("admin"),getFormById);
router.put("/form/:id",authenticateUser, authorizeRoles("admin"), updateFormById);
router.delete("/form/:id", authenticateUser, authorizeRoles("admin"), deleteFormById);


module.exports = router;