/**
 * PedidoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var messages = require("../globals/index");
var base = require('./BaseController.js')
module.exports = {
  Orders: async function (req, res) {
    if (await base.validator(req, res, "Pedido", "View")) {
      var pedido = await Pedido.find({
        Eliminated: false
      });
      res.status(messages.response.ok).json(pedido)
    }
  },

  createOrder: async function (req, res) {
    if (await base.validator(req, res, "Pedido", "Create")) {
      try {
        if (await base.ElementExist(Estado, req.body.State) &&
          await base.ElementExist(Producto, req.body.Products) &&
          await base.ElementExist(User, req.body.Users) &&
          await base.ElementExist(Cliente, req.body.Clients) &&
          await base.ElementExist(Domicilio, req.body.Adress)) {
          var currentUser = await base.CheckToken(req.headers['access-token']);
          var pedido = await Pedido.create(req.body).fetch()
          sails.log.info("el usuario " + currentUser.Id + "Creo el pedido " + pedido.id)
          res.status(messages.response.ok).json({
            message: "Pedido creado"
          })
        } else {
          sails.log.info("Se quiso crear un pedido con objetos no existentes");
          res.status(messages.response.noFound).json({
            error: "Alguno de los elementos enviados no existe"
          })
        }
      } catch (error) {
        sails.log.error("existio un error para crear el pedido : " + error)
        res.status(400).json({
          error: "error al crear el pedido"
        })
      }
    }
  },

};
