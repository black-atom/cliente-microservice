const { Schema } = require("mongoose");
const timestamps = require('mongoose-timestamp');
const dbConnection = require('../databaseConnection');
const userAudit = require('mongoose-useraudit-plugin');

const productSchema = new Schema({
  description: { type: String, required: [true, "Entre com a descricao do produto"] },
  serialNumber: { type: String },
  quantity: { type: Number, required: [true, "Entre com a auqntidade"] },
  buyPrice: { type: Number, required: [true, "Entre com o preço de compra"] },
  tarifMercadoLivre: { type: Number, required: [true, "Entre com a tarifa do mercado livre"] },
  deliveryPrice: { type: Number, required: [true, "Entre com o frete"] },
  sellPrice: { type: Number, required: [true, "Entre com preco de venda"] }
});

const mercadoLivreSchema = new Schema({
  dateSell: { type: String, required: [true, "Entre com a data de venda"] },
  documentID: { type: String },
  customerName: { type: String, required: [true, "Entre com o nome do cliente"] },
  nf: { type: Boolean, default: false, required: [true, "Entre com o nf"] },
  status: { type: String, enum: ["aberto", "finalizado", "cancelado"], default: "aberto", required: [true, "Entre com o status"] },
  productsSell: {
    type:[productSchema],
    required: [true, "Entre com pelo menos um produto"]
  }
}, { versionKey: false });

mercadoLivreSchema.plugin(timestamps);
mercadoLivreSchema.plugin(userAudit);

module.exports = dbConnection.model("mercadolivre", mercadoLivreSchema);