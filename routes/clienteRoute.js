const route = require("express").Router();
const clienteController = require("../controllers/clienteController");

route.post("/clientes", clienteController.createCliente);
route.get("/clientes", clienteController.getClientes);
route.get("/clientes/:id", clienteController.getOneClient);


module.exports = route;