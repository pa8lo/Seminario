/**
 * PedidoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var messages = require("../globals/index");
var base = require('./BaseController.js')
var _validaciones = require('./ValidacionController');

module.exports = {
  Orders: async function (req, res) {
    if (await base.validator(req, res, "Pedido", "View")) {
      var pedido = await Pedido.find({
        Eliminated: false
      }).populate('State').populate('Products').populate('Users').populate('Clients').populate('Adress').populate('Delivery');
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
          let date = new Date()
          let fecha =  date.getFullYear()+"-"+date.getMonth()+"-"+date.getDay()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
          req.body.Date = fecha
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
  assignDelivery: async function(req,res){
    try {
      const data = req.body;
      let validacion = await _validaciones.validarRequestIdEntidad(data.Delivery.id);
      validacion = await _validaciones.validarRequestIdEntidad(data.Pedido.id);
      let usuario = await User.findOne({id: data.Delivery.id});
      validacion = await _validaciones.ValidarEntidad(usuario,"Delivery");
      let pedido = await Pedido.find({id:data.Pedido.id})
      validacion = await _validaciones.ValidarEntidad(pedido,"Pedido");
      pedido.Delivery = data.Delivery.id;

      let ped = await Pedido.update({ id: pedido.id }).set(pedido).fetch();
      console.log(ped)
      res.status(200).json({  })
    } catch (err) {
      sails.log.error("error" + JSON.stringify(err))
      res.status(err.code).json(err.message);
    }
  }

};
