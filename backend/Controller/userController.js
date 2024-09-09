import bcrypt from "bcryptjs";
import { setTokenCookie, generateTokens } from "../Middleware/auth.js";
import hrRepo from "../Models/HrModel.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Regular expression to allow only normal characters in email
const normalCharRegex = /^[A-Za-z0-9._@-]*$/;

// Registration page
export const registerPage = (req, res) => {
  res.send("This is Register page");
};

export const loginPage = (req, res) => {
  res.send("This is Login page");
};

// Registration Endpoint
export const register = async (req, res) => {
  const user_info = req.user;
  try {
    const {
      full_name,
      job_id,
      department_id,
      manager_id,
      gender,
      birth_date,
      home_address,
      phone_number,
      email,
      password,
      wage
    } = req.body;

    if (user_info.role !== "HR") {
      return res.status(403).json({ error: "Access denied. Only HR staff can register new users." });
    }

    if (!full_name || !job_id || !department_id || !email || !password) {
      return res.status(400).json({ error: "Please provide all the required fields." });
    }
  
    if (!email.match(normalCharRegex)) {
      return res.status(400).json({ error: "Invalid characters in email." });
    }

    // Check if the user already exists
    const existingUser = await hrRepo.AuthenticateUser(email); 
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await hrRepo.AddNewStaff(
      full_name,
      job_id,
      department_id,
      manager_id,
      gender,
      birth_date,
      home_address,
      phone_number,
      email,
      hashedPassword,
      wage
    );
    return res.status(201).json({
      message: `User ${full_name} created successfully.`,
      full_name,
      job_id,
      department_id,
      email,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Login Endpoint
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide both email and password." });
    }

    const user = await hrRepo.AuthenticateUser(email); 
    console.log(user);
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.staff_password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
     user.job_name = user.job_name.replaceAll(/\s/g,'');
     console.log(user.job_name);
    const tokens = generateTokens(user.id, user.email, user.job_name, user.job_id, user.department_id);
    setTokenCookie(res, tokens);
    
    return res.status(200).json({ 
      message: "Login successful.", 
      credentials: user,
      status: "verified" 
    });
  } catch (err) {
    console.error("Error while logging in:", err);
    return res.status(500).json({ error: "An error occurred during login. Please try again later." });
  }
};

// Logout Endpoint
export const logout = (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    console.error("Error while logging out:", err);
    return res.status(500).json({ error: "An error occurred during logout. Please try again later." });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { email, newPassword } = req.body;
  try {
    const user = await hrRepo.AuthenticateUser(email);
    if (!user) {
      return res.status(400).json({ error: "Email not verified or user not found." });
    }

    const verifiedUser = await hrRepo.findUserByResetToken(token);
    if (!verifiedUser || verifiedUser.verificationTokenExpiry < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await hrRepo.updateUserPassword(email, hashedPassword);

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (err) {
    console.error("Error while resetting password:", err);
    res.status(500).json({ error: "An error occurred while resetting the password. Please try again later." });
  }
};

// Generate Password Reset Token
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await hrRepo.AuthenticateUser(email);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    await hrRepo.savePasswordResetToken(email, resetToken, resetTokenExpiry);

    const resetLink = `http://localhost:8000/user/reset-password/${resetToken}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${resetLink}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (err) {
    console.error("Error while requesting password reset:", err);
    res.status(500).json({ error: "An error occurred while requesting password reset. Please try again later." });
  }
};
