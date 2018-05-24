const { equals, difference } = require('ramda');
const Promise = require('bluebird');
const Contrato = require("../models/contrato");

const createContrato = ( req, res, next ) => {
  const contratoNovo = new Contrato(req.body);
  contratoNovo.save()
    .then( contrato => res.json(contrato))
    .catch( error => next(error))
}

const updateContrato =  ( req, res, next ) => {
  const id = req.params.id;

  Contrato.findById(id)
  .then(contrato => {
    const contratoRaw = contrato.toObject();
    const reqBody  = req.body;

    let findPropostaAtivaContrato = contratoRaw.propostas.find(proposta => proposta.ativo)

    let findPropostaAtivaReqBody = reqBody.propostas.find(proposta => proposta.ativo)
    delete findPropostaAtivaReqBody.id;

    let propostaCompare = equals(findPropostaAtivaContrato, findPropostaAtivaReqBody);
    let propostas;

    if(!propostaCompare) {
    const newProposta = { ...findPropostaAtivaReqBody };
    const propostaBefore = {...findPropostaAtivaContrato, ativo: false};
    propostas = [...contratoRaw.propostas.map(p => p.id === propostaBefore.id ? propostaBefore : p), newProposta];
    };

    const contratoCliente = {
      ...contrato,
      propostas
    }

    Contrato.findByIdAndUpdate(id, contratoCliente, { new: true })
      .then( contrato => res.json(contrato))
      .catch( error => next(error) )
  })
  .catch( error => next(error) );

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
