/**
 * ClienteController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var base = require('./BaseController.js')
var _validaciones = require('./ValidacionController');
module.exports = {
  
    CreateClient :async function (req,res) {
            try {
                let currentUser = await _validaciones.validarRequest(req, 'Cliente', 'Create');
                var data = req.body;
                sails.log.info(currentUser)
                let validacion = await _validaciones.validarExistencia({ Phone: data.Phone, Eliminated: false }, Cliente)
                var cliente = await Cliente.create(data).fetch();
                res.status(200).json({UserId: cliente.id}) 
              } catch (err) {
                sails.log.error("error" + JSON.stringify(err))
                res.status(err.code).json(err.message);
              }
        },
    
    AddAddress : async function (req,res){
        try {
            let currentUser = await _validaciones.validarRequest(req, 'Cliente', 'Create');
            var  data = req.body;
            sails.log.info("[[clienteController-addAddress]] se procede a crear el domicilio");
            if(data.Address.User || data.Address.Client){
                var domicilio  = await Domicilio.create(data.Address).fetch();
                sails.log.info("[[clienteController-addAddress]] Domicilio creado con exito");   
                res.status(200).json(domicilio )
            }else{
                res.status(400).json({error:" la dirección debe estar asociada a un cliente o usuario"})
            }
          } catch (err) {
            console.log(err)
            sails.log.error("error" + JSON.stringify(err))
            res.status(err.code).json(err.message);
          }
    },
    DeleteAddress : async function (req,res){
        try {
            let currentUser = await _validaciones.validarRequest(req, 'Cliente', 'Edit');
            let  data = req.body;
            let domicilio =await  Domicilio.destroyOne({id: data.id});
            if(domicilio){
                res.status(200).json(domicilio);
            }else{
                res.status(404).json({message:"no existe la dirección que desea eliminar"})
            }
        } catch (err) {
            console.log(err)
            sails.log.error("error" + JSON.stringify(err))
            res.status(err.code).json(err.message);
        }
    },    

    Clients : async function (req,res) {
        try {
            let currentUser = await _validaciones.validarRequest(req, 'Usuario', 'View');
            let clientes = await Cliente.find({Eliminated: false}).populate('Adress');
            let validaciones  =await _validaciones.ValidarEntidad(clientes,"cliente");
            res.json(clientes)
        } catch (err) {
            console.log(err)
            sails.log.error("error" + JSON.stringify(err))
            res.status(err.code).json(err.message);
          }
            

        },
        Client : async function (req,res){
            var data = req.allParams();
            sails.log.info(req.allParams())
            sails.log.info("llega la siguiente información en request:")
            sails.log.info(data)
            if(req.headers['access-token']){ 
                var currentUser = base.CheckToken(req.headers['access-token']);
                    if(currentUser){
                        if(true){
                        var cliente =await Cliente.findOne({Phone: data.Phone}).populate('Adress');   
                        res.status(200).json({Cliente:cliente})             
                        }
                    }
                }else{
                    return res.status(401).json({erros : 'Medidas de seguridad no ingresadas.'})
                }
        },

        UpdateClient: async function (req,res) {
            try {
                let currentUser = await _validaciones.validarRequest(req, 'Cliente', 'Edit');
                _validaciones.validarExistenciaEliminar({ id: req.body.id, Eliminated: false }, Cliente)
                let cliente = await Cliente.update({
                  id: req.body.id
                })
                .set(req.body
                ).fetch();
                sails.log.info(cliente)
                res.status(200).json(cliente)
              } catch (error) {
                sails.log.error(error)
                res.status(error.code).json(error.message)
              }
        },
        DeleteClient: async function (req,res) {
            try {
                let currentUser = await _validaciones.validarRequest(req, 'Cliente', 'Delete');
                _validaciones.validarExistenciaEliminar({ id: req.body.id, Eliminated: false }, Cliente)
                var destruido = await Cliente.update({id:data.id})
                                .set({Eliminated:true}).fetch();    
                sails.log.info(cliente)
                res.status(200).json(destruido)
              } catch (error) {
                sails.log.error(error)
                res.status(error.code).json(error.message)
              }
        }
};

