const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const UserSchema = new Schema(
    {
        username: { type: String, maxLength: 255 },
        email: { type: String, maxLength: 255, require: true, lowercase: true },
        password: { type: String, maxLength: 255, require: true },
        full_name: { type: String, maxLength: 255, default: null },
        phone_number: { type: String, maxLength: 255, default: null },
        address: { type: String, maxLength: 255, default: null },
        active: { type: Boolean, default: false },
        role: { type: String, default: 'user' },
    },
    {
        timestamps: true,
    },
);

UserSchema.methods = {
    isCorrectPassword: async function (password) {
        return await bcrypt.compare(password, this.password);
    },

    createPasswordChangedToken: function () {
        const resetToken = crypto.randomBytes(32).toString('hex');
        this.password_reset_token = crypto.createHash('sha256').update(resetToken).digest('hex');
        this.password_reset_expires = Date.now() + 15 * 60 * 1000;
        return resetToken;
    },
};

// Static methods for CRUD operations
UserSchema.statics = {
    // Create a new user
    createUser: async function (data) {
        const { username, email, password, full_name, phone_number, address, role } = data;

        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const existingUser = await this.findOne({ email });
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.create({
            username,
            email,
            password: hashedPassword,
            full_name,
            phone_number,
            address,
            role: role || 'user',
            active: false,
        });

        return {
            _id: user._id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            phone_number: user.phone_number,
            address: user.address,
            role: user.role,
            active: user.active,
        };
    },

    // Get all users
    getAllUsers: async function () {
        return await this.find().select('-password -password_reset_token -password_reset_expires');
    },

    // Get a single user by ID
    getUserById: async function (id) {
        const user = await this.findById(id).select('-password -password_reset_token -password_reset_expires');
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    // Update a user
    updateUser: async function (id, data) {
        const { username, email, full_name, phone_number, address, role, active } = data;

        const user = await this.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        const updatedData = {
            username: username || user.username,
            email: email || user.email,
            full_name: full_name || user.full_name,
            phone_number: phone_number || user.phone_number,
            address: address || user.address,
            role: role || user.role,
            active: active !== undefined ? active : user.active,
        };

        const updatedUser = await this.findByIdAndUpdate(id, { $set: updatedData }, { new: true }).select(
            '-password -password_reset_token -password_reset_expires',
        );

        return updatedUser;
    },

    // Delete a user
    deleteUser: async function (id) {
        const user = await this.findByIdAndDelete(id);
        if (!user) {
            throw new Error('User not found');
        }
        return { message: 'User deleted successfully' };
    },

    // Basic search users
    searchUsers: async function (queryParams) {
        const { query } = queryParams || {};

        if (!query) {
            return await this.find().select('-password -password_reset_token -password_reset_expires');
        }

        const searchRegex = new RegExp(query, 'i'); // Case-insensitive regex
        return await this.find({
            $or: [{ username: searchRegex }, { email: searchRegex }, { full_name: searchRegex }],
        }).select('-password -password_reset_token -password_reset_expires');
    },

    // Advanced search users
    // Basic search users with sort
    advancedSearchUsers: async function (queryParams) {
        const { query, sortField, sortOrder } = queryParams || {};

        const searchRegex = query ? new RegExp(query, 'i') : null;

        const searchCondition = searchRegex
            ? {
                  $or: [{ username: searchRegex }, { email: searchRegex }, { full_name: searchRegex }],
              }
            : {};

        const sort = {};
        if (sortField) {
            sort[sortField] = sortOrder === 'desc' ? -1 : 1;
        }

        return await this.find(searchCondition)
            .sort(sort)
            .select('-password -password_reset_token -password_reset_expires');
    },
};

module.exports = mongoose.model('User', UserSchema);
