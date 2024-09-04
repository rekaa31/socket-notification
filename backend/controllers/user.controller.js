const { PrismaClient } = require("@prisma/client");
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { transporter } = require("../config/mailer");

const prisma = new PrismaClient();

// Auth Function
async function authLogin(req, res, next) {

	// Get User Agent (Client Information)
	const user_agent = req.headers['user-agent'];

	// Get Data User From Request
	const user_payload = {
		email: req.body.email,
		password: req.body.password
	};

	// Get User From Database
	const user = await prisma.user.findUnique({
		where: {
			email: user_payload.email
		}
	});

	// Check if User Not Found
	if (!user) {
		return res.status(400).json({ message: 'User Not Found' });
	}

	// Check Password
	const passwordMatch = bycrypt.compareSync(user_payload.password, user.password);

	// Check if Password Not Match
	if (!passwordMatch) {
		return res.status(400).json({ message: 'Username or Password Not Match' });
	}

	if (user_agent === user.user_agent) {
		// Generate JWT Token
		const token = jwt.sign({ email: user.email, id_user: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

		// Return Response
		return res.status(200).json({ message: 'Login Success', token: token });
	} else {
		// Generate OTP and Send to User Email
		const otp = Math.floor(1000 + Math.random() * 9000);

		// Update User to column OTP
		await prisma.user.update({
			where: {
				email: user.email
			},
			data: {
				otp: otp.toString(),
				// user_agent: user_agent
			}
		});

		// Send OTP to User Email
		transporter.sendMail({
			from: process.env.EMAIL,
			to: user.email,
			subject: 'OTP Verification',
			text: `Your OTP is ${otp}`
		});

		// Return Response
		return res.status(200).json({ 
			message: 'Silahkan Cek Email Anda',
			is_need_otp: true
		 });
	}
}

async function register(req, res, next) {

	// Get Data User From Request
	const user_payload = {
		email: req.body.email,
		password: await bycrypt.hash(req.body.password, 10),
	};

	// Find User From Database
	const user = await prisma.user.findUnique({
		where: {
			email: user_payload.email
		}
	});

	// Check if User Already Exist
	if (user) {
		return res.status(400).json({ message: 'User Already Exist' });
	}

	// Save User to Database
	await prisma.user.create({
		data: user_payload
	});

	// Return Response
	return res.status(200).json({ message: 'Register Success' });
}

async function verifyOTP(req, res, next) {
	// Get Data User From Request
	const user_payload = {
		email: req.body.email,
		otp: req.body.otp
	};

	// Find User From Database
	const user = await prisma.user.findUnique({
		where: {
			email: user_payload.email
		}
	});

	// Check if User Not Found
	if (!user) {
		return res.status(400).json({ message: 'User Not Found' });
	}

	// Check if OTP Not Match
	if (user.otp !== user_payload.otp) {
		return res.status(400).json({ message: 'OTP Not Match' });
	}

	// Generate Token
	const token = await jwt.sign({ email: user.email, id_user: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

	// Update User to column OTP
	await prisma.user.update({
		where: {
			email: user.email
		},
		data: {
			otp: null
		}
	});

	// Return Response
	return res.status(200).json({ message: 'OTP Verified', token: token });
}

module.exports = {
	authLogin,
	register,
	verifyOTP
};