const userService = require('../services/user');

async function getUsers(req, res) {
    try {
        const users = await userService.getUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Failed to fetch users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { getUsers };