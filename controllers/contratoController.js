const { equals } = require('ramda');
const Promise = require('bluebird');
const Contrato = require("../models/contrato");

const createContrato = ( req, res, next ) => {
  const contratoNovo = new Contrato(req.body);
  contratoNovo.save()
    .then( contrato => res.json(contrato))
    .catch( error => next(error))
}

const deleteContrato = ( req, res, next ) => {
  const id = req.params.id;

  Contrato.findById(id)
    .then(contrato => {
      contrato.deletedAt = new Date();
      return contrato.save()
    })
    .then(() => res.send(true))
    .catch( error => next(error) )
}

const updateContrato = (contratoAntigo, novoContrato) => {
  const propostaAtivaDoContratoAntigo = contratoAntigo.propostas.find(proposta => proposta.ativo)
  const propostaNova = novoContrato.propostas.find(proposta => proposta.ativo)

  const propostaCompare = equals(propostaAtivaDoContratoAntigo, propostaNova);

  if (!propostaCompare) {
    contratoAntigo.propostas = contratoAntigo.propostas.map(proposta => {
      if (proposta.id === propostaNova._id) {
        proposta.encerradoEm = new Date();
        proposta.ativo = false;
        proposta.descricao = propostaNova.descricao;
        return proposta
      }
      return proposta
    })

    delete  propostaNova.descricao;
  };

  delete propostaNova._id;
  contratoAntigo.propostas.push(propostaNova);

  contratoAntigo.cnpjAssociados = novoContrato.cnpjAssociados || contratoAntigo.cnpjAssociados;
  contratoAntigo.contato = novoContrato.contato || contratoAntigo.contato;
  contratoAntigo.numeroContrato = novoContrato.numeroContrato || contratoAntigo.numeroContrato;
  contratoAntigo.resumoContrato = novoContrato.resumoContrato || contratoAntigo.resumoContrato;
  contratoAntigo.diaVencimento = novoContrato.diaVencimento || contratoAntigo.diaVencimento;
  contratoAntigo.subsequente = novoContrato.subsequente;
  contratoAntigo.tipo = novoContrato.tipo || contratoAntigo.tipo;
  contratoAntigo.dataAdesao = novoContrato.dataAdesao || contratoAntigo.dataAdesao;
  contratoAntigo.dataEncerramento = novoContrato.dataEncerramento || contratoAntigo.dataEncerramento;
  contratoAntigo.valor = novoContrato.valor || contratoAntigo.valor;
  contratoAntigo.ativo = novoContrato.ativo;

  return contratoAntigo.save({ new: true })
}

const updateContratoReq =  ( req, res, next ) => {
  const id = req.params.id;
  const novoContrato  = req.body;

  const findContratoByID = id => Contrato.findById(id)

  const areContatosEqual = contrato => {
    let contratoRaw = JSON.parse(JSON.stringify(contrato));
    const areContratosEqual = equals(contratoRaw, novoContrato);

    return areContratosEqual ? contratoRaw : updateContrato(contrato, novoContrato)
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

  if(!search.hasOwnProperty('deletedAt')) {
    search.deletedAt = null
  }

  Promise.all([
    Contrato.find(search, resultContrato).sort(sort).skip(skip).limit(limit).exec(),
    Contrato.find(search).count().exec()
  ])
  .spread((contratos, count) => res.json(200, { contratos, count }))
  .catch(error => next(error));
}

const averageContratos = async(req, res, next) => {
  try {
    const {
      ativo: ativoQuery,
      dateFrom,
      dateTo,
    } = req.query;
    
    const ativo = ativoQuery === 'true' ? true : false
  
    const match = (dateFrom && dateTo)
      ? { ativo, deletedAt: null, dataAdesao: { $gte: dateFrom, $lt: dateTo }}
      : { ativo, deletedAt: null };
  
    const summaryQuery = await Contrato.aggregate([
      {
        $match: match
      },
      {
        $group: {
          _id: null,
          maxValue: { $max: '$valor' },
          minValue: { $min: '$valor' },
          count: { $sum: 1 },
          total: { $sum: '$valor' },
        }
      },
      {
        $project: {
          _id: 0,
          maxValue: 1,
          minValue: 1,
          total: 1,
          count: 1,
          total: 1,
        }
      }
    ])
    
    const [ summary = {
      maxValue: 0,
      minValue: 0,
      total: 0,
      count: 0,
      total: 0,
    }] = summaryQuery;

    res.json(summary)
  } catch(error){
    next(error)
  }
}



module.exports = {
  averageContratos,
  createContrato,
  updateContrato: updateContratoReq,
  getContratos,
  getContrato,
  deleteContrato,
}
