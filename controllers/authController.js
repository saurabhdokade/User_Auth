const { registerUser, loginUser, forgotPassword, resetPassword,logoutUser } = require('../services/authService');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const { user, token } = await registerUser(name, email, password);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await loginUser(email, password);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        await logoutUser(); // Client should handle token removal (clear JWT from storage/cookie)
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const forgot = async (req, res) => {
    try {
        const { email } = req.body;
        const response = await forgotPassword(email);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const reset = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const response = await resetPassword(token, newPassword);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { register, login, forgot, reset };
