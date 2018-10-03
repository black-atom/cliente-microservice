const route = require("express").Router();
const estoqueController = require("../controllers/estoqueController");
const rolesMiddleware = require('../middleware/roleMiddleware');

route.get("/estoque", rolesMiddleware(['all']), estoqueController.getAllTransactions);

module.exports = route;