/**
 * GastoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var messages = require("../globals/index");
var base = require('./BaseController.js');
var _validaciones = require('./ValidacionController');

module.exports = {
    expenses: async function (req, res) {
        try {
          let currentUser = await _validaciones.validarRequest(req, 'Gasto', 'View');
          var estado = await Gasto.find({Eliminated: false});
          res.status(200).json(estado)
        } catch (err) {
          console.log(err)
          sails.log.error("error" + JSON.stringify(err))
          res.status(err.code).json(err.message);
        }
    },

    createExpense: async function(req,res){
        try {
          let currentUser = await _validaciones.validarRequest(req, 'Gasto', 'Create');
          var data = req.body;
          sails.log.info(currentUser)
          let fecha =data.Date.split("/")
          sails.log.debug(fecha)

          let date = new Date(fecha[2],fecha[1]-1,fecha[0])
          sails.log.debug(data.Date)
          sails.log.info("se procede a crear un gasto con los siguiente datos"+JSON.stringify(req.body))
          validacion = await _validaciones.validarExistenciaEliminar({ id: data.User, Eliminated: false }, User)
          data.Date = date;
          data.User = currentUser.Id
          sails.log.info(data)
          var gasto = await Gasto.create(data).fetch();
          sails.log.info(gasto);
          res.status(200).json(gasto);
        } catch (err) {
          sails.log.error("error" + JSON.stringify(err))
          res.status(err.code).json(err.message);
        }
    },

    deleteExpense: async function (req, res) {
        if (await base.validator(req, res, "Gasto", "Delete")) {
          var data = req.body;
          try {
            if (data.id) {
              var destruido = await Gasto.update({id: data.id}).set({Eliminated: true}).fetch();
              if (destruido.length === 0) {
                sails.log.info('Se intento borrar el gasto  con id :' + data.id + " pero no existia alguno con ese id");
                res.status(messages.response.noFound).json({
                  error: 'No existe gasto.'
                });
              } else {
                sails.log.info('Se elimino el gasto con id:' + data.id);
                res.status(messages.response.ok).json({
                  message: 'gasto eliminado.'
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
      updateExpense: async function (req,res) {
        try {
          let currentUser = await _validaciones.validarRequest(req, 'Gasto', 'Edit');
          _validaciones.ValidarDatoRequest(req.body.Gasto.Date);
          var data = req.body;
          validacion = await _validaciones.validarExistenciaEliminar({ id: data.User, Eliminated: false }, Gasto)
          sails.log.debug(data)
          let fecha =data.Gasto.Date.split("/")
          data.Gasto.Date = new Date(fecha[2],fecha[1]-1,fecha[0])
          let gasto = await Gasto.update({
            id: req.body.id
          })
          .set(data.Gasto
          ).fetch();
          sails.log.debug("gasto modificado")
          sails.log.debug(gasto)
          res.status(200).json(gasto);
        } catch (err) {
          sails.log.error("error" + JSON.stringify(err))
          res.status(err.code).json(err.message);
        }
      }

};

