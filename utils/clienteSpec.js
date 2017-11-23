const { prop, applySpec } = require('ramda');

const removeMask = value => {
  return value.replace(/\D+/g, '');
};

const removeMaskProp = propName => objeto => {
  return removeMask(prop(propName, objeto));
};

const propContato = propName => objeto => 
prop(propName, objeto).map(applySpec(contatosSpec));

const propEndereco = propName => objeto => 
prop(propName, objeto).map(applySpec(enderecosSpec));

const clienteSpec = {
  cnpj_cpf: removeMaskProp('cnpj_cpf'),
  inscricao_estadual: removeMaskProp('inscricao_estadual'),
  nome_razao_social: prop('nome_razao_social'),
  nome_fantasia: prop('nome_fantasia'),
  contatos: propContato('contatos'),
  enderecos: propEndereco('enderecos'),
  createdBy: prop('createdBy'),
  updatedBy: prop('updatedBy')
};
const contatosSpec = {
  telefone: removeMaskProp('telefone'),
  celular: removeMaskProp('celular'),
  nome: prop('nome'),
  observacao: prop('observacao'),
  email: prop('email')
};
const enderecosSpec = {
  cep: removeMaskProp('cep'),
  rua: prop('rua'),
  numero: prop('numero'),
  bairro: prop('bairro'),
  cidade: prop('cidade'),
  uf: prop('uf'),
  ponto_referencia: prop('ponto_referencia'),
  complemento: prop('complemento')
};

module.exports = applySpec(clienteSpec);
