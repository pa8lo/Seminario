/**
 * ItemController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var base = require('./BaseController.js')
module.exports = {
  items: async function (req, res) {
    if (await base.validator(req, res, "Producto", "View")) {
      var item = await Item.find({Eliminated:false});
      res.json(item)
    }
  },

  createItem: async function (req, res) {
    if (await base.validator(req, res, "Producto", "View")) {
      try {
        var currentUser =await base.CheckToken(req.headers['access-token']);
        var item = await Item.create(req.body).fetch()
        sails.log.info("el usuario " + currentUser.Id + "Creo el item " + item.id)
        res.status(200).json({
          message: "Item creado"
        })
      } catch (error) {
        sails.log.error("existio un error para crear el item : " + error)
        res.status(400).json({
          error: "error al crear el item"
        })
      }
    }
  },

  deleteItem: async function (req, res) {
    if (await base.validator(req, res, "Producto", "View")) {
      var data = req.body;
      try {
        if (data.id) {
          var destruido = await Item.update({id: data.id}).set({Eliminated: true}).fetch();
          if (destruido.length === 0) {
            sails.log.info('Se intento borrar el item  con id :' + data.id + " pero no existia alguno con ese id");
            res.status(401).json({
              error: 'No existe item.'
            });
          } else {
            sails.log.info('Se elimino el item con id:' + data.id);
            res.status(200).json({
              message: 'item eliminado.'
            });
          }
        } else {
          sails.log.info("el usuario " + currentUser.Id + "No ingreso el id para eliminar");
          res.status(401).json({
            error: 'Faltan ingresar parametros'
          });
        }
      } catch (error) {
        sails.log.error('Existio un problema al eliminar el item' + error);
        return res.status(500).json({
          error: 'Existio un problema al eliminar el item' + error
        });
      }
    }
  },

  updateItem: async function (req, res) {
    if (await base.validator(req, res, "Producto", "View")) {
        var data = req.body
        if (data.Item.id) {
            var item = await Item.update({
                id: data.Item.id
              })
              .set(data.Item).fetch();
            if (item.length === 0) {
              sails.log.info('Se intento modificar el producto con id :' + item.id + " pero no existia alguno con ese id");
              res.status(401).json({
                error: 'No existe item.'
              });
            } else {
              sails.log.info('Se modifico el producto con id :' + item.id);
              res.status(200).json({
                message: 'Item modificada.'
              });
            }
          } else {
            sails.log.info("el usuario " + currentUser.Id + "No ingreso el id ");
            res.status(401).json({
              error: 'Faltan ingresar parametros'
            });
          }
    }
  },



};
