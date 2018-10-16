const route = require("express").Router();
const estoqueController = require("../controllers/estoqueController");
const rolesMiddleware = require('../middleware/roleMiddleware');

route.get("/estoque", rolesMiddleware(['all']), estoqueController.getAllTransactions);
route.get("/estoque/:id", rolesMiddleware(['all']), estoqueController.getEquipamentsToAddSerialNumber);
route.post("/estoque", rolesMiddleware(['all']), estoqueController.saveProductsSerial);
module.exports = route;