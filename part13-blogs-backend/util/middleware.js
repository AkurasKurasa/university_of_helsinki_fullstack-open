const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');
const { User, Session } = require('../models');

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        req.token = authorization.substring(7);
    }
    next();
};

const userExtractor = async (req, res, next) => {
    if (req.token) {
        try {
            const decodedToken = jwt.verify(req.token, SECRET);

            const session = await Session.findOne({
                where: {
                    token: req.token,
                    userId: decodedToken.id
                }
            });

            if (!session) {
                return res.status(401).json({ error: 'token invalid' });
            }

            req.user = await User.findByPk(decodedToken.id);

            if (req.user.disabled) {
                return res.status(401).json({ error: 'account disabled' });
            }
        } catch (error) {
            return res.status(401).json({ error: 'token invalid' });
        }
    }
    next();
};

module.exports = { tokenExtractor, userExtractor };
