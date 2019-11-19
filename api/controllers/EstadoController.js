/**
 * EstadoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var messages = require("../globals/index");
var base = require('./BaseController.js')
module.exports = {
    states: async function (req, res) {
    if (await base.validator(req, res, "Pedido", "View")) {
      var estado = await Estado.find({Eliminated: false});
      res.json(estado)
    }
  },

  createState: async function (req, res) {
    if (await base.validator(req, res, "Pedido", "Create")) {
      try {
        var currentUser =await base.CheckToken(req.headers['access-token']);
        var estado = await Estado.create(req.body).fetch()
        sails.log.info("el usuario " + currentUser.Id + "Creo el estado " + estado.id)
        res.status(messages.response.created).json(
          estado
        )
      } catch (error) {
        sails.log.error("existio un error para crear el estado : " + error)
        res.status(400).json({
          error: "error al crear el Estado"
        })
      }
    }
  },

  deleteState: async function (req, res) {
    if (await base.validator(req, res, "Producto", "Delete")) {
      var data = req.body;
      try {
        if (data.id) {
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
    if (await base.validator(req, res, "Producto", "View")) {
        var data = req.body
        if (data.Estado.id) {
            var estado = await Estado.update({
                id: data.Estado.id
              })
              .set(data.Estado).fetch();
            if (estado.length === 0) {
              sails.log.info('Se intento modificar el estado con id :' + estado.id + " pero no existia alguno con ese id");
              res.status(messages.response.noFound).json({
                error: 'No existe estado.'
              });
            } else {
              sails.log.info('Se modifico el estado con id :' + estado.id);
              res.status(messages.response.ok).json({
                message: 'Estado modificada.'
              });
            }
          } else {
            sails.log.info("el usuario " + currentUser.Id + "No ingreso el id ");
            res.status(messages.response.wrongSintexis).json({
              error: 'Faltan ingresar parametros'
            });
          }
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

