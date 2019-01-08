/**
 * GastoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var messages = require("../globals/index");
var base = require('./BaseController.js')
module.exports = {
    expenses: async function (req, res) {
        if (await base.validator(req, res, "Gasto", "View")) {
          var estado = await Gasto.find({Eliminated: false});
          res.json(estado)
        }
    },

    createExpense: async function(req,res){
        if (await base.validator(req, res, "Gasto", "View")) {
            try {
                var currentUser =await base.CheckToken(req.headers['access-token']);
                var gasto = await Gasto.create(req.body).fetch()
                sails.log.info("el usuario " + currentUser.Id + "Creo el estado " + gasto.id)
                res.status(messages.response.ok).json({
                  message: "gasto creado"
                })
              } catch (error) {
                sails.log.error("existio un error para crear el gasto : " + error)
                res.status(400).json({
                  error: "error al crear el gasto"
                })
              }

        }
    },

    deleteExpense: async function (req, res) {
        if (await base.validator(req, res, "Producto", "Delete")) {
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
          base.updateElement(req,res,"Gasto","Edit",Gasto,req.body.id,req.body.Gasto);
        }

};

