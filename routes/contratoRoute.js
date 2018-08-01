const route = require("express").Router();
const contratoController = require("../controllers/contratoController");
const rolesMiddleware = require('../middleware/roleMiddleware');

route.post("/contratos", rolesMiddleware(['cadastro', 'administrador']), contratoController.createContrato);
route.get("/contratos", rolesMiddleware(['all']), contratoController.getContratos);
route.get("/contratos/summary", rolesMiddleware(['all']), contratoController.averageContratos);
route.get("/contratos/:id", rolesMiddleware(['all']), contratoController.getContrato);
route.put("/contratos/:id", rolesMiddleware(['cadastro', 'administrador']), contratoController.updateContrato);
route.delete("/contratos/:id", rolesMiddleware(['cadastro', 'administrador']), contratoController.deleteContrato);

module.exports = route;