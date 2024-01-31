import { body } from "express-validator";
import pool from "../db/pool.js";

export const userValidator = [
    body("first_name")
      .notEmpty()
      .withMessage("First name required.")
      .isString()
      .withMessage("First name must be a string.")
      .trim()
      .escape(),
    body("last_name")
      .notEmpty()
      .withMessage("Last name required.")
      .isString()
      .withMessage("Last name must be a string.")
      .trim()
      .escape(),
    body("age")
      .notEmpty()
      .withMessage("Age required.")
      .isInt({ min: 1 })
      .withMessage("Age must be a number greater than 0."),
  ];
  
  export const validatePutUser = [
    body("first_name").optional().notEmpty().isString().trim().escape(),
    body("last_name").optional().notEmpty().isString().trim().escape(),
    body("age").optional().notEmpty().isInt({ min: 0 }).trim().escape(),
  ];
  
  export const checkUser = async (req, res, next) => {
    const { id } = req.params;
    if (!id) res.status(400).json("User id required.");
    try {
      const text = "SELECT * FROM users WHERE id=$1";
      const values = [id];
      const { rows } = await pool.query(text, values);
      rows.length === 0 ? res.status(404).json("User not found") : next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };