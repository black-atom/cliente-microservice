const route = require("express").Router();
const produtoController = require("../controllers/produtoController");
const rolesMiddleware = require('../middleware/roleMiddleware');
const productStorageConfig = require('../config/uploadProductImageConfig')();
const getUploadHandler = require('../helpers/getFileUploadHandler');

route.post("/produtos", rolesMiddleware(['cadastro', 'administrador']), produtoController.createProduto);
route.get("/produtos", rolesMiddleware(['all']), produtoController.getProdutos);
route.get("/produtos/:id", rolesMiddleware(['all']), produtoController.getProduto);
route.put("/produtos/:id", rolesMiddleware(['cadastro', 'administrador']), produtoController.updateProduto);
route.post("/produtos/:id/imagem", getUploadHandler(productStorageConfig), produtoController.uploadImagemProduto)

module.exports = route;