/**
 * CategoriaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const token = require('jsonwebtoken');
const secretMessage = require('../Secret');
var base = require('./BaseController.js');

module.exports = {
  categories: async function (req, res) {
    if (req.headers['access-token']) {
      var currentUser = base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        try {
          if (await base.CheckAuthorization(currentUser, 'Producto', 'View', req.ip, res)) {
            var categoria = await Categoria.find();
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
      var currentUser = base.CheckToken(req.headers['access-token']);
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
      const currentUser = base.CheckToken(req.headers['access-token']);
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
                if (destruido.length === 0) {
                  sails.log.info('Se intento borrar la categoria con id :' + data.id + " pero no existia alguno con ese id");
                  res.status(401).json({
                    error: 'No existe Producto.'
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
                
                sails.log.error("El usuario  de id : "+ currentUser.Id + "quiso acceder desde un ip erroneo.");
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
      var currentUser = base.CheckToken(req.headers['access-token']);
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

  products: async function (req, res) {
    if(await base.validator(req,res,"Producto","View")){
        var data = req.body
        var categoria = await Categoria.findOne({
          id: data.Categoria.id
        }).populate('Products');
        res.status(200).json({
          categoria
        })
    }
  },

};
