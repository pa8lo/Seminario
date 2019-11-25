/**
 * ComboController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var base = require('./BaseController.js')
module.exports = {
  Offerts: async function (req, res) {
    if (req.headers['access-token']) {
      var currentUser = await base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        try {
          if (await base.CheckAuthorization(currentUser, 'Producto', 'View', req.ip, res)) {
            var combo = await Combo.find({Eliminated : false}).populate('ProductosPorCombo');
            let respuesta = await AgregarDatosProductos(combo)
            res.status(200).json(respuesta)
          } else {
            res.status(401).json({
              error: "Acceso denegado"
            })
          }
        } catch (error) {
          sails.log.error(error)
          res.status(401).json({
            error: "Acceso denegado"
          })
        }
      } else {
        return res.status(401).json({
          error: 'Acceso denegado.'
        });
      }
    } else {
      return res.status(401).json({
        error: 'Medidas de seguridad no ingresadas.'
      });
    }
  },
  createOffert: async function (req, res) {
    if (req.headers['access-token']) {
      var currentUser = await base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        try {
          if (await base.CheckAuthorization(currentUser, 'Producto', 'Create', req.ip, res)) {
            try {
              var data = req.body
              // var producto = await Producto.find({id: data.Products})
              // sails.log.info("productos encontrados"+producto.length);
              // sails.log.info("productos encontrados"+data.Products);
              if(true){
                req.body.Combo.ProductosPorCombo = await CrearProductoPorCombos(req.body.Combo.ProductosPorCombo);
                var combo = await Combo.create(req.body.Combo).fetch()
              sails.log.info("Se creo el combo con el id "+combo.id)
              sails.log.info("el usuario " + currentUser.Id + "Creo el combo " + combo.id)
               combo = await Combo.find({id:combo.id}).populate('ProductosPorCombo')
              res.status(200).json(combo)
              }else{
                res.status(404).json({
                  error: "algun producto ingresado no existe"
                })
              }
              
            } catch (error) {
              sails.log.error(error)
            }

          } else {
            res.status(401).json({
              error: "Permisos insuficientes"
            })
          }
        } catch (error) {
          res.status(401).json({
            error: "Existio un problema con los permisos"
          })
        }

      } else {
        return res.status(401).json({
          error: 'Falta ingresar token.'
        });
      }
    } else {
      return res.status(401).json({
        error: 'Medidas de seguridad no ingresadas.'
      });
    }
  },

  deleteOffert: async function (req, res) {
    if (req.headers['access-token']) {
      const currentUser = await base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        if (currentUser.Ip == req.ip) {
          if (await base.CheckAuthorization(currentUser, 'Producto', 'Delete', req.ip, res)) {
            var data = req.body;
            try {
              if (data.id) {
                var destruido = await Combo.update({
                    id: data.id
                  })
                  .set({
                    Eliminated: true
                  }).fetch();
                if (destruido.length === 0) {
                  sails.log.info('Se intento borrar combo con id :' + data.id + " pero no existia alguno con ese id");
                  res.status(401).json({
                    error: 'No existe combo.'
                  });
                } else {
                  sails.log.info('Se elimino producto con id:' + data.id);
                  res.status(200).json({
                    message: 'combo eliminado.'
                  });
                }
              } else {
                sails.log.info("el usuario " + currentUser.Id + "No ingreso el id para eliminar");
                res.status(401).json({
                  error: 'Faltan ingresar parametros'
                });
              }
            } catch (error) {
              //sails.log.Error("El usuario  de id : "+ currentUser.Id + "quiso acceder desde un ip erroneo.");
              return res.status(500).json({
                error: 'Existio un problema al eliminar cliente' + error
              });
            }
          } else {
            sails.log.info("el usuario " + currentUser.Id + "quiso acceder a un lugar sin permisos");
            res.status(401).json({
              error: 'Acceso denegado.'
            });
          }

        } else {
          sails.log.info("El usuario  de id : " + currentUser.Id + "quiso acceder desde un ip erroneo.");
          return res.status(401).json({
            error: 'Acceso denegado.'
          });
        }

      } else {
        return res.status(401).json({
          error: 'Acceso denegado.'
        });
      }

    } else {
      return res.status(401).json({
        error: 'Medidas de seguridad no ingresadas.'
      });
    }
  },
  updateOffert: async function (req, res) {
    if (req.headers['access-token']) {
      var data = req.body;
      var currentUser = base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        if (await base.CheckAuthorization(currentUser, 'Producto', 'Edit', req.ip, res)) {
          if (data.Producto.id) {
            var producto = await Producto.update({
                id: data.Producto.id
              })
              .set({Name:data.Producto.Name,
                Description :data.Producto.Description
              }).fetch();
            if (producto.length === 0) {
              sails.log.info('Se intento modificar el producto con id :' + producto.id + " pero no existia alguno con ese id");
              res.status(401).json({
                error: 'No existe producto.'
              });
            } else {
              sails.log.info('Se modifico el producto con id :' + producto.id);
              res.status(200).json({
                message: 'Producto modificado.'
              });
            }
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
}
};
async function AgregarDatosProductos(combo){
  sails.log.info("se procede a agregar información de los productos")
  await Promise.all(combo.map(async (c) =>{
     await Promise.all(c.ProductosPorCombo.map(async (productoporcombo) => {
        let producto = await Producto.find({id: productoporcombo.Product})
        productoporcombo.Product = producto
      }))
  })).catch(err => 
    sails.log.error("se produjo un error al intentar extraer ids de producto"))
    sails.log.info("información agregada")
    sails.log.info(combo)  
  return combo
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
