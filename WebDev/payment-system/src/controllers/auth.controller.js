import User from '../models/user.model.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import Session from '../models/session.model.js';
import { sendRegistrationEmail, sendWelcomeEmail } from '../services/email.service.js';
import { Otp } from '../models/otp.model.js';

function generateOtp () {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne(
            { $or: [{ name }, { email }] }
        );

        if (existingUser) {
            return res.status(409).json({ message: 'Name or email already exists' });
        }

        const user = await User.create({ name, email, password });

        const otp = generateOtp();
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        await Otp.create({
            email,
            user: user._id,
            otpHash,
            expiresAt
        });

        await sendRegistrationEmail(user.email, user.name, otp);

        return res.status(201).json({ message: 'User registered successfully', 
            user: {
                name: user.name,
                email: user.email,
                verified: user.verified
            },
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

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.verified) {
            return res.status(403).json({ message: 'User not verified' });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
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
                name: user.name,
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

export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otpRecord = await Otp.findOne({ email, user: user._id });

        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP not found' });
        }

        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

        if (otpHash !== otpRecord.otpHash) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        user.verified = true;
        await user.save();
        await Otp.deleteMany({ email, user: user._id });
        await sendWelcomeEmail(user.email, user.name);

        return res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};