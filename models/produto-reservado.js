const { Schema } = require("mongoose");
const timestamps = require('mongoose-timestamp');
const dbConnection = require('../databaseConnection');
const userAudit = require('mongoose-useraudit-plugin');

const produtoSchema = new Schema({
  type: { type: String, enum: ["entrada", "saida"], required: [true, "Entre com o tipo de evento"] },
  description: { type: String, default: "", required: [true, "Entre a descrição do produto"] },
  productID: { type: String, default: "", required: [true, "Entre a descricao o id do produto"] },
  quantity: { type: Number, default: 1, required: [true, "Entre a quantidade do produto"] },
  originID: { type: String, default: "", required: [true, "Entre com o id da origin"]},
  serialNumber: { type: String, default: ""},
  serialControl: { type: Boolean, default: true },
  baseStock:  { type: String, default: "", required: [true, "Entre com o base do estoque da compra"]},
  dateOut:  { type: String, default: "", required: [true, "Entre com o base do estoque da compra"]},
  origin: { type: String, enum: ["mercado livre", "atendimento"], required: [true, "Entre com a origem do evento"]},
  status: { 
    type: String, 
    enum: [
      "reservado",
      "separado",
      "liberado",
      "estorno",
      "cancelado",
      "técnico perdeu o item",
      "técnico quebrou o item"
    ], 
    required: [true, "Entre com a origem do evento"]
  },
}, { versionKey: false });

produtoSchema.plugin(timestamps);
produtoSchema.plugin(userAudit);

module.exports = dbConnection.model("produtosreservados", produtoSchema);