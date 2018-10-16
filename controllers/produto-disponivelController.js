const ProductsAvaiables = require("../models/produto-disponivel");
const Stock = require("../models/estoque");
const Promise = require('bluebird');

const getAllProductsAvailable = ( req, res, next ) => {
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

  const parseBooleanQuery = value => value === true || value === 'true' ? true : false;
  for(key in search){
    let valor;
    if(key === 'createdAt' || key === 'updatedAt') {
      valor = parseDate(search[key]);
    }else if(key === 'available') {
      valor = parseBooleanQuery(search[key])
    } else {
      valor = parseQueryRegExp(search[key]);
    }
    search = {
      ...search,
      [key]: valor
    }
  }
  Promise.all([
    ProductsAvaiables.find(search).sort(sort).skip(skip).limit(limit).exec(),
    ProductsAvaiables.find(search).count().exec()
  ])
  .spread((productsAvaiables, count) => res.json(200, { productsAvaiables, count }))
	.catch(error => next(error));
}

const getProductAvailableByID = async ( req, res, next ) => {
  try {
    const id = req.params.id;
    const productAvaiable = await ProductsAvaiables.findById({ _id: id });
    res.json(productAvaiable);
  } catch (error) { 
    next(error);
  }
}

const updatedProductAvailable = async (req, res, next) => {
  try {
    const _id = req.params.id
    const body = req.body;
    const orderBuyUpdated = await ProductsAvaiables.update(
      { _id }, 
      { 
        $set: { ...body } 
      }
    );
    const findProductAvailable = await ProductsAvaiables.findById({ _id })
    res.json(findProductAvailable);
  }catch (error) { 
    next(error);
  }
}

module.exports = {
  getAllProductsAvailable,
  getProductAvailableByID,
  updatedProductAvailable,
}
