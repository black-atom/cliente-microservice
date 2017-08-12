const Cliente = require("../models/cliente");
const {defaultTo, prop} = require("ramda");

const createCliente = ( req, res, next ) => {

    const cliente = defaultTo({}, req.body);

    cliente.enderecos = defaultTo([], prop("enderecos", req.body));
    cliente.contatos = defaultTo([], prop("contatos", req.body));

    const clienteInstance = new Cliente(cliente);
    clienteInstance.save()
    .then( c => res.json(c))
    .catch( error => next(error))

}

const getClientes = (req, res, next ) => {
    
    Cliente.find({})
    .then( clientes => res.json(clientes) )
    .catch( error => next(error) )

}

const getClienteByID = (id) =>  Cliente.findById(id);

const getClienteByCPNJ = ( cnpj_cpf ) => Cliente.findOne({ cnpj_cpf: cnpj_cpf});

const getOneClient = ( req, res, next ) => {

    const checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    const id = prop("id", req.params);

    const strategyGetCliente = checkForHexRegExp.test(id) ? getClienteByID(id) : getClienteByCPNJ(id);

    strategyGetCliente.then( cliente => res.json(cliente) )
    .catch( error => next(error) )

}


module.exports = {
    createCliente,
    getClientes,
    getOneClient
}