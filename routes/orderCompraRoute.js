const route = require("express").Router();
const orderBuyController = require("../controllers/orderCompraController");
const rolesMiddleware = require('../middleware/roleMiddleware');

route.post("/order-compras", rolesMiddleware(['all']), orderBuyController.createOrderBuy);
route.get("/order-compras", rolesMiddleware(['all']), orderBuyController.getOrderBuy);
route.put("/order-compras/:id", rolesMiddleware(['all']), orderBuyController.updatedOrderBuy);
route.get("/order-compras/:id", rolesMiddleware(['all']), orderBuyController.getOneOrderBuy);

module.exports = route;
