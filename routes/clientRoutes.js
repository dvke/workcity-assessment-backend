const express = require("express");
const {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
} = require("../controllers/clientController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { validateClient } = require("../middleware/validationMiddleware");
const router = express.Router();

// All routes below are protected
router.use(protect);

router
  .route("/")
  .get(getClients)
  .post(authorize("admin", "user"), validateClient, createClient);

router
  .route("/:id")
  .get(getClient)
  .put(authorize("admin"), validateClient, updateClient)
  .delete(authorize("admin"), deleteClient);

module.exports = router;
