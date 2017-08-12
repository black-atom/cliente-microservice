const route = require("express").Router();
const clienteController = require("../controllers/clienteController");

route.post("/clientes", clienteController.createCliente);

module.exports = route;