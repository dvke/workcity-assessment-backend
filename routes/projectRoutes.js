const express = require("express");
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByClient,
} = require("../controllers/projectController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { validateProject } = require("../middleware/validationMiddleware");
const router = express.Router();

// All routes below are protected
router.use(protect);

router
  .route("/")
  .get(getProjects)
  .post(authorize("admin", "user"), validateProject, createProject);

// Special route to get projects for a specific client
router.route("/client/:clientId").get(getProjectsByClient);

router
  .route("/:id")
  .get(getProject)
  .put(authorize("admin"), validateProject, updateProject)
  .delete(authorize("admin"), deleteProject);

module.exports = router;
