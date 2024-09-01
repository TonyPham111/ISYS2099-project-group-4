import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import verifyToken  from "Middleware/auth.js";
const { generateTokens, setTokenCookie, verifyToken } = require("../utils");
const { db, model } = require("../models");

const normalCharRegex = /^[A-Za-z0-9._-]*$/;
const app = express();
app.use(cookieParser());

// Registration Endpoint
export const register = async (req, res) => {
    try {
      const { email, password, role } = req.body;
  
      // Validate input to prevent SQL injection
      const normalCharRegex = /^[A-Za-z0-9._-]*$/;
      if (!email.match(normalCharRegex)) {
        throw new Error("The email must not have strange characters");
      }
  
      // Check if user already exists
      const existingUser = await getUserByRole(username, role);
      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }
  
      // Hash the password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
  
      // Insert the user into the database
      await insertUserByRole(role, username, hashedPassword);
  
      return res.status(200).json({
        message: `User ${role} created with username: ${username}`,
        username,
        role,
      });
    } catch (err) {
      console.error("Error: " + err.message);
      return res.status(500).json({ error: "Error inserting user into database" });
    }
  };

// Login Endpoint
export const login = async (req, res) => {
    try {
      const { username, password, role } = req.body;
  
      // Retrieve the user from the database
      const existingUser = await getUserByRole(username, role);
      if (!existingUser) {
        return res.status(401).json({ error: "User not found" });
      }
  
      // Compare provided password with stored hashed password
      const passwordMatches = bcrypt.compareSync(password, existingUser.password_hash);
      if (!passwordMatches) {
        return res.status(401).json({ error: "Incorrect password" });
      }
  
      // Generate tokens
      const tokens = generateTokens(username, role);
  
      // Set the token as a cookie
      setTokenCookie(res, tokens);
  
      return res.status(200).json({
        message: `User ${username} authenticated`,
        username,
        role,
      });
    } catch (err) {
      console.error("Error: " + err.message);
      res.sendStatus(500);
    }
  };
  
  // Logout Endpoint
export const logout = async (req, res) => {
    try {
      const { username, role } = req;
  
      await deleteUserToken(username, role); // Function to remove token from the database
  
      res.clearCookie("accessToken", { httpOnly: true });
      res.clearCookie("refreshToken", { httpOnly: true });
  
      return res.status(200).json({
        message: `User ${username} logged out`,
        username,
        role,
      });
    } catch (err) {
      console.error("Error: " + err.message);
      res.sendStatus(500);
    }
  };