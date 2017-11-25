const route = require("express").Router();
const clienteController = require("../controllers/clienteController");
const rolesMiddleware = require('../middleware/roleMiddleware');

route.post("/clientes", rolesMiddleware(['cadastro', 'administrador']), clienteController.createCliente);
route.get("/clientes", rolesMiddleware(['all']), clienteController.getClientes);
route.get("/clientes/:id", rolesMiddleware(['all']), clienteController.getOneClient);
route.put("/clientes/:id", rolesMiddleware(['cadastro', 'administrador']), clienteController.updateCliente);

route.delete("/clientes/:clienteId/enderecos/:enderecoId", rolesMiddleware(['cadastro', 'administrador']), clienteController.removeEndereco);
route.delete("/clientes/:clienteId/contatos/:contatoId", rolesMiddleware(['cadastro', 'administrador']), clienteController.removeContato);


module.exports = route;