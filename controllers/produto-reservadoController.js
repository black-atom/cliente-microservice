const ProductsAvaiables = require("../models/produto-disponivel");
const ProductReserved = require("../models/produto-reservado");
const StockService = require("../services/stock")

const Promise = require('bluebird');

const createdProductReserved = async (req, res, next) => {
  const productID = req.body._id;
  const productReserved = req.body
  delete productReserved._id;

  const createReserve = async (product) => {
    const reserveInstance = new ProductReserved(product);
    return await reserveInstance.save();
  }

  const updateProductAvailable = async (product) => {
    if(product.serialNumber.length >= 4) {
      await ProductsAvaiables.update(
        { _id: productID }, 
        { $set: { status: product.status } }
      )
    }
    return product
  }
  
  Promise.resolve(productReserved)
    .then(createReserve)
    .then(updateProductAvailable)
    .then(response => res.json(response))
    .catch(error => next(error))

}

const updateProductReserved = (req, res, next) => {
  const _id = req.params.id;
  const body = req.body;

  const updatedProductReserved = async (product) => {
    await ProductReserved.update(
      { _id }, { $set: { status: product.status }}
    );
    return product;
  }
  
  const findProductReserved = async (id) => await ProductReserved.findById(id)
  const updatedProductAvailable = async (product) => {
    await ProductsAvaiables.update(
      { serialNumber: product.serialNumber }, { $set: { status: product.statusProductAvailable }}
    );

    return findProductReserved(_id)
  }
  const checkSerialControl = product => 
   ( product.serialControl && product.status === 'liberado' ||  product.serialControl && product.status === 'estorno')
    ? updatedProductAvailable(product) : findProductReserved(_id);

  const parseStock = product => ({
    description: product.description,
    productID: product.productID, 
    serialControl: product.serialControl,
    quantity: product.status === 'liberado' ? -product.quantity : product.quantity,
    baseStock: product.baseStock, 
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: product.createdBy,
    updatedBy: product.updatedBy,
    originID: product.originID,
    origin: product.origin,
    type: product.status === 'liberado' ? product.type : 'entrada',
  });

  const createTransactionStock = async (product) => await StockService.insertItem(parseStock(product))

  Promise.resolve(body)
    .then(updatedProductReserved)
    .then(checkSerialControl)
    .then(createTransactionStock)
    .then(response => res.json(response))
    .catch(error => next(error))
    res.json({})
}

const getAllProductsReservedByOriginID = async (req, res, next) => {
  try {
    const response = await ProductReserved.find({ originID: req.params.id })
    res.json(response);
  } catch (error) {
    next(error)
  }
}

const getAllDateOut = async (req, res, next) => {
  const query = req.query;
  try {
    const response = await ProductReserved.find(query)
    res.json(response);
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createdProductReserved,
  getAllProductsReservedByOriginID,
  updateProductReserved,
  getAllDateOut
}
