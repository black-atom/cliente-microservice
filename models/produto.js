const { Schema } = require("mongoose");
const timestamps = require('mongoose-timestamp');
const dbConnection = require('../databaseConnection');
const userAudit = require('mongoose-useraudit-plugin');

const pecaSchema  = new Schema({
  descricao: { type: String }, 
  valor: { type: Number }, 
})

const produtoSchema = new Schema({
  modelo: { type: String, required: [true, "Entre com modelo do produto"] },
  descricao: { type: String, required: [true, "Entre com modelo do produto"] },
  marca: { type: String, required: [true, "Entre com modelo do produto"] },
  categoria: { type: String, enum: ["acessório","catraca", "relógio", "peça", "software"], required: [true, "Entre com a categoria!"] },
  pecas: [pecaSchema],
  valor: { type: Number, required: [true, "Entre com o valor do produto"], default: 0 },
  imagemURL: { type: String, default: null },
}, { versionKey: false });

produtoSchema.plugin(timestamps);
produtoSchema.plugin(userAudit);

module.exports = dbConnection.model("produtos", produtoSchema);