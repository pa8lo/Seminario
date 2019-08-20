/**
 * ProductoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const token = require('jsonwebtoken');
const secretMessage = require('../Secret');
var base = require('./BaseController.js');

module.exports = {

  products: async function (req, res) {
    if (req.headers['access-token']) {
      var currentUser =await base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        try {
          if (await base.CheckAuthorization(currentUser, 'Producto', 'View', req.ip, res)) {
            var producto = await Producto.find({Eliminated : false});
            res.json(producto)
          } else {
            res.status(401).json({
              error: "Acceso denegado"
            })
          }
        } catch (error) {
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
  createProduct: async function (req, res) {
    if (req.headers['access-token']) {
      var currentUser =await base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        try {
          if (await base.CheckAuthorization(currentUser, 'Producto', 'Create', req.ip, res)) {
            sails.log.info("Se recibe la información " + JSON.stringify(req.body));
            
            try {
              var categoria = await Categoria.findOne({id: req.body.Category});
              if( categoria == null){
                sails.log.info("categoria ingresada incorrecta")
                res.status(404).json({
                  message: "categoria inexistente"
                })
              }else{
                var producto = await Producto.create(req.body).fetch()
                sails.log.info("el usuario " + currentUser.Id + "Creo el producto " + producto.id)
                res.status(200).json({
                  message: "Producto creado"
                })
              }

            } catch (error) {
              sails.log.error(error)
            }

          } else {
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

  deleteProduct: async function (req, res) {
    if (req.headers['access-token']) {
      const currentUser =await base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        if (currentUser.Ip == req.ip) {
          if (await base.CheckAuthorization(currentUser, 'Producto', 'Delete', req.ip, res)) {
            var data = req.body;
            try {
              if (data.id) {
                var destruido = await Producto.update({
                    id: data.id
                  })
                  .set({
                    Eliminated: true
                  }).fetch();
                if (destruido.length === 0) {
                  sails.log.info('Se intento borrar usuario con id :' + data.id + " pero no existia alguno con ese id");
                  res.status(401).json({
                    error: 'No existe Producto.'
                  });
                } else {
                  sails.log.info('Se elimino producto con id:' + data.id);
                  res.status(200).json({
                    message: 'Producto eliminado.'
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
  updateProduct: async function (req, res) {
    if (req.headers['access-token']) {
      var data = req.body;
      var currentUser =await base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        if (await base.CheckAuthorization(currentUser, 'Producto', 'Edit', req.ip, res)) {
          if (data.Producto.id) {
            var producto = await Producto.update({
                id: data.Producto.id
              })
              .set(data.Producto).fetch();
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


};
async function CheckToken (token){        
    var accessToken = token;            
    var tokenDecode = jwt.verify(accessToken,secretMessage.jwtSecret,(err, decoded) => {
        if (err) {                
            console.log(err)                
            return null;                                                                            
            }
            else {                
            var user = decoded;                                                                           
            return user;                
            }
        });
        return tokenDecode;
    }
