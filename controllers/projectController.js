const Project = require("../models/Project");
const Client = require("../models/Client");
const { validationResult } = require("express-validator");

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private (User or Admin)
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("clientId", "name");
    res
      .status(200)
      .json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get a single project
// @route   GET /api/projects/:id
// @access  Private (User or Admin)
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "clientId",
      "name email"
    );
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (User or Admin)
exports.createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Check if the client exists
    const client = await Client.findById(req.body.clientId);
    if (!client) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid client ID" });
    }

    const projectData = { ...req.body, createdBy: req.user.id };
    const project = await Project.create(projectData);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Admin only)
exports.updateProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // If clientId is being updated, verify the new client exists
    if (req.body.clientId) {
      const client = await Client.findById(req.body.clientId);
      if (!client) {
        return res.status(400).json({
          success: false,
          message: "Invalid client ID provided for update",
        });
      }
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    await project.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get all projects for a specific client
// @route   GET /api/projects/client/:clientId
// @access  Private (User or Admin)
exports.getProjectsByClient = async (req, res) => {
  try {
    const projects = await Project.find({ clientId: req.params.clientId });
    if (!projects) {
      return res
        .status(404)
        .json({ success: false, message: "No projects found for this client" });
    }
    res
      .status(200)
      .json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
