const ProductModel = require('../models/produto')
const { getAllProductQuantityByStock } = require('./stock')

const updateProductQuantity = async (productID, quantity, baseStock) => {
  const product = await ProductModel.findById(productID)
  const found = Array.isArray(product.stockInfo)
    ? product.stockInfo.find(item => item.baseStock === baseStock)
    : null

  if (Boolean(found)) {
    found.quantity += quantity
  } else {
    if (!Array.isArray(product.stockInfo)){
      product.stockInfo = []
    }

    product.stockInfo.push({ quantity, baseStock })
  }

  return await product.save()
}

const setProductQuantity = async (productID, stockInfo) => {
  const product = await ProductModel.findByIdAndUpdate(productID, {
    stockInfo,
  }, { new: true })

  return product
}


const setQuantityToAllProducts = async () => {
  try {
    const listProductsAndItsQuantity = await getAllProductQuantityByStock()
    const alreadySet = new Set()

    for(const stockProduct of listProductsAndItsQuantity) {
      if(!alreadySet.has(stockProduct.productID)) {
        const stockInfo = listProductsAndItsQuantity.filter(({ productID }) => productID === stockProduct.productID)
        await setProductQuantity(stockProduct.productID, stockInfo)

        alreadySet.add(stockProduct.productID)
      }
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
