const route = require("express").Router();
const mercadoLivreController = require("../controllers/mercadoLivreControle");
const rolesMiddleware = require('../middleware/roleMiddleware');

route.post("/mercado-livre", rolesMiddleware(['cadastro', 'administrador']), mercadoLivreController.createMercadoLivre);
route.get("/mercado-livre", rolesMiddleware(['cadastro', 'administrador']), mercadoLivreController.getAllMercadoLivre);
route.get("/mercado-livre/:id", rolesMiddleware(['all']), mercadoLivreController.getByIDMercadoLivre);

module.exports = route;