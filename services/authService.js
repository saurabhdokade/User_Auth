const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utils/sendEmail');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

const registerUser = async (name, email, password) => {
    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    return { user, token };
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = generateToken(user._id);
    return { user, token };
};

const forgotPassword = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('No user found with this email');
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000;
    await user.save();

    const resetUrl = `http://localhost:5000/api/auth/reset-password/${resetToken}`;

    // Send the reset email
    await sendEmail(email, 'Password Reset', `Click the link to reset your password: ${resetUrl}`);

    return { message: 'Reset password email sent' };
};

const resetPassword = async (token, newPassword) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.resetPasswordExpire < Date.now()) {
        throw new Error('Token is invalid or has expired');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return { message: 'Password has been updated' };
};



const logoutUser = async () => {
    // Clear the token from the client side (browser/local storage or cookies)
    // This is handled by the client (e.g., frontend)
    // So, no need for backend code to store or manage tokens in the case of stateless JWT.

    return { message: "User logged out successfully" };
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword, logoutUser };

// module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
