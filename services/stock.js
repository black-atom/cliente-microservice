const StockModel = require('../models/estoque')
const { updateProductQuantity } = require('./product')

/**
 * Returns the quantity of a given product id
 * @param {} id 
 * @returns 10
 */
const getProductQuantityById = async ( id ) => {
  const [{ quantity }] = await StockModel.aggregate([
    {
      $match: {
        productID: id,
      }
    },
    {
      $group: {
        _id: "$productID",
        quantity: { $sum: "$quantity" }
      }
    },
    {
      $project: {
        _id: 0,
        productID: "$_id",
        quantity: 1
      }
    }
  ])

  return quantity
}

/**
 * Returns the quantity of each product 
 * @param {} id 
 * @returns [{ quantity: 19, productID: '5bc8866910fbcd000141da0d' }]
 */
const getAllProductQuantity = async () => {
  const list = await StockModel.aggregate([
    {
      $group: {
        _id: "$productID",
        quantity: { $sum: "$quantity" }
      }
    },
    {
      $project: {
        _id: 0,
        productID: "$_id",
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
  await updateProductQuantity(stockItem.productID, stockItem.quantity)

  return savedStockItem
}

module.exports = {
  getProductQuantityById,
  getAllProductQuantity,
  insertItem,
}
