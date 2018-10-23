const Promise = require('bluebird');
const moment = require('moment');
const AvailableProducts = require('../models/produto-disponivel');
const OrderCompra = require("../models/orderCompra");
const StockService = require("../services/stock");

const getOrderBuy = ( req, res, next ) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  const skip = req.query.skip ? parseInt(req.query.skip) : 0;
  const sort = { createdAt: -1 };
  let search = req.query.search ? JSON.parse(req.query.search) : {};
  
  const parseQueryRegExp = valor => new RegExp(''+ valor +'', 'i');

  const parseDate = date => {
    const momentDate = moment(new Date(date))
    return ({
      $gte: momentDate.startOf('day').toISOString(),
      $lte: momentDate.endOf('day').toISOString()
    })
  }

  for(key in search){
    let valor;
    if(key === 'createdAt' || key === 'updatedAt') {
      valor = parseDate(search[key]);
    }else if(key === '_id' || key === 'originID' || key === 'productID') {
      valor = search[key];
    }
    else {
      valor = parseQueryRegExp(search[key]);
    }
    search = {
      ...search,
      [key]: valor
    }
  }
  Promise.all([
    OrderCompra.find(search).sort(sort).skip(skip).limit(limit).exec(),
    OrderCompra.find(search).count().exec()
  ])
  .spread((orderBuys, count) => res.json(200, { orderBuys, count }))
  .catch(error => next(error));
}

const getOneOrderBuy = async ( req, res, next ) => {
  try {
    const id = req.params.id;
    const findOrderBuy = await OrderCompra.findById({ _id: id });
    res.json(findOrderBuy);
  } catch (error) {
    next(error)
  }
}

const createOrderBuy = ( req, res, next ) => {

  const dateNow = new Date();
  const orderBuyFinished = async (orderBuy) => await OrderCompra.create(orderBuy);
  const orderBuyWaitingFinish = async (orderBuy) => await OrderCompra.create({...orderBuy, status: 'aberto' });
  const checkSerialControl = ({ products }) => products.find(product => product.serialControl);

  const createdOrderBuy = orderBuy => checkSerialControl(orderBuy)
    ? orderBuyWaitingFinish(orderBuy) : orderBuyFinished(orderBuy) 

  const parseStock = orderBuyCreated => 
  orderBuyCreated.products
    .filter(product => !product.serialControl)
    .map(product => ({
      description: product.description,
      productID: product.productID, 
      serialControl: product.serialControl,
      quantity: product.quantity, 
      baseStock: product.baseStock, 
      createdAt: dateNow,
      updatedAt: dateNow,
      createdBy: orderBuyCreated.createdBy,
      updatedBy: orderBuyCreated.updatedBy,
      originID: orderBuyCreated._id,
      origin: 'compra',
      type: 'entrada',
    }));

  Promise.resolve(req.body)
    .then(createdOrderBuy)
    .then(parseStock)
    .map(StockService.insertItem)
    .then(response => res.json(response))
    .catch(error => next(error))
}

const updatedOrderBuy = async( req, res, next ) => {
  const dateNow = new Date();

  const _id = req.params.id
  const orderBody = req.body;  

  const updatedOrder = async (_id) => 
    await OrderCompra.findOneAndUpdate(
      { _id }, 
      { 
        $set: { ...orderBody, status: 'cancelado' } 
      }, 
      { new: true } 
    )

  const removeProducstAvailable = async(orderBuy) => {
    try {
      await AvailableProducts.deleteMany({ originID: _id })
      return orderBuy.products
    } catch (error) {
      return error
    }
  }

  const findOrderUpdated = async (checkOut) => await OrderCompra.findById({ _id: checkOut[0].originID })

  const parseStockCheckOut = product => ({
    description: product.description,
    productID: product.productID, 
    quantity: -product.quantity, 
    baseStock: product.baseStock, 
    createdAt: dateNow,
    createdBy: req.body.createdBy,
    updatedAt: dateNow,
    updatedBy: req.body.updatedBy,
    originID: _id,
    origin: 'compra',
    type: 'saida',
  })

  Promise.resolve(_id)
    .then(updatedOrder)
    .then(removeProducstAvailable)
    .map(parseStockCheckOut)
    .map(StockService.insertItem)
    .then(findOrderUpdated)
    .then(response => res.json(response))
    .catch(error => next(error))
}

module.exports = {
  getOrderBuy,
  getOneOrderBuy,
  createOrderBuy,
  updatedOrderBuy,
}
