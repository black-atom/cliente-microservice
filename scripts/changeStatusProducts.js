const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test')

const ProductAvailable = mongoose.model('produtosdisponiveis')

ProductAvailable.updateMany(
  { status: 'pre-reservado'},
  { $set: { status : 'disponivel' } }
).then(res => console.log(res))
.catch(err => console.error(err))