/**
 * CategoriaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var base = require('./BaseController.js');

module.exports = {
  categories: async function (req, res) {
    if (req.headers['access-token']) {
      var currentUser = await base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        try {
          if (await base.CheckAuthorization(currentUser, 'Producto', 'View', req.ip, res)) {
            var categoria = await Categoria.find({Eliminated:false}).populate('Products');
            res.json(categoria)
          } else {
            sails.log.info("el Usuario " + currentUser.Id + " Intengo entrar a un lugar sin permisos")
            res.status(401).json({
              error: "Acceso denegado"
            })
          }
        } catch (error) {
          sails.log.error("Existio un error al quere ver las categorias : " + error);
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
      sails.log.info("Se intento ingresar sin token de seguridad")
      return res.status(401).json({
        error: 'Medidas de seguridad no ingresadas.'
      });
    }
  },

  createCategory: async function (req, res) {
    if (req.headers['access-token']) {
      var currentUser = await base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        try {
          if (await base.CheckAuthorization(currentUser, 'Producto', 'Create', req.ip, res)) {
            try {
              var categoria = await Categoria.create(req.body).fetch()
              sails.log.info("el usuario " + currentUser.Id + "Creo la categoria " + categoria.id)
              res.status(200).json({
                message: "Categoria creado"
              })
            } catch (error) {
              sails.log.error("Existio un error al querecrear una categoria : " + error);
            }

          } else {
            sails.log.info("el Usuario " + currentUser.Id + " Intengo entrar a un lugar sin permisos")
            res.status(401).json({
              error: "Permisos innecesarios"
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

  deleteCategory: async function (req, res) {
    if (req.headers['access-token']) {
      const currentUser = await base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        if (currentUser.Ip == req.ip) {
          if (await base.CheckAuthorization(currentUser, 'Producto', 'Delete', req.ip, res)) {
            var data = req.body;
            try {
              if (data.id) {
                var destruido = await Categoria.update({
                    id: data.id
                  })
                  .set({
                    Eliminated: true
                  }).fetch();
                var products = await seeproducts(data.id)
                var items = await seeItem(data.id)
                await deleteProductsFromCategory(products);
                await deleteItemsFromCategory(items)
                if (destruido.length === 0) {
                  sails.log.info('Se intento borrar la categoria con id :' + data.id + " pero no existia alguno con ese id");
                  res.status(401).json({
                    error: 'No existe Categoria.'
                  });
                } else {
                  sails.log.info('Se elimino la categoria con id:' + data.id);
                  res.status(200).json({
                    message: 'Categoria eliminado.'
                  });
                }
              } else {
                sails.log.info("el usuario " + currentUser.Id + "No ingreso el id para eliminar");
                res.status(401).json({
                  error: 'Faltan ingresar parametros'
                });
              }
            } catch (error) {

              sails.log.error("existio un error al eliminar categoria : " + error);
              return res.status(500).json({
                error: 'Existio un problema al eliminar la categoria' + error
              });
            }
          } else {
            sails.log.info("el usuario " + currentUser.Id + "quiso acceder a un lugar sin permisos");
            res.status(401).json({
              error: 'Acceso denegado.'
            });
          }

        } else {
          sails.log.Info("El usuario  de id : " + currentUser.Id + "quiso acceder desde un ip erroneo.");
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

  updateCategory: async function (req, res) {
    if (req.headers['access-token']) {
      var data = req.body;
      var currentUser = await base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        if (await base.CheckAuthorization(currentUser, 'Producto', 'Edit', req.ip, res)) {
          if (data.Categoria.id) {
            var categoria = await Categoria.update({
                id: data.Categoria.id
              })
              .set(data.Categoria).fetch();
            if (categoria.length === 0) {
              sails.log.info('Se intento modificar el producto con id :' + categoria.id + " pero no existia alguno con ese id");
              res.status(401).json({
                error: 'No existe producto.'
              });
            } else {
              sails.log.info('Se modifico el producto con id :' + categoria.id);
              res.status(200).json({
                message: 'categoria modificada.'
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
  /**
   * Permite ver los productos de una categoria
   * @param {*} req 
   * @param {*} res 
   */
  products: async function (req, res) {
    let data = req.allParams();
    sails.log.info("ser recibieron los siguiente parametros: "+data)
    if (await base.validator(req, res, "Producto", "View")) {
      if(data.id !=undefined || data.id!= ''|| data.id !=0){
        var Productos = await seeproducts(data.id)
        if (!Productos) {
          sails.log.info('Se intento buscar una categoria inexistente');
          res.status(401).json({
            error: 'No existe categoria.'
          });
        } else {
          sails.log.info('Se muestran productos de la categoria');
          res.status(401).json({
            Productos
          });
        }
        }else{
          sails.log.info("faltaron ingresar parametros")
          res.status(400).json({
            error:"parametros incorrectos"
          })
        }
      }
      
    
  },
  /**
   * Permite ver la información de una categoria
   * @param {*} req 
   * @param {*} res 
   */
  category: async function (req, res) {
    var data = req.allParams();
    
    if(data.id ==undefined || data.id == ''|| data.id==0){
      sails.log.error("no se ingreso el parametro id")
      res.status(400).json({
        error:"Faltan ingresar parametros"
      })
    }else{
      sails.log.info("se procede a buscar la categoria con el id "+data.id)
      if (await base.validator(req, res, "Producto", "View")) {
        var categoria = await Categoria.find({
          id: data.id,
          Eliminated:false
        }).populate('Products');
        if (categoria.length >0){
          sails.log.info("se encontro la categoria"+JSON.stringify(categoria))
          res.status(200).json({
          categoria
        })
        }else{
          sails.log.info("no se encontro la categoria id :"+data.id)
          res.status(404).json();
        }

      }
    }
    
  },

};
/**
   * Permite ver los productos de una categoria
   * @param {int} idCategoria 
   */
async function seeproducts(idCategoria) {
  var categoria = await Categoria.findOne({
    id: idCategoria
  }).populate('Products');
  if (categoria === undefined || categoria.length === 0) {
    return false
  } else {
    return categoria.Products
  }
}
/**
   * Permite ver litemas de una categoria
   * @param {int} idCategoria 
   */
async function seeItem(idCategoria) {
  var categoria = await Categoria.findOne({
    id: idCategoria
  }).populate('Items');
  if (categoria === undefined || categoria.length === 0) {
    return false
  } else {
    return categoria.Items
  }
}
/**
   * Permite borrar la categoria de un array de items
   * @param {Array} Items 
   */
async function deleteItemsFromCategory(Items) {
  sails.log.info("Se eliminara la categoria de los siguientes Items : " + JSON.stringify(Items));
  Items.forEach(async OneItem => {
    var item = await Item.update({
        id: OneItem.id
      })
      .set({
        Category: 1
      }).fetch();
    sails.log.info("Se cambio la categoria" + item.id + " del  a " + item.Category)
  })
}
/**
   * Permite borrar la categoria de un array de productos
   * @param {Array} Items 
   */
async function deleteProductsFromCategory(Productos) {
  sails.log.info("Se eliminara la categoria de los siguientes productos : " + JSON.stringify(Productos));
  Productos.forEach(async Product => {
    var producto = await Producto.update({
        id: Product.id
      })
      .set({
        Category: 1
      }).fetch();
    sails.log.info("Se cambio la categoria" + producto.id + " del  a " + producto.Category)
  })
}
