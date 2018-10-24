const StockModel = require('../models/estoque')
const { updateProductQuantity } = require('./product')

/**
 * Returns the quantity of a given product id and the baseStock
 * @param {} id the product id
 * @param {} baseStock  name of the stock
 * @returns 10
 */
const getProductQuantityById = async ( id, baseStock ) => {
  const [{ quantity = 0 } = {}] = await StockModel.aggregate([
    {
      $match: {
        productID: id,
        baseStock,
      }
    },
    {
      $group: {
        _id: "$productID",
        quantity: { $sum: "$quantity" },
      }
    },
    {
      $project: {
        _id: 0,
        productID: "$_id",
        quantity: 1,
      }
    }
  ])

  return quantity
}

/**
 * Returns the quantity of each product 
 * @param {} id 
 * @returns [{ quantity: 19, productID: '5bc8866910fbcd000141da0d', baseStock: 'realponto' }]
 */
const getAllProductQuantityByStock = async () => {
  const list = await StockModel.aggregate([
    {
      $group: {
        _id: { productID: "$productID", baseStock: "$baseStock" },
        quantity: { $sum: "$quantity" }
      }
    },
    {
      $project: {
        _id: 0,
        productID: "$_id.productID",
        baseStock: "$_id.baseStock",
        quantity: 1
      }
    }
  ])

  return list
}

/**
 * 
 * @param {Object} {
    description,
    productID, 
    quantity, 
    baseStock 
    originID,
    origin,
    type,
  }
 */
const insertItem = async (stockItem) => {
  const savedStockItem = await StockModel.create(stockItem)
  await updateProductQuantity(stockItem.productID, stockItem.quantity, stockItem.baseStock)

  return savedStockItem
}

module.exports = {
  getProductQuantityById,
  getAllProductQuantityByStock,
  insertItem,
}
