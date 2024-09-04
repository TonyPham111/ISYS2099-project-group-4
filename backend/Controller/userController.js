import bcrypt from "bcryptjs";
import { setTokenCookie, generateTokens } from "../Middleware/auth.js";
import hrRepo from "../Models/HrModel.js";

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

    if (req.role !== "HR") {
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

    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    return res.status(201).json({
      message: `User ${full_name} created successfully.`,
      full_name,
      job_id,
      department_id,
      email,
    });
  } catch (err) {
    console.error("Error while registering a new user:", err);
    return res.status(500).json({ error: "An error occurred while registering the new user. Please try again later." });
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
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    const isMatch = bcrypt.compare(password, user.staff_password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const tokens = generateTokens(user.id, user.email, user.job_name);
    setTokenCookie(res, tokens);

    return res.status(200).json({ message: "Login successful.", tokens });
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
