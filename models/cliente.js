const {Schema} = require("mongoose");
const timestamps = require('mongoose-timestamp');

const enderecoSchema  = new Schema({
    rua: {type: String, required: [true, "Entre com o nome da rua e numero"]},
    complemento: { type: String, default: "" },
    bairro: {type: String, required: [true, "Entre com o bairro"]},
    cidade: {type: String, required: [true, "Entre com a cidade"]},
    estado: {type: String, required: [true, "Entre com os dados do estado"]},
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

    razao_social: {
        type: String,
        default: ""
    },
    cnpj_cpf: {
        type: String, 
        required: [true, "Entre com o cnpj/cpf do cliente"]
    },
    nome: {
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


module.exports = db.model("clientes", clienteSchema);