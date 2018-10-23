const {Schema} = require("mongoose");
const timestamps = require('mongoose-timestamp');
const dbConnection = require('../databaseConnection');
const userAudit = require('mongoose-useraudit-plugin');

const produtoSchema  = new Schema({
    description: {type: String, required: [true, "Entre com o nome do produto"], uppercase: true },
    productID: {type: String, required: [true, "Entre com o id do produto"]},
    quantity: {type: Number, default: 1 },
    serialControl: {type: Boolean, required: [true, "Entre com o controle de Serial do produto"]},
    baseStock: {type: String, required: [true, "Entre com a base do estoque para o produto"]},
})

const orderCompraSchema = new Schema({
    description: { type: String, default: "", required: [true, "Entre com a descrição da compra"], uppercase: true },
    buyID: { type: String, default: "", required: [true, "Entre com o id da compra"]},
    reason: { type: String, default: "", uppercase: true },
    status: { type: String, default: "finalizado", uppercase: true },
    baseStock: {type: String, required: [true, "Entre com a base do estoque para a compra"], uppercase: true },
    products: {
        type:[produtoSchema],
        required: [true, "Entre com pelo menos um produto"]
    }

}, { versionKey: false });

orderCompraSchema.plugin(timestamps);
orderCompraSchema.plugin(userAudit);

module.exports = dbConnection.model("orderCompras", orderCompraSchema);