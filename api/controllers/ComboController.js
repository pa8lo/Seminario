/**
 * ComboController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var base = require('./BaseController.js');
var _validaciones = require('./ValidacionController');

module.exports = {
  Offert : async function (req,res){
    try{
      var data = req.allParams();
      let currentUser = await _validaciones.validarRequest(req,'Producto','View');
      let validacion = await _validaciones.validarRequestIdEntidad(data.id);
      var combo = await Combo.findOne({id: data.id, Eliminated:false}).populate('ProductosPorCombos');
      sails.log.info("se encontro el combo")
      sails.log.info(combo)
      validacion = await _validaciones.ValidarEntidad(combo,"Combo")
      let respuesta = await AgregarProductosACombo(combo.ProductosPorCombo)
      res.status(200).json(combo)
    }catch(err){
      sails.log.error("error" + JSON.stringify(err))
      res.status(err.code).json(err.message);
    }
  },
  Offerts: async function (req, res) {
    try{
      let currentUser = await _validaciones.validarRequest(req,'Producto','View');
      var combo = await Combo.find({Eliminated : false})
      .populate('ProductosPorCombo')
      let respuesta = await AgregarDatosProductos(combo)
      res.status(200).json(combo)
    }catch(err){
      sails.log.error("error" + JSON.stringify(err))
      res.status(err.code).json(err.message);
    }
  },
  createOffert: async function (req, res) {
    try {
      let currentUser = await _validaciones.validarRequest(req, 'Producto', 'Create');
      let validacion = await _validaciones.ValidarProductoxPedido(req.body.Combo.ProductosPorCombo)
      req.body.Combo.ProductosPorCombo = await CrearProductoPorCombos(req.body.Combo.ProductosPorCombo);
      var combo = await Combo.create(req.body.Combo).fetch()
      sails.log.info("Se creo el combo con el id "+combo.id)
      sails.log.info("el usuario " + currentUser.Id + "Creo el combo " + combo.id)
     combo = await Combo.find({id:combo.id}).populate('ProductosPorCombo')
      res.status(200).json(combo)
    } catch (err) {
      console.log(err)
      sails.log.error("error" + JSON.stringify(err))
      res.status(err.code).json(err.message);
    }
  },

  deleteOffert: async function (req, res) {
    try {
      let currentUser = await _validaciones.validarRequest(req, 'Producto', 'Delete');
      _validaciones.validarExistenciaEliminar({ id: req.body.id, Eliminated: false }, Combo)
      let data = req.body;
      var destruido = await Combo.update({id:data.id})
                      .set({Eliminated:true}).fetch();    
      sails.log.info(destruido)
      res.status(200).json(destruido)
    } catch (error) {
      sails.log.error(error)
      res.status(error.code).json(error.message)
    }
  },
  updateOffert: async function (req, res) {
    try {
      let data = req.body;
      let currentUser = await _validaciones.validarRequest(req, 'Producto', 'Edit');
      _validaciones.ValidarDatoRequest(data.Combo.ProductosPorCombo)
      _validaciones.validarRequestIdEntidad(data.Combo.id)
      let validacion = await _validaciones.ValidarProductoxPedido(data.Combo.ProductosPorCombo)
      data.Combo.ProductosPorCombo = await CrearProductoPorCombos(data.Combo.ProductosPorCombo);
      var combo = await Combo.update({
        id: data.Combo.id
      })
      .set({Name:data.Combo.Name,
        Description :data.Combo.Description,
        Amount : data.Combo.Amount,
        ProductosPorCombo : data.Combo.ProductosPorCombo
      }).fetch();
      res.status(200).json(combo)
    } catch (err) {
      console.log(err)
      sails.log.error("error" + JSON.stringify(err))
      res.status(err.code).json(err.message);
    }
  },

  addProducts: async function (req, res) {
    if (req.headers['access-token']) {
      var data = req.body;
      var currentUser = base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        if (await base.CheckAuthorization(currentUser, 'Producto', 'Edit', req.ip, res)) {
          if (data.Combo.id) {
            var combo = await Combo.create(data.Combo).fetch()
            await data.Produts.forEach(async product => {
              await Combo.addToCollection(product.id, "Offers")
                .members(combo.id);
            });
          } else {
            sails.log.info("el usuario " + currentUser.Id + "No ingreso el id ");
            res.status(401).json({
              error: 'Faltan ingresar parametros'
            });
          }

        } else {
          sails.log.info("el usuario " + currentUser.Id + "quiso acceder a un lugar sin permisos");
          res.status(401).json({
            error: 'Acceso denegado.'
          });
        }
      }

    } else {
      return res.status(401).json({
        erros: 'Medidas de seguridad no ingresadas.'
      })
    }
  },
  removeProducts: async function (req, res) {
    if (req.headers['access-token']) {
        var data = req.body;
        var currentUser = base.CheckToken(req.headers['access-token']);
        if (currentUser) {
          if (await base.CheckAuthorization(currentUser, 'Producto', 'Edit', req.ip, res)) {
            if (data.Combo.id) {
                await Combo.removeFromCollection(data.combo.id, "Products")
                .members(data.product.id);
            } else {
                sails.log.info("el usuario " + currentUser.Id + "No ingreso el id ");
                res.status(401).json({
                  error: 'Faltan ingresar parametros'
                });
              }
    
            } else {
              sails.log.info("el usuario " + currentUser.Id + "quiso acceder a un lugar sin permisos");
              res.status(401).json({
                error: 'Acceso denegado.'
              });
            }
          }
    
        } else {
          return res.status(401).json({
            erros: 'Medidas de seguridad no ingresadas.'
          })
        }
  },
  CompletarDatosProductosPedido: async function(pedidos){
    sails.log.debug(pedidos)
    if(pedidos){
      await Promise.all(pedidos.map(async (pedido) =>{
        await AgregarDatosProductos(pedidos.CombosPorPedido)
      })).catch(err => 
        sails.log.error("se produjo un error al intentar extraer ids de producto"))
        sails.log.info("información agregada")
      
    }
  }
};
async function AgregarProductosACombo(productosPorCombo){
  sails.log.info("se procede a agregar Productos a combos")
  sails.log.info(productosPorCombo);
  await Promise.all(productosPorCombo.map(async (productoporcombo) => {
    let producto = await Producto.findOne({id: productoporcombo.Product})
    sails.log.info("se encontro el siguiente producto")
    sails.log.info(producto.id)
    productoporcombo.Product = producto
    sails.log.info("se agrego el siguiente producto")
    sails.log.info(productoporcombo)
  }))
  sails.log.info(productosPorCombo);
  return productosPorCombo;
}
async function AgregarDatosProductos(combo){
  sails.log.info("se procede a agregar información de los productos")
  sails.log.info(combo)
  await Promise.all(combo.map(async (c) =>{
    await AgregarProductosACombo(c.ProductosPorCombo);
  })).then(()=> {
    sails.log.info("información agregada")
    sails.log.info(combo)  
    return combo
  }
)
    
}

async function  CrearProductoPorCombos(productosPorCombos){
  sails.log.info("se proceden a crear los productos por combo"+JSON.stringify(productosPorCombos))
  let idsProductoPorCombo = []
  await Promise.all(productosPorCombos.map(async (productoxcombo) => {
    let idProducto = await ProductosPorCombos
                            .create(productoxcombo)
                            .fetch()
    sails.log.info("se creo el productoxcombo"+JSON.stringify(idProducto))
    idsProductoPorCombo.push(idProducto.id)
  })).then(() =>{
    sails.log.info("Se crearon bien todos los productos por pedido")
  }).catch(err => {
    sails.log.error("se produjo un error al crear el pedido por producto" + JSON.stringify(err))
  })
  sails.log.info("se devielven los id "+idsProductoPorCombo)
  return idsProductoPorCombo
}
