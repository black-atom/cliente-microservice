const {Schema} = require("mongoose");
const timestamps = require('mongoose-timestamp');
const dbConnection = require('../databaseConnection');
const userAudit = require('mongoose-useraudit-plugin');


const enderecoSchema  = new Schema({
    rua               : { type: String, required: [true, "Entre com o nome da rua e numero"] },
    numero            : { type: String, required: [true, "Entre com o numero"]               },
    bairro            : { type: String, required: [true, "Entre com o bairro"]               },
    cidade            : { type: String, required: [true, "Entre com a cidade"]               },
    uf                : { type: String, required: [true, "Entre com os dados do estado"]     },
    cep               : { type: String, required: [true, "Entre com o cep"]                  },
    ponto_referencia  : { type: String, default: ""                                          },
    complemento       : { type: String, default: ""                                          },
  }, 
  { 
    _id: false 
  }
)

const contatoSchema  = new Schema({
  email       : { type: String, required: [true, "Entre com o email!"]    },
  celular     : { type: String, required: [true, "Entre com o celular!"]  },
  telefone    : { type: String, required: [true, "Entre com o telefone!"] },
  nome        : { type: String, required: [true, "Entre com o nome!"]     },
  observacao  : { type: String, default: ""                               },
}, { _id: false })

const clienteSchema = new Schema({
  cnpj_cpf           : { type: String, required: [true, "Entre com o cnpj/cpf do cliente"] },
  nome_razao_social  : { type: String, required: [true, "Entre com o nome  do Cliente"]    },
  nome_fantasia      : { type: String, required: [true, "Entre com o cnpj/cpf do cliente"] },
  inscricao_estadual : { type: String, required: [true, "Entre com o nome  do Cliente"]    },
})

const equipamentoSchema  = new Schema({
  modelo        : { type: String, default: "", required: [true, "Entre com o modelo!"]                 },
  numeroSerie   : { type: String, default: ""                                                          },
  visita        : { type: Boolean, default: false, required: [true, "Entre com informação da visita!"] },
  valor         : { type: Number, default: 0, required: [true, "Entre com valor equipamento!"]         },
  endereco      : enderecoSchema,
})


const propostaSchema  = new Schema({
  descricao      : { type: String, default: ""                                                                          },
  valor          : { type: Number, default: 0, required: [true, "Entre com valor da proposta!"]                      },
  equipamentos   : { type: [equipamentoSchema], required: [true, "Equipamentos são obrigatórios!"]                      },
  criadoEm       : { type: Schema.Types.Date, required: [true, "Entre com a data de encerramento"], default: new Date() },
  encerradoEm    : { type: Schema.Types.Date, default: null       },
  ativo          : { type: Boolean, default: true, required: [true, "Situação da proposta!"]                            },
})


const contratoSchema = new Schema({
  cliente           : clienteSchema,
  endereco          : enderecoSchema,
  contato           : contatoSchema,
  dataAdessao       : { type: Schema.Types.Date, required: [true, "Entre com a data de adessão"], default: new Date() },
  dataEncerramento  : { type: Schema.Types.Date, default: null  },
  valor             : { type: Number, default: 0, required: [true, "Entre com informação da visita!"]                 },
  propostas         : [propostaSchema],
  ativo             : { type: Boolean, default: true, required: [true, "Situação do contrato!"]                       },
})

contratoSchema.plugin(timestamps);
contratoSchema.plugin(userAudit);

module.exports = dbConnection.model("contratos", contratoSchema);