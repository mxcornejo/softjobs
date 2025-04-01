const express = require("express");
const router = express.Router();
const {
  registrarUsuario,
  loginUsuario,
  obtenerUsuario,
} = require("../controllers/usuariosController");
const verificarToken = require("../middlewares/auth");

router.post("/usuarios", registrarUsuario);
router.post("/login", loginUsuario);
router.get("/usuarios", verificarToken, obtenerUsuario);

module.exports = router;
