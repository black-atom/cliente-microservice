const Stock = require("../models/estoque");

const getAllTransactions = async (req, res, next) => {
	try {
		const stockTransactions = await Stock.find();
		res.json({ stockTransactions, count: stockTransactions.length })
	} catch (error) {
		next(error);
	}
} 

module.exports = {
	getAllTransactions
}
