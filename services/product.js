const ProductModel = require('../models/produto')
const { getAllProductQuantity } = require('./stock')

const updateProductQuantity = async (productID, quantity) => {
  const product = await ProductModel.findByIdAndUpdate(productID, {
    $inc: {
      quantity,
    }
  }, { new: true })

  return product
}

const setProductQuantity = async (productID, quantity) => {
  const product = await ProductModel.findByIdAndUpdate(productID, {
    quantity
  }, { new: true })

  return product
}


const setQuantityToAllProducts = async () => {
  try {
    const listProductsAndItsQuantity = await getAllProductQuantity()

    for(const stockProduct of listProductsAndItsQuantity) {
      await setProductQuantity(stockProduct.productID, stockProduct.quantity)
    }

    console.log(`The quantity of the ${listProductsAndItsQuantity.length} was updated!`)
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  setProductQuantity,
  updateProductQuantity,
  setQuantityToAllProducts,
}
