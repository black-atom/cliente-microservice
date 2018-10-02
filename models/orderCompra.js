const {Schema} = require("mongoose");
const timestamps = require('mongoose-timestamp');
const dbConnection = require('../databaseConnection');
const userAudit = require('mongoose-useraudit-plugin');

const produtoSchema  = new Schema({
    description: {type: String, required: [true, "Entre com o nome do produto"]},
    idProduct: {type: String, required: [true, "Entre com o id do produto"]},
    quantity: { type: Number, default: 1 },
})

const orderCompraSchema = new Schema({
    description: { type: String, default: "", required: [true, "Entre com a descrição da compra"]},
    idBuy: { type: String, default: "", required: [true, "Entre com o id da compra"]},
    reason: { type: String, default: "" },
    status: { type: String, default: "finalizado" },
    products: {
        type:[produtoSchema],
        required: [true, "Entre com pelo menos um produto"]
    }

}, { versionKey: false });

orderCompraSchema.plugin(timestamps);
orderCompraSchema.plugin(userAudit);

module.exports = dbConnection.model("orderCompras", orderCompraSchema);