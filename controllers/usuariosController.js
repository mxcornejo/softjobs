const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registrarUsuario = async (req, res) => {
  try {
    const { email, password, rol, lenguage } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)",
      [email, passwordHash, rol, lenguage]
    );
    res.status(201).json({ message: "Usuario registrado" });
  } catch (err) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

const obtenerUsuario = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      req.email,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener datos del usuario" });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  obtenerUsuario,
};
