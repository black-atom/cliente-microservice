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
  const novoContrato  = req.body;

  const findContratoByID = id => Contrato.findById(id)

  const updateContrato = contrato => {
    const findPropostaAtivaContrato = contrato.propostas.find(proposta => proposta.ativo)
    const findPropostaAtivaReqBody = novoContrato.propostas.find(proposta => proposta.ativo)
    const propostaCompare = equals(findPropostaAtivaContrato, findPropostaAtivaReqBody);

    if(!propostaCompare) {
      contrato.propostas = contrato.propostas.map(proposta => {
        if(proposta.id === findPropostaAtivaReqBody._id){
          proposta.ativo = false;
          return proposta
        }
        return proposta
      })
    };

    delete findPropostaAtivaReqBody._id;
    contrato.valor = findPropostaAtivaReqBody.valor;
    contrato.propostas.push(findPropostaAtivaReqBody);

    return contrato.save({ new: true })
  }

  const areContatosEqual = contrato => {
    let contratoRaw = JSON.parse(JSON.stringify(contrato));
    const areContratosEqual = equals(contratoRaw, novoContrato);

    return areContratosEqual ? contratoRaw : updateContrato(contrato)
  }

  const sendContrato = contrato => res.json(contrato)

  Promise.resolve(id)
    .then(findContratoByID)
    .then(areContatosEqual)
    .then(sendContrato)
    .catch( error => next(error));

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
  const sort = { numeroContrato: -1 };
  const resultContrato = {
    _id: 1,
    'cliente.cnpj_cpf': 1,
    'cliente.nome_razao_social': 1,
    ativo: 1,
    dataAdesao: 1,
    numeroContrato: 1,
    dataEncerramento: 1,
    valor: 1,
    tipo: 1,
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
