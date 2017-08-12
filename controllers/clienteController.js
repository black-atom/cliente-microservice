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

module.exports = {
    createCliente,
    getClientes
}