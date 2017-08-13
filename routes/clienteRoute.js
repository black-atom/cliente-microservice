const route = require("express").Router();
const clienteController = require("../controllers/clienteController");

route.post("/clientes", clienteController.createCliente);
route.get("/clientes", clienteController.getClientes);
route.get("/clientes/:id", clienteController.getOneClient);
route.put("/clientes/:id", clienteController.updateCliente);

route.delete("/clientes/:clienteId/enderecos/:enderecoId", clienteController.removeEndereco);
route.delete("/clientes/:clienteId/contatos/:contatoId", clienteController.removeContato);


module.exports = route;