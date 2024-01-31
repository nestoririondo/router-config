import pool from "../db/pool.js";
import { validationResult } from "express-validator";

export const getUsers = async (req, res) => {
  console.log("GET users");
  try {
    const query = "SELECT * FROM users";
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  console.log(`GET user ${id}`);
  try {
    const query = "SELECT * FROM users WHERE id=$1";
    const values = [id];
    const { rows } = await pool.query(query, values);
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
    const query =
      "INSERT INTO users (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *";
    const values = [first_name, last_name, age];
    const { rows } = await pool.query(query, values);
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
    let query = "UPDATE users SET ";
    let values = [];
    if (first_name) {
      query += "first_name = $1";
      values.push(first_name);
    }
    if (last_name) {
      query +=
        (values.length > 0 ? ", " : "") + "last_name = $" + (values.length + 1);
      values.push(last_name);
    }
    if (age) {
      query +=
        (values.length > 0 ? ", " : "") + "age = $" + (values.length + 1);
      values.push(age);
    }
    if (!first_name && !last_name && !age)
      res.status(422).json("first_name, last_name and age not specified."); // 422 Unprocessable Entity

    query += " WHERE id=$" + (values.length + 1) + " RETURNING *";
    values.push(Number(id));

    const { rows } = await pool.query(query, values);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log(`DELETE user ${id}`);
  try {
    const query = "DELETE FROM users WHERE id = $1 RETURNING *";
    const values = [id];
    const { rows } = await pool.query(query, values);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
