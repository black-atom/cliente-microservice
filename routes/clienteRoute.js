const route = require("express").Router();
const clienteController = require("../controllers/clienteController");

route.post("/clientes", clienteController.createCliente);
route.get("/clientes", clienteController.getClientes);


module.exports = route;