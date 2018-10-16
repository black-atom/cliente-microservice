const Stock = require("../models/estoque");
const OrderBuy = require("../models/orderCompra");
const ProductsAvailables = require("../models/produto-disponivel");
const Promise = require('bluebird');

const getAllTransactions = async (req, res, next) => {
	const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  const skip = req.query.skip ? parseInt(req.query.skip) : 0;
  const sort = { createdAt: -1 };
  let search = req.query.search ? JSON.parse(req.query.search) : {};
  
  const parseQueryRegExp = valor => new RegExp(''+ valor +'', 'i');

  const parseDate = date => {
    const momentDate = moment(new Date(date))
    return ({
      $gte: momentDate.startOf('day').toISOString(),
      $lte: momentDate.endOf('day').toISOString()
    })
  }

  for(key in search){
    let valor;
    if(key === 'createdAt' || key === 'updatedAt') {
      valor = parseDate(search[key]);
    }else {
      valor = parseQueryRegExp(search[key]);
    }
    search = {
      ...search,
      [key]: valor
    }
  }
  Promise.all([
    Stock.find(search).sort(sort).skip(skip).limit(limit).exec(),
    Stock.find(search).count().exec()
  ])
  .spread((stockTransactions, count) => res.json(200, { stockTransactions, count }))
	.catch(error => next(error));
} 

const saveProductsSerial = async (req, res, next) => {
	const dateNow = new Date()

	const parseProductSerial = product => ({
		...product,
		createdBy: req.body.createdBy,
		updatedBy: req.body.updatedBy,
		createdAt: dateNow,
		updatedAt: dateNow
	})


	const cadastrarDisponiveis = async products => { 
		const serialNumbers =  products.map(product => product.serialNumber);
		const findSerialNumber = await ProductsAvailables.find({ serialNumber: { $in: serialNumbers } })
		if(findSerialNumber.length > 0) {
			throw new Error('número serial duplicado')
		}
		return await ProductsAvailables.insertMany(products)
	};

	const formatToStock = products => products.reduce((previous, item) => {
		if (previous[item.productID]) {
			const product = previous[item.productID]
			previous[item.productID] = {...product, quantity: product.quantity + 1 }
		} else {
			previous[item.productID] = {
				type: 'entrada',
				origin: 'compra',
				description: item.description,
				serialControl: item.serialControl,
				productID: item.productID,
				originID: item.originID,
				baseStock:  item.baseStock,
				createdBy: req.body.createdBy,
				updatedBy: req.body.updatedBy,
				createdAt: dateNow,
				updatedAt: dateNow,
				quantity: 1 
			}
		}
		return previous
	}, {})
	
	
	const productsObjectToProductsArray = stockProducts => {
		const stockProductArray = []
		for(let i in stockProducts){
			stockProductArray.push(stockProducts[i])
		}
		return stockProductArray
	}

	const inserirProductsEstoque = async products => await Stock.insertMany(products);

	const checkProductsStockAndProductsOrder = async (productsCreatedStock) => {
		const _id = productsCreatedStock[0].originID;
		const findProductsOrder = await OrderBuy.findById({ _id })
		const findProductsStock = await Stock.find({ originID: _id })
		const countProductsStock = findProductsStock.reduce((curr, prev) => curr + prev.quantity,0)
		const countProductsOrder = findProductsOrder.products.reduce((curr, prev) => curr + prev.quantity,0)

		if(countProductsOrder === countProductsStock) {
			await OrderBuy.update({ _id }, { $set: { status: 'finalizado' } })
			const findOrderUpdated = await OrderBuy.findById({ _id })
			return findOrderUpdated
		}
		return findProductsOrder;
	}

	Promise.resolve(req.body.productsAvailables)
		.map(parseProductSerial)
		.then(cadastrarDisponiveis)
		.then(formatToStock)
		.then(productsObjectToProductsArray)
		.then(inserirProductsEstoque)
		.then(checkProductsStockAndProductsOrder)
		.then(response => res.json(response))
		.catch(error => next(error))
}

const getEquipamentsToAddSerialNumber = (req, res, next) => {
	const { id } = req.params

	const findOrderUpdated = async (_id) => await OrderBuy.findOne({ _id })
	const parseArrayMongoToStringfy = orderBuy => JSON.parse(JSON.stringify(orderBuy))

	const checkProducts = async (orderBuy) => {

		let productsAddSerialNumber = [];
		const products = orderBuy.products;
		const productsStock = await Stock.find({ originID: id })

		const productsAvailable = products
		.filter(product => product.serialControl)
		.map(product => {

			const findProductStockByID = productsStock.filter(
				productStock => productStock.productID === product.productID
			)

			const productModify = {
				description: product.description,
				productID: product.productID,
				serialNumber: '',
				available: true,
				buyID: orderBuy.buyID,
				baseStock: product.baseStock,
				origin: 'compra',
				originID: id,
				quantity: product.quantity,
				type: 'entrada'
			 };

			 
			 if(findProductStockByID.length > 0) {				 
				 const quantityProductStock = findProductStockByID.reduce((prev, curr) => prev + curr.quantity, 0)
				 const currStock = productModify.quantity - quantityProductStock;
				return {...productModify, quantity: currStock };
			}
			
			return productModify

		})

		for(let i = 0; i < productsAvailable.length; i++) {

			for(let quantity = 0; quantity < productsAvailable[i].quantity; quantity++) {
				productsAddSerialNumber.push({...productsAvailable[i], quantity: 1 })
			}

		}

		if(orderBuy.status === 'ABERTO') {
			return {...orderBuy, products: productsAddSerialNumber }
		}
		return {...orderBuy, products: [] }
	}

	Promise.resolve(id)
		.then(findOrderUpdated)
		.then(parseArrayMongoToStringfy)
		.then(checkProducts)
		.then(products => res.json(products))
}

module.exports = {
	getAllTransactions,
	saveProductsSerial,
	getEquipamentsToAddSerialNumber
}
