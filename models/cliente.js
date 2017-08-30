const {Schema} = require("mongoose");
const timestamps = require('mongoose-timestamp');
const dbConnection = require('../databaseConnection');
const userAudit = require('mongoose-useraudit-plugin');


const enderecoSchema  = new Schema({
    rua: {type: String, required: [true, "Entre com o nome da rua e numero"]},
    complemento: { type: String, default: "" },
    bairro: {type: String, required: [true, "Entre com o bairro"]},
    cidade: {type: String, required: [true, "Entre com a cidade"]},
    uf: {type: String, required: [true, "Entre com os dados do estado"]},
    ponto_referencia: { type: String, default: "" },
    cep: {type: String, required: [true, "Entre com o cep"]}
})

const contatoSchema  = new Schema({
    email: { type: String, default: "" },
    telefone: {type: String, required: [true, "Entre com o telefone de contato!"]},
    nome: {type: String, required: [true, "Entre com o nome para contato!"]},
    observacao: { type: String, default: "" },
})

const clienteSchema = new Schema({

    cnpj_cpf: {
        type: String, 
        required: [true, "Entre com o cnpj/cpf do cliente"]
    },
    nome_razao_social: {
        type: String, 
        required: [true, "Entre com o nome  do Cliente"]
    },
    inscricao_estadual: { type: String, default: "" },
    enderecos: {
        type:[enderecoSchema],
        required: [true, "Entre com pelo menos um endereco"]
    },
    contatos: {
        type:[contatoSchema],
        required: [true, "Entre com pelo menos um contato"]
    }

}, { versionKey: false });

clienteSchema.plugin(timestamps);
clienteSchema.plugin(userAudit);


module.exports = dbConnection.model("clientes", clienteSchema);