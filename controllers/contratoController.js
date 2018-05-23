const Contrato = require("../models/contrato");
const Promise = require('bluebird');

const createContrato = ( req, res, next ) => {
  const contratoNovo = new Contrato(req.body);
  contratoNovo.save()
    .then( contrato => res.json(contrato))
    .catch( error => next(error))
}

const updateContrato =  ( req, res, next ) => {
  const id = req.params.id;
  const contratoData = req.body;

  Contrato.findByIdAndUpdate(id, contratoData, { new: true })
  .then( contrato => res.json(contrato))
  .catch( error => next(error) )

}

const getContrato = ( req, res, next ) => {
  const id = req.params.id;
  Contrato.findById(id)
    .then( contrato => res.json(contrato) )
    .catch( error => next(error) )

}

const getContratos = (req, res, next ) => {

  const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  const skip = req.query.skip ? parseInt(req.query.skip) : 0;
  const sort = req.query.sort ? parseInt(req.query.sort) : { createdAt: -1 };
  const resultContrato = {
    _id: 1, 
    'cliente.cnpj_cpf': 1, 
    'cliente.nome_razao_social': 1, 
    ativo: 1,
    dataAdessao: 1,
    dataEncerramento: 1,
  };

  let search = req.query.search ? JSON.parse(req.query.search) : {};

  const parseQueryRegExp = valor => new RegExp(''+ valor +'', 'i');

    for(prop in search) {
      let valor = search[prop];
      if(prop.indexOf('data') > - 1 !== true){
        valor = parseQueryRegExp(valor);
      }
      search = {
        ...search,
        [prop]: valor
      }
    }
    Promise.all([
      Contrato.find(search, resultContrato).sort(sort).skip(skip).limit(limit).exec(),
      Contrato.find(search).count().exec()
    ])
    .spread((contratos, count) => res.json(200, { contratos, count }))
    .catch(error => next(error));
}

module.exports = {
  createContrato,
  updateContrato,
  getContratos,
  getContrato,
}
