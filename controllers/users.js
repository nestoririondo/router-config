import pool from "../db/pool.js";
import { body, validationResult } from "express-validator";

export const userValidator = () => [
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

export const getUsers = async (req, res) => {
  console.log("Someone tried to get the users");
  try {
    const text = "SELECT * FROM users";
    const { rows } = await pool.query(text);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  console.log(`Someone tried to get user ${id}`);
  try {
    const text = "SELECT * FROM users WHERE id=$1";
    const values = [id];
    const { rows } = await pool.query(text, values);
    rows.length === 0
      ? res.status(404).json("User not found")
      : res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const postUser = async (req, res) => {
  const { first_name, last_name, age } = req.body;
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).send({ errors: result.array() });
  }

  try {
    const text =
      "INSERT INTO users (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *";
    const values = [first_name, last_name, age];
    const { rows } = await pool.query(text, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
