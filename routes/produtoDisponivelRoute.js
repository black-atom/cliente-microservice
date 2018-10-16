const route = require("express").Router();
const produtoDisponivelController = require("../controllers/produto-disponivelController");
const rolesMiddleware = require('../middleware/roleMiddleware');

route.get("/produtos-disponiveis", rolesMiddleware(['all']), produtoDisponivelController.getAllProductsAvailable);
route.get("/produtos-disponiveis/:id", rolesMiddleware(['all']), produtoDisponivelController.getProductAvailableByID);
route.put("/produtos-disponiveis/:id", rolesMiddleware(['all']), produtoDisponivelController.updatedProductAvailable);

module.exports = route;