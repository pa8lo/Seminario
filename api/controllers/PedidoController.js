/**
 * PedidoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var messages = require("../globals/index");
var base = require('./BaseController.js');
var _validaciones = require('./ValidacionController');
var _comboController = require('./ComboController');

module.exports = {
  Orders: async function (req, res) {
    try {
      let currentUser = await _validaciones.validarRequest(req, 'Pedido', 'View');
      var pedidos = await Pedido.find({
        Eliminated: false,
      }).populate('State')
        .populate('ProductosPorPedido')
        .populate('CombosPorPedido')
        .populate('Products')
        .populate('Users')
        .populate('Clients')
        .populate('Adress')
        .populate('Delivery')
        .then(function(pedidos) {
          return sails.nestedPop(pedidos, {
            CombosPorPedido: [
                  'Offer'
              ],
            ProductosPorPedido: [
                  'Product'
            ]  
          }).then(function(users) {
              return users
          }).catch(function(err) {
              throw err;
          });
      }).catch(function(err) {
          throw err;
      })
      sails.log.debug(pedidos)
      let data = req.allParams();
      let respuesta =data.Validado || data.Validado == 'N' ? pedidos.filter(pedido => pedido.Adress.Validado == false) :pedidos.filter(pedido => pedido.Adress.Validado == true)
      sails.log.info("pedidos luego del filtro por validado")
      sails.log.debug(respuesta)
      res.status(messages.response.ok).json(respuesta)
    } catch (err) {
      console.log(err)
      sails.log.error("error" + JSON.stringify(err))
      res.status(err.code).json(err.message);
    }
  },
  OrdersByDelivery: async function (req,res){
    try{
      sails.log.info("se inicia la busqueda de los pedidos para el delivery")
      var data = req.allParams();
      let currentUser = await _validaciones.validarRequest(req, 'Pedido', 'View');
      sails.log.info("se busco este usuario"+JSON.stringify(currentUser))
      let estadoEntregado = await Estado.findOne({Key:'E'})
      let estadoFinalizado = await Estado.findOne({Key:'R'})
      let pedidos = await Pedido.find({Delivery:currentUser.Id,State:{'!=':[estadoEntregado.id,estadoFinalizado.id]}})
      .populate('Adress')
      .populate('Clients')
      .populate('Users')
      .populate('State')
      sails.log.info("se devuelven los pedidos"+JSON.stringify(pedidos))
      res.status(200).json(pedidos)
    }catch(err){
      console.log(err)
      sails.log.error("error" + JSON.stringify(err))
      res.status(err.code).json(err);
    }
  },
  createOrder: async function (req, res) {
      try {
        if (await base.ElementExist(Estado, req.body.State) &&
          await base.ElementExist(User, req.body.Users) &&
          await base.ElementExist(Cliente, req.body.Clients) &&
          await base.ElementExist(Domicilio, req.body.Adress)) {
          let currentUser = await _validaciones.validarRequest(req, 'Pedido', 'View');
          let date = new Date()
          let fecha =  date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDay()+1)+" "+(date.getUTCHours()-3)+":"+date.getUTCMinutes()+":"+date.getUTCSeconds()
          sails.log.info(fecha)
          req.body.Date = fecha
          sails.log.info(req.body.Date)
          let validaciones = await _validaciones.ValidarProductoxPedido(req.body.ProductosPorPedido);
          validaciones = await _validaciones.ValidarComboxPedido(req.body.CombosPorPedido);
          if(req.body.ProductosPorPedido){
            req.body.Products = await DevolverIdsProducto(req.body.ProductosPorPedido);
            req.body.ProductosPorPedido = await CrearProductoPorPedidos(req.body.ProductosPorPedido);
          }
          if(req.body.CombosPorPedido){
            req.body.Offers = await DevolverIdsCombos(req.body.CombosPorPedido);
            req.body.CombosPorPedido = await CrearCombosPorPedidos(req.body.CombosPorPedido);
          }
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
  },
  assignDelivery: async function(req,res){
    try {
      //Todo agregar seguridad
      const data = req.body;
      sails.log.info("Se procede a validar parametros")
      let validacion = await _validaciones.validarRequestIdEntidad(data.Delivery.id);
      validacion = await _validaciones.validarRequestIdEntidad(data.Pedido.id);
      sails.log.info("Se procede a buscar delivery")
      let usuario = await User.findOne({id: data.Delivery.id});
      sails.log.info("se encontro el delivery con el id "+usuario.id)
      validacion = await _validaciones.ValidarEntidad(usuario,"Delivery");
      let pedido = await Pedido.find({id:data.Pedido.id})
      console.log(pedido)
      validacion = await _validaciones.ValidarEntidad(pedido,"Pedido");
      sails.log.info("se procede a asignar el delivery al pedido")
      // pedido.Delivery = data.Delivery.id;
      sails.log.info(pedido)
      console.log(pedido)
      let ped = await Pedido.update({id:data.Pedido.id}).set({Delivery:data.Delivery.id}).fetch();
      console.log(ped)
      res.status(200).json(ped)
    } catch (err) {
      sails.log.error("error" + JSON.stringify(err))
      res.status(err.code).json(err.message);
    }
  },
  DeletePedido: async function (req, res) {
    try {
      let currentUser = await _validaciones.validarRequest(req, 'Pedido', 'Delete');
      var data = req.body;
      let validacion = await _validaciones.validarRequestIdEntidad(data.id);
      var destruido = await Pedido.update({ id: data.id }).set({ Eliminated: true }).fetch();
      validacion = _validaciones.ValidarEntidad(destruido, "Usuario");
      res.status(200).json({ message: ' Pedido eliminado' });
    } catch (err) {
      sails.log.error("error" + JSON.stringify(err))
      res.status(err.code).json(err.message);
    }
  },
  UpdatePedido: async function (req, res){
    try {
      let currentUser = await _validaciones.validarRequest(req, 'Pedido', 'Edit');
      // ValidarEstadoDePedido(req.Estado);
      let validaciones = await _validaciones.ValidarProductoxPedido(req.body.ProductosPorPedido);
      validaciones = await _validaciones.ValidarComboxPedido(req.body.CombosPorPedido);
      if(req.body.ProductosPorPedido){
        req.body.Products = await DevolverIdsProducto(req.body.ProductosPorPedido);
        req.body.ProductosPorPedido = await CrearProductoPorPedidos(req.body.ProductosPorPedido);
      }else{
        req.body.ProductosPorPedido = []
      }
      if(req.body.CombosPorPedido){
        req.body.Offers = await DevolverIdsCombos(req.body.CombosPorPedido);
        req.body.CombosPorPedido = await CrearCombosPorPedidos(req.body.CombosPorPedido);
      }else{
        req.body.CombosPorPedido =[]
      }
      let date = new Date()
      let fecha =  date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDay()+1)+" "+(date.getUTCHours()-3)+":"+date.getUTCMinutes()+":"+date.getUTCSeconds()
      sails.log.info(fecha)
      req.body.Date = fecha
      sails.log.info("se procede a actualizar el pedido")
      let pedido = await Pedido.update({
        id: req.body.id
      })
      .set(req.body
      ).fetch();
      sails.log.info(pedido)
      res.status(200).json(pedido)
    } catch (error) {
      sails.log.error(error)
      res.status(500).json(error)
    }
  },
  ChangeState: async function(req, res){
    try {
      let data = req.body
      let currentUser = await _validaciones.validarRequest(req, 'Pedido', 'Edit');
      var ExisteEstado = await Estado.findOne({id:data.State.id})
      _validaciones.ValidarEntidad(ExisteEstado)
      var pedido = await Pedido.update({id:data.Pedido.id}).set({State:ExisteEstado.id}).fetch()
      res.status(200).json(pedido)
    } catch (err) {
      console.log(err)
      sails.log.error("error" + JSON.stringify(err))
      res.status(err.code).json(err.message);
    }
  },
  PedidoEntregadoDelivery: async function(req,res){
    try {
      let data = req.body
      var ExisteEstado = await Estado.findOne({Key:'E'})
      sails.log.info("se va a actualizar el estado:")
      sails.log.info(ExisteEstado)
      _validaciones.ValidarEntidad(ExisteEstado)
      var pedido = await Pedido.update({id:data.id}).set({State:ExisteEstado.id}).fetch()
      sails.log.info("se entrego el pedido : ")
      sails.log.info(pedido)
      res.status(200).json(pedido)
    } catch (err) {
      console.log(err)
      sails.log.error("error" + JSON.stringify(err))
      res.status(err.code).json(err.message);
    }
  },
  PedidoRechazadoDelivery: async function(req,res){
    try {
      let data = req.body
      var ExisteEstado = await Estado.findOne({Key:'R'})
      sails.log.info("se va a actualizar el pedido con el id :" +data.id)
      _validaciones.ValidarEntidad(ExisteEstado)
      var pedido = await Pedido.update({id:data.id}).set({State:ExisteEstado.id}).fetch()
      res.status(200).json(pedido)
    } catch (err) {
      console.log(err)
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

