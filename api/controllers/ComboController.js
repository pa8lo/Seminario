/**
 * ComboController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  Offerts: async function (req, res) {
    if (req.headers['access-token']) {
      var currentUser = base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        try {
          if (await base.CheckAuthorization(currentUser, 'Producto', 'View', req.ip, res)) {
            var combo = await Combo.find();
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
  createOffert: async function (req, res) {
    if (req.headers['access-token']) {
      var currentUser = base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        try {
          if (await base.CheckAuthorization(currentUser, 'Producto', 'Create', req.ip, res)) {
            try {
              var data = req.body
              var combo = await Combo.create(data.Combo).fetch()
              await data.Produts.forEach(async product => {
                await Combo.addToCollection(product.id, "Offers")
                  .members(combo.id);
              });

              sails.log.info("el usuario " + currentUser.Id + "Creo el combo " + producto.id)
              res.status(200).json({
                message: "combo creado"
              })
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

  deleteOffert: async function (req, res) {
    if (req.headers['access-token']) {
      const currentUser = base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        if (currentUser.Ip == req.ip) {
          if (await base.CheckAuthorization(currentUser, 'Combo', 'Delete', req.ip, res)) {
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
