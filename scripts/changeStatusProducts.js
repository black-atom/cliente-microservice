const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test')
const ProductsAvailables = require("../models/produto-disponivel");

ProductsAvailables.updateMany(
  { status: 'pre-reservado'},
  { $set: { status : 'disponivel' } }
).then(res => console.log(res))
.catch(err => console.error(err))