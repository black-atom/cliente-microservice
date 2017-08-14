const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const should = chai.should();
const {clienteNew, clienteUpdate} = require("./payload/cliente.json");
const clientes  = require("../models/cliente");

chai.use(chaiHttp);

const createCliente = () => clientes.create(clienteNew);

describe('Teste do endpoint cliente', () => {
    before((done) => {
        clientes.remove({})
        .then( () =>{
            done();
        } )     
    });

    describe('/api/clientes', () => {

        it('Should get a list of clientes', (done) => {

            chai
                .request(server)
                .get('/api/clientes')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });

        })


        it('Should add a new Cliente', (done) => {

            chai
                .request(server)
                .post('/api/clientes')
                .send(clienteNew)
                .end((err, res) => {
                    res.should.have.status(200);
                    //res.body.should.be.a('array');
                    done();
                });
                
        })

        it('Should  get a Cliente by its ID', (done) => {


            chai
                .request(server)
                .get('/api/clientes/'+clienteNew.cnpj_cpf)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
                
        })

        // it('Should  delete a Cliente`s address by its ID', (done) => {

        //     chai
        //         .request(server)
        //         .del('/api/clientes/1/enderecos/1')
        //         .end((err, res) => {
        //             res.should.have.status(200);
        //             done();
        //         });
                
        // })

    })
})
