/**
 * EstadoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var messages = require("../globals/index");
var base = require('./BaseController.js');
var _validaciones = require('./ValidacionController');
module.exports = {
    states: async function (req, res) {
    if (await base.validator(req, res, "Pedido", "View")) {
      var estado = await Estado.find({Eliminated: false});
      res.json(estado)
    }
  },

  createState: async function (req, res) {
    try {
      let estadoRequest = req.body
      let currentUser = await _validaciones.validarRequest(req, "Pedido", "Create");
      let validacion = await _validaciones.ValidarEstado(estadoRequest)
      var estado = await Estado.create(estadoRequest).fetch()
      sails.log.info("el usuario " + currentUser.Id + "Creo el estado " + estado.id)
      res.status(messages.response.ok).json(
        estado
      )
    } catch (err) {
      console.log(err)
      sails.log.error("error" + JSON.stringify(err))
      res.status(err.code).json(err.message);
    }
  },

  deleteState: async function (req, res) {
    if (await base.validator(req, res, "Pedido", "Delete")) {
      var data = req.body;
      try {
        if (data.id) {
          let estado =await Estado.findOne(data.id);
          let validaciones = await _validaciones.ValidarEditarEliminarEstado(estado);    
          var destruido = await Estado.update({id: data.id}).set({Eliminated: true}).fetch();
          if (destruido.length === 0) {
            sails.log.info('Se intento borrar el estado  con id :' + data.id + " pero no existia alguno con ese id");
            res.status(messages.response.noFound).json({
              error: 'No existe estado.'
            });
          } else {
            sails.log.info('Se elimino el estado con id:' + data.id);
            res.status(messages.response.ok).json({
              message: 'estado eliminado.'
            });
          }
        } else {
          sails.log.info("el usuario No ingreso el id para eliminar");
          res.status(messages.response.wrongSintexis).json({
            error: 'Faltan ingresar parametros'
          });
        }
      } catch (error) {
        sails.log.error('Existio un problema al eliminar el estado' + error);
        return res.status(messages.response.serverError).json({
          error: 'Existio un problema al eliminar el estado :' + error
        });
      }
    }
  },

  updateState: async function (req, res) {
    try {
      let data = req.body;
      sails.log.debug(data)
      let estado =await Estado.findOne(data.estado.id);
      let validaciones = await _validaciones.ValidarEditarEliminarEstado(estado);
      validaciones =await  _validaciones.ValidarEditarEliminarEstado(data.Estado);

      let currentUser = await _validaciones.validarRequest(req, 'Pedido', 'Edit');
      var estado = await Estado.update({
        id: data.Estado.id
      })
      .set(data.Estado).fetch();
      res.status(200).json(estado)
    } catch (err) {
      console.log(err)
      sails.log.error("error" + JSON.stringify(err))
      res.status(err.code).json(err.message);
    }
  },

  seeOrders: async function(req,res){
    if (await base.validator(req, res, "Producto", "View")) {
      sails.log.info("[[ESTADOCONTROLLER.SEEORDERS]] se busco los pedidos con el estado  :"+ req.body.key);
      var estado = await Estado.find( {Eliminated:false, Key:req.body.key}).populate('Orders');
      res.status(messages.response.ok).json(estado)
    }
  }


};

