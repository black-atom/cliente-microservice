const Produto = require("../models/produto");
const {defaultTo, prop, clone} = require("ramda");
const Promise = require('bluebird');

const createProduto = ( req, res, next ) => {
  const produto = new Produto(req.body);
  produto.save()
    .then( c => res.json(c))
    .catch( error => next(error))
}


const getProdutos = (req, res, next ) => {

  const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  const skip = req.query.skip ? parseInt(req.query.skip) : 0;
  const sort = { createdAt: -1 };
  let search = req.query.search ? JSON.parse(req.query.search) : {};
  
  const parseQueryRegExp = valor => new RegExp(''+ valor +'', 'i');
  for(key in search){
    let valor =  new RegExp(''+ search[key] +'', "i");
    search = {
      ...search,
      [key]: valor
    }
  }
    Promise.all([
      Produto.find(search).sort(sort).skip(skip).limit(limit).exec(),
      Produto.find(search).count().exec()
    ])
    .spread((produtos, count) => res.json(200, { produtos, count }))
    .catch(error => next(error));
}


const getProduto = ( req, res, next ) => {
  const id = req.params.id;
  Produto.findById(id)
    .then( produto => res.json(produto) )
    .catch( error => next(error) )
}

const updateProduto =  ( req, res, next ) => {
  const id = req.params.id;
  Produto.findByIdAndUpdate(id, req.body, { new: true })
    .then( produto => res.json(produto))
    .catch( error => next(error) )
}

module.exports = {
  createProduto,
  getProdutos,
  getProduto,
  updateProduto,
}
