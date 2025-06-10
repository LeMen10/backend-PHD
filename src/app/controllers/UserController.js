const asyncHandler = require('express-async-handler');
const User = require('../models/User');

class UserController {
    // Create a new user
    createUser = asyncHandler(async (req, res) => {
        const user = await User.createUser(req.body);
        return res.status(201).json({ success: true, user });
    });

    // Get all users
    getAllUsers = asyncHandler(async (req, res) => {
        const users = await User.getAllUsers();
        return res.status(200).json({ success: true, users });
    });

    // Get a single user by ID
    getUserById = asyncHandler(async (req, res) => {
        const user = await User.getUserById(req.params.id);
        return res.status(200).json({ success: true, user });
    });

    // Update a user
    updateUser = asyncHandler(async (req, res) => {
        const user = await User.updateUser(req.params.id, req.body);
        return res.status(200).json({ success: true, user });
    });

    // Delete a user
    deleteUser = asyncHandler(async (req, res) => {
        const result = await User.deleteUser(req.params.id);
        return res.status(200).json({ success: true, message: result.message });
    });

    // Basic search users
    searchUsers = asyncHandler(async (req, res) => {
        const users = await User.searchUsers(req.query);
        return res.status(200).json({ success: true, users });
    });

    // Advanced search users
    advancedSearchUsers = asyncHandler(async (req, res) => {
        const users = await User.advancedSearchUsers(req.query);
        return res.status(200).json({ success: true, users });
    });
}

module.exports = new UserController();
