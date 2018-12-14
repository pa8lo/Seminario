/**
 * RolController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const token = require('jsonwebtoken');
const secretMessage = require('../Secret');
var base = require('./BaseController.js');
module.exports = {
  rols: async function (req, res) {
    if (req.headers['access-token']) {
      var currentUser = base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        try {
          if (await base.CheckAuthorization(currentUser, 'Usuario', 'Create', req.ip, res)) {
            base.SeeElements(Rol, "Rol", res);
          } else {
            res.status(401).json({
              error: "Acceso DEnegado"
            })
          }
        } catch (error) {
          res.status(500).json({
            error: "Acceso denegado"
          })
        }
      } else {
        return res.status(400).json({
          error: 'Acceso denegado.'
        });
      }

    } else {
      return res.status(400).json({
        error: 'Medidas de seguridad no ingresadas.'
      });
    }
  },

  AssignAuthorizations: async function (req, res, ModeloPrincipal, data) {
    var status = 200;
    var mensaje = "ok";
    if (req.headers['access-token']) {
      var currentUser = base.CheckToken(req.headers['access-token']);
      if (currentUser) {

        var reqUser = req.body;
        await reqUser.Authorizations.forEach(async Authorization => {

          if (await base.CheckAuthorization(currentUser, 'Authorization', 'Assign', req.ip, res)) {
            console.log(Authorization + "permiso")
            var existeRol = await Rol.find({
              id: reqUser.rol.id
            }).limit(1);
            var existeAuthorization = await Permiso.findOne({
              id: Authorization
            });
            Permiso.find({
                id: Authorization
              })
              .then(async function (data) {
                if (!data || data.length == 0) {
                  status = 500
                  mensaje = {
                    error: "El Rol o usuario no existe"
                  };
                  console.log("No entro")
                } else {
                  return await Rol.addToCollection(Authorization, 'Authorizations')
                    .members(reqUser.rol.id);
                  status = 200
                  mensaje = {
                    message: "ok"
                  };
                  console.log("aca")
                }

              })
            if ((existeAuthorization === undefined) && (existeRol === undefined)) {
              res.status(401).json({
                error: "Acceso Denegado"
              })
            }
          } else {
            /*  await Rol.addToCollection(Authorization, 'Authorizations')
                .members(reqUser.rol.id);
                status = 200
                mensaje = {message: "ok"};
                console.log("aca")
            }else{
                status = 400
                mensaje = {error: "El Rol o usuario no existe"};
                console.log("No entro")*/

          }
        });
        res.status(status).json(mensaje)

      }
    } else {
      res.status(401).json({
        erros: 'Medidas de seguridad no ingresadas.'
      })
    }
  },

  /*RemoveAuthorization: async function (req,res) {
      if(req.headers['access-token']){      
              var currentUser = base.CheckToken(req.headers['access-token']);
              if(currentUser){
                      var data = {
                          modeloPrincipal:{
                              id:req.body.rol.id
                          },
                          modeloSecundario:{
                              id:req.body.Authorizations.id
                          }
                      }
                      if(await base.CheckAuthorization(currentUser,'Authorization','Delete',req.ip,res)){   
                         var existeAuthorization = await Permiso.find({where: {id:req.body.Authorizations.id},})
                         var existeRol = await Rol.find({id: req.body.rol.id});
                         console.log(existeAuthorization);
                         /*if(existeAuthorization !== undefined && existeRol !== undefined){
                            await base.RemoveAuthorization(data,User,'Authorizations',res)
                           res.status(200).json({message : 'Permiso removido con exito.'}) 
                         }else{
                             res.status(401).json({error:"no existe el permiso que desea eliminar"})
                         }
                          
                      }else{
                          res.status(401).json({error:"Acceso denegado"})
                      }   

              }else{
                  return res.status(401).json({erros : 'Medidas de seguridad no ingresadas.'})
              }
              
  }else{
      return res.status(401).json({erros : 'Medidas de seguridad no ingresadas.'})
  }
  },*/

  CreateRol: async function (req, res) {
    if (req.headers['access-token']) {
      var currentUser = base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        if (await base.CheckAuthorization(currentUser, 'Rol', 'Create', req.ip, res)) {
          var data = req.body
          var existeRol = await Rol.findOne({
            Name: data.Name
          })
          if (existeRol === undefined) {
            try {
              var rol = await Rol.create(data).fetch();
              res.status(200).json({
                idRol: rol.id
              })
            } catch (error) {
              sails.log.Info("Existio un error al crear el rol : " + error);
              res.status(500).json({
                error: "Existio un problema al crear rol"
              })
            }
          } else {
            res.status(401).json({
              error: "Ya existe el rol que quieres crear"
            })
          }
        } else {
          res.status(401).json({
            error: "Acceso Denegado"
          })
        }


      } else {
        sails.log.Info("El usuario  de id : " + tokenDecode.Id + "quiso acceder desde un ip erroneo.");
        res.status(403).json({
          error: "Acceso denegado"
        })
      }
    }
  },
  /**
 * Recibe un id de usuario y un id de rol y actualiza los permisos de cada uno
 */
  UpdateAuthorizations: async function (idUser, IdRol) {
    var rolesUsuario = await User.findOne({
      id: idUser
    }).populate('Authorizations')
    var rol = await Rol.findOne({
      id: IdRol
    }).populate('Authorizations')
    try {
      await rolesUsuario.Authorizations.forEach(async Auth => {
        try {
          await User.removeFromCollection(idUser, 'Authorizations')
            .members(Auth.id);
        } catch (error) {
          sails.log.debug(error);
        }

      })
      await rol.Authorizations.forEach(async Auth => {
        try {
          await User.addToCollection(idUser, 'Authorizations')
            .members(Auth.id);
        } catch (error) {
          sails.log.debug(error);
        }

      })
    } catch (error) {
      sails.log.debug(error);
    }
  },
  DeleteRol: async function (req, res) {
    if (req.headers['access-token']) {
      var currentUser = base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        var data = req.body
        if (await base.CheckAuthorization(currentUser, 'Rol', 'Delete', req.ip, res)) {
          var destruido = await Rol.update({
              id: data.id
            })
            .set({
              Eliminated: true
            }).fetch();
          if (destruido.length === 0) {
            // sails.log.Error('Se intento borrar usuario con id :'+data.id+" pero no existia alguno con ese id");
            res.status(401).json({
              error: 'No existe Rol.'
            });
          } else {
            // sails.log.Info('Se elimino usuario con id:'+data.id, destruido[0]);
            res.status(200).json({
              message: 'Rol eliminado.'
            });
          }
        }
      }
    }
  },
  UpdateRol: async function (req, res) {
    if (req.headers['access-token']) {
      const currentUser = base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        let data = req.body
        if (await base.CheckAuthorization(currentUser, 'Rol', 'Edit', req.ip, res)) {
          const rol = await Rol.update({
              id: data.Rol.id
            })
            .set(data.Rol).fetch();
          if (usuario.length === 0) {
            // sails.log.Error('Se intento borrar usuario con id :'+data.id+" pero no existia alguno con ese id");
            res.status(401).json({
              error: 'No existe Rol.'
            });
          } else {
            res.status(200).json({
              message: 'Rol modificado.'
            });
          }
        }
      }
    }
  }


};
