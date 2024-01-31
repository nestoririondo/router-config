import pool from "../db/pool.js";
import { validationResult } from "express-validator";

export const getUsers = async (req, res) => {
  console.log("GET users");
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
  console.log(`GET user ${id}`);
  try {
    const text = "SELECT * FROM users WHERE id=$1";
    const values = [id];
    const { rows } = await pool.query(text, values);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const postUser = async (req, res) => {
  const { first_name, last_name, age } = req.body;
  console.log(`POST ${first_name}, ${last_name}, ${age}`);
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

export const putUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age } = req.body;
  console.log(`PUT user ${id}: ${first_name}, ${last_name}, ${age}`);

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).send({ errors: result.array() });
  }

  try {
    let text = "UPDATE users SET ";
    let values = [];
    if (first_name) {
      text += "first_name = $1";
      values.push(first_name);
    }
    if (last_name) {
      text +=
        (values.length > 0 ? ", " : "") + "last_name = $" + (values.length + 1);
      values.push(last_name);
    }
    if (age) {
      text += (values.length > 0 ? ", " : "") + "age = $" + (values.length + 1);
      values.push(age);
    }
    if (!first_name && !last_name && !age)
      res.status(400).json("first_name, last_name and age not specified.");

    text +=
      (values.length > 0 ? " " : "") +
      "WHERE id=$" +
      (values.length + 1) +
      " RETURNING *";
    values.push(Number(id));
    console.log(text, values);

    const { rows } = await pool.query(text, values);

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log(`DELETE user ${id}`);
  try {
    const text = "DELETE FROM users WHERE id = $1 RETURNING *";
    const values = [id];
    const { rows } = await pool.query(text, values);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
