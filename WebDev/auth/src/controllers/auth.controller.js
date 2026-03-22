import User from '../models/user.model.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import Session from '../models/session.model.js';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne(
            { $or: [{ username }, { email }] }
        );

        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Create new user
        // const newUser = new User({ username, email, password: hashedPassword });
        // await newUser.save();

        const user = await User.create({ username, email, password: hashedPassword });

        const refreshToken = jwt.sign({ 
            id: user._id }
            , config.JWT_SECRET, 
            { 
                expiresIn: '7d' 
            }
        );

        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        
        const session = new Session({
            user: user._id,
            refreshToken: refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        await session.save();

        const accessToken = jwt.sign({ 
                id: user._id,
                sessionId: session._id
            }, config.JWT_SECRET, 
            { 
                expiresIn: '15m' 
            }
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(201).json({ message: 'User registered successfully', 
            user: {
                username: user.username,
                email: user.email
            },
            token: accessToken,
         });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMe = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer token

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User retrieved successfully', 
            user: {
                username: user.username,
                email: user.email
            }
         });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
        const user = await User.findById(decoded.id);

        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const session = await Session.findOne({ 
            user: user._id, 
            refreshToken: refreshTokenHash, 
            revoked: false 
        });

        if (!session || !user) {
            return res.status(404).json({ message: 'Unauthorized User' });
        }

        const newAccessToken = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '15m' });
        const newRefreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
        await Session.findByIdAndUpdate(session._id, { refreshToken: newRefreshTokenHash });

        return res.status(200).json({ 
            message: 'Access token refreshed successfully', 
            token: newAccessToken 
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        if (hashedPassword !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '7d' });
        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

        const session = new Session({
            user: user._id,
            refreshToken: refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        await session.save();

        const accessToken = jwt.sign({ id: user._id, sessionId: session._id }, config.JWT_SECRET, { expiresIn: '15m' });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({ 
            message: 'Logged in successfully', 
            user: {
                username: user.username,
                email: user.email
            },
            token: accessToken 
        }); 
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });  
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await Session.findOneAndUpdate(
            { user: user._id, refreshToken: crypto.createHash('sha256').update(refreshToken).digest('hex') },
            { revoked: true }
        );

        res.clearCookie('refreshToken');

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const logoutAll = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await Session.updateMany(
            { user: user._id },
            { revoked: true }
        );

        res.clearCookie('refreshToken');

        return res.status(200).json({ message: 'Logged out from all sessions successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};