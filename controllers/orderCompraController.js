const OrderCompra = require("../models/orderCompra");
const Promise = require('bluebird');
const moment = require('moment');

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
    }else {
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

const createOrderBuy = async( req, res, next ) => {
  try {
    const orderBuy = req.body;
    const orderBuyInstance = new OrderCompra(orderBuy);
    const orderCreated = await orderBuyInstance.save();
    res.json(orderBuy);
  } catch (error) {
    next(error);
  }  
}

const updatedOrderBuy = async( req, res, next ) => {
  try {
    const _id = req.params.id
    const reason = req.body.reason;
    const orderBuyUpdated = await OrderCompra.update(
      { _id }, 
      { 
        $set: { 
          reason: reason, 
          status: 'cancelado'
        } 
      }
  );
    res.json({});
  } catch (error) {
    next(error);
  }  
}

module.exports = {
  getOrderBuy,
  getOneOrderBuy,
  createOrderBuy,
  updatedOrderBuy,
}
