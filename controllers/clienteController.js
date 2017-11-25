const Cliente = require("../models/cliente");
const {defaultTo, prop, clone} = require("ramda");

const createCliente = ( req, res, next ) => {

    const cliente = defaultTo({}, req.body);

    cliente.enderecos = defaultTo([], prop("enderecos", req.body));
    cliente.contatos = defaultTo([], prop("contatos", req.body));

    getClienteByCPNJ(cliente.cnpj_cpf).then(foundCliente =>{
        if(foundCliente===null){
            const clienteInstance = new Cliente(cliente);
            clienteInstance.save()
            .then( c => res.json(c))
            .catch( error => next(error))
        }else{
            const error = new Error("Erro na insercao");
            error.name ="ValidationError";
            error.status = 409;
            next(error);
        }
    }).catch( error => next(error))

}

const getClientes = (req, res, next ) => {

    Cliente.find({}, {_id: 1, cnpj_cpf: 1, nome_razao_social: 1, "contatos.telefone": 1 })
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

const updateCliente =  ( req, res, next ) => {
    const id = prop("id", req.params);
    const clienteData = clone(req.body);

    Cliente.findByIdAndUpdate(id, clienteData, {new: true})
    .then( cliente => res.json(cliente))
    .catch( error => next(error) )

}

const removeEndereco =  ( req, res, next ) => {
    const clienteId = prop("clienteId", req.params);
    const enderecoId = prop("enderecoId", req.params);

    getClienteByID(clienteId)
    .then( cliente => {

        cliente.enderecos.id(enderecoId).remove();
        return cliente.save();

    })
    .then( () => res.send() )
    .catch( error => next(error) )

}

const removeContato =  ( req, res, next ) => {
    const clienteId = prop("clienteId", req.params);
    const contatoID = prop("contatoId", req.params);

    getClienteByID(clienteId)
    .then( cliente => {

        cliente.contatos.id(contatoID).remove();
        return cliente.save();

    })
    .then( () => res.send() )
    .catch( error => next(error) )

}



module.exports = {
    createCliente,
    getClientes,
    getOneClient,
    updateCliente,
    removeEndereco,
    removeContato
}
