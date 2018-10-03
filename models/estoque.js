const {Schema} = require("mongoose");
const timestamps = require('mongoose-timestamp');
const dbConnection = require('../databaseConnection');
const userAudit = require('mongoose-useraudit-plugin');

const stockSchema = new Schema({
    type: { type: String, enum: ["entrada", "saida"], default: "compra", required: [true, "Entre com o tipo de evento"] },
    product: { type: String, default: "", required: [true, "Entre a descrição do produto"] },
    productID: { type: String, default: "", required: [true, "Entre a descricao o id do produto"] },
    quantity: { type: Number, default: 1, required: [true, "Entre a quantidade do produto"] },
    originID: { type: String, default: "", required: [true, "Entre com o id da origin"]},
    origin: { type: String, enum: ["compra", "atendimento"], default: "compra", required: [true, "Entre com a origem do evento"]},
}, { versionKey: false });

stockSchema.plugin(timestamps);
stockSchema.plugin(userAudit);

module.exports = dbConnection.model("estoque", stockSchema);