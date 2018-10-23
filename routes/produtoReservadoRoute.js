const route = require("express").Router();
const produtoReservadoController = require("../controllers/produto-reservadoController");
const rolesMiddleware = require('../middleware/roleMiddleware');

route.get("/produtos-reservados", rolesMiddleware(['all']), produtoReservadoController.getAllDateOut);
route.post("/produtos-reservados", rolesMiddleware(['all']), produtoReservadoController.createdProductReserved);
route.get("/produtos-reservados/:id", rolesMiddleware(['all']), produtoReservadoController.getAllProductsReservedByOriginID);
route.put("/produtos-reservados/:id", rolesMiddleware(['all']), produtoReservadoController.updateProductReserved);

module.exports = route;