const Client = require("../models/Client");
const { validationResult } = require("express-validator");

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private (User or Admin)
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res
      .status(200)
      .json({ success: true, count: clients.length, data: clients });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get a single client
// @route   GET /api/clients/:id
// @access  Private (User or Admin)
exports.getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Create a new client
// @route   POST /api/clients
// @access  Private (User or Admin)
exports.createClient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const clientData = { ...req.body, createdBy: req.user.id };
    const client = await Client.create(clientData);
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    // Handle duplicate key error for email
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A client with this email already exists.",
      });
    }
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Update a client
// @route   PUT /api/clients/:id
// @access  Private (Admin only)
exports.updateClient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    let client = await Client.findById(req.params.id);
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }
    client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete a client
// @route   DELETE /api/clients/:id
// @access  Private (Admin only)
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }
    await client.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
