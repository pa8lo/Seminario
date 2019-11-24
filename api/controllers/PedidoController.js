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
      }).populate('State')
        .populate('ProductosPorPedido')
        .populate('CombosPorPedido')
        .populate('Products')
        .populate('Users')
        .populate('Clients')
        .populate('Adress')
        .populate('Delivery');
      res.status(messages.response.ok).json(pedido)
    }
  },

  createOrder: async function (req, res) {
    if (await base.validator(req, res, "Pedido", "Create")) {
      try {
        if (await base.ElementExist(Estado, req.body.State) &&
          // await base.ElementExist(Producto, req.body.Products) &&
          await base.ElementExist(User, req.body.Users) &&
          await base.ElementExist(Cliente, req.body.Clients) &&
          await base.ElementExist(Domicilio, req.body.Adress)) {
          var currentUser = await base.CheckToken(req.headers['access-token']);
          let date = new Date()
          let fecha =  date.getFullYear()+"-"+date.getMonth()+"-"+date.getDay()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
          req.body.Date = fecha
          let validaciones = await _validaciones.ValidarProductoxPedido(req.body.ProductosPorPedido);
          validaciones = await _validaciones.ValidarComboxPedido(req.body.CombosPorPedido);
          req.body.Products = await DevolverIdsProducto(req.body.ProductosPorPedido);
          req.body.Offers = await DevolverIdsCombos(req.body.CombosPorPedido);
          //TODO validar productos
          req.body.ProductosPorPedido = await CrearProductoPorPedidos(req.body.ProductosPorPedido);
          //TODO validar combos
          //TODO unificar metodos de combos por pedidos y productos por pedidos
          req.body.CombosPorPedido = await CrearCombosPorPedidos(req.body.CombosPorPedido);
          sails.log.info("se va a crear el pedido"+JSON.stringify(req.body))
          var pedido = await Pedido.create(req.body).fetch()
          pedido = await Pedido.find({id:pedido.id}).populate("ProductosPorPedido").populate("CombosPorPedido")
          sails.log.info("el usuario " + currentUser.Id + "Creo el pedido " + pedido.id)
           res.status(messages.response.ok).json({
             pedido
           })
        } else {
          sails.log.info("Se quiso crear un pedido con objetos no existentes");
          res.status(messages.response.noFound).json({
            error: "Alguno de los elementos enviados no existe"
          })
        }
      } catch (err) {
        console.log(err)
        sails.log.error("error" + JSON.stringify(err))
        res.status(err.code).json(err.message);
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
async function  CrearProductoPorPedidos(productosPorPedido){
  sails.log.info("se proceden a crear los productos por pedido"+JSON.stringify(productosPorPedido))
  let idsProductoPorPedido = []
  await Promise.all(productosPorPedido.map(async (productoxpedido) => {
    let idProducto = await ProductosPorPedido
                            .create(productoxpedido)
                            .fetch()
    sails.log.info("se creo el productoxpedido"+JSON.stringify(idProducto))
    idsProductoPorPedido.push(idProducto.id)
  })).then(() =>{
    sails.log.info("Se crearon bien todos los productos por pedido")
  }).catch(err => {
    sails.log.error("se produjo un error al crear el pedido por producto" + JSON.stringify(err))
  })
  sails.log.info("se devielven los id "+idsProductoPorPedido)
  return idsProductoPorPedido
}
async function  CrearCombosPorPedidos(combosporpedido){
  sails.log.info("se proceden a crear los combos  por pedido"+JSON.stringify(combosporpedido))
  let idsCombosPorPedido = []
  await Promise.all(combosporpedido.map(async (comboxpedido) => {
    sails.log.info("se procede a crear el combo por pedido"+JSON.stringify(comboxpedido))
      let Combo = await CombosPorPedido
                            .create(comboxpedido)
                            .fetch()
    sails.log.info("se creo el productoxpedido"+JSON.stringify(Combo))
    idsCombosPorPedido.push(Combo.id)
  })).then(() =>{
    sails.log.info("Se crearon bien todos los combos por pedido")
  }).catch(err => {
    sails.log.error("se produjo un error al crear el combo por pedido" + JSON.stringify(err))
  })
  sails.log.info("se devielven los id "+idsCombosPorPedido)
  return idsCombosPorPedido
}
async function DevolverIdsProducto(productosPorPedido){
  let idsProductos= []
  await Promise.all(productosPorPedido.map(async (productoxpedido) => {
    sails.log.info("se guarda en id "+productoxpedido.Product)  
    idsProductos.push(productoxpedido.Product)
  })).catch(err => 
    sails.log.error("se produjo un error al intentar extraer ids de producto"))
    sails.log.info("se devuelven los id "+idsProductos)  
  return idsProductos
}
async function DevolverIdsCombos(combosporpedido){
  let idsCombos= []
  await Promise.all(combosporpedido.map(async (comboxpedido) => {
    sails.log.info("se guarda en id "+comboxpedido.Offer)  
    idsCombos.push(comboxpedido.Offer)
  })).catch(err => 
    sails.log.error("se produjo un error al intentar extraer ids de combos"))
    sails.log.info("se devuelven los id "+idsCombos)  
  return idsCombos;
}
