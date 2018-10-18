const MercadoLivre = require("../models/orderMercadoLivre");
const {defaultTo, prop, clone} = require("ramda");
const Promise = require('bluebird');

const getAllMercadoLivre = async (req, res, next) => {
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
    MercadoLivre.find(search).sort(sort).skip(skip).limit(limit).exec(),
    MercadoLivre.find(search).count().exec()
  ])
  .spread((mercadoLivreOrders, count) => res.json(200, { mercadoLivreOrders, count }))
	.catch(error => next(error));
} 

const createMercadoLivre = async ( req, res, next ) => {
  const orderMercadoLivre = defaultTo({}, req.body);
  try {
    const response = await MercadoLivre.create(orderMercadoLivre)
    res.json(response)
  } catch (error) {
    next(error)
  }
}


const getByIDMercadoLivre = async ( req, res, next ) => {
  try {
    const response = await MercadoLivre.findById(req.params.id)
    res.json(response)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createMercadoLivre,
  getAllMercadoLivre,
  getByIDMercadoLivre
}
