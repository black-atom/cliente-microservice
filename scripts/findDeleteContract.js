const Contrato = require("../models/contrato");
const moment = require('moment')

const findDeletedContratoByDate = argv => {
  const { date } = argv
  const momentDate = moment(date)
  const query = {
    deletedAt: {
      $gte: momentDate.startOf('day'), 
      // $lt: momentDate.endOf('day'),
    }
  }

  Contrato.find(query)
    .then(data => console.log(JSON.stringify(data)))
}

const removeDeletedAt = async (argv) => {
  const { id } = argv
  const contrato = await Contrato.findById(id)
  contrato.deletedAt = null
  await contrato.save()
  console.log(JSON.stringify(contrato))
}

require('yargs')
  .command({
    command: 'find <date>',
    desc: 'find delete contracts by date',
    handler: findDeletedContratoByDate
  })
  .command({
    command: 'remove <id>',
    desc: 'find delete contracts by date',
    handler: removeDeletedAt
  })
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .argv