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
      var currentUser =await base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        try {
          if (await base.CheckAuthorization(currentUser, 'Usuario', 'Create', req.ip, res)) {
            var roles = await Rol.find({Eliminated : false}).populate('Authorizations')
            res.status(200).json(
                roles
              )
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

  rol: async function (req, res) {
    var data = req.allParams();
    if (!data.id) {
      res.status(400).json({
        error: "Faltan ingresar parametros"
      })
    }else{
      if (req.headers['access-token']) {
        var currentUser =await base.CheckToken(req.headers['access-token']);
        if (currentUser) {
          try {
            if (await base.CheckAuthorization(currentUser, 'Rol', 'View', req.ip, res)) {
              var roles = await Rol.findOne({id : data.id}).populate('Authorizations')
              if(roles != null){
                res.status(200).json(
                  roles
                )
              }else{
                res.status(404).json(
                  {error:"no existe el rol"}
                )
              }

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
    }
  },

  AssignAuthorizations: async function (req, res) {
    let errores=[];
    var status = 200;
    var correctos = [];
    if (req.headers['access-token']) {
      var currentUser = await base.CheckToken(req.headers['access-token']);
      if (currentUser && await base.CheckAuthorization(currentUser, 'Rol', 'Create', req.ip, res)) {
        var reqUser = req.body;
        sails.log.info("Se recibio la información para agregar permisos"+JSON.stringify(reqUser))
        var permisos = await Permiso.count({
          where: {id:req.body.Authorizations}});
        var rol = await Rol.find({
            id: reqUser.rol.id,
            Eliminated:false
        });
        sails.log.info("se encontro :"+rol.length+" rol")
        sails.log.info("se encontratos "+permisos+" permisos")
        if(rol.length >0 && permisos == req.body.Authorizations.length){
                  await Rol.addToCollection(reqUser.rol.id, 'Authorizations')
                    .members( req.body.Authorizations);
                  sails.log.info("se agregaron los siguientes permisos : "+req.body.Authorizations)
                  correctos.push("se agregaron los siguientes permisos : "+req.body.Authorizations)
      }else{
        if(rol.length <= 0 ){
          sails.log.error("no existe rol")
          errores.push("no existe rol")
          status=404;
        }
        if(permisos != req.body.Authorizations.length){
          sails.log.error("no existe uno o varios permisos")
          errores.push("no existe uno o varios permisos")
        }
      }  
      }else{
        sails.log.error("acceso denegado");
        errores.push("acceso denegado")
        status=401
      }
    } else {
      sails.log.error("Medidas de seguridad no ingresadas.");
      errores.push("Medidas de seguridad no ingresadas.")
      status=401
    }
    sails.log.info("erorres : "+errores.length);
    sails.log.info("correctos : "+correctos.length);
    if(correctos.length > 0){
      sails.log.info("correctos : "+correctos.length);
      res.status(status).json({correctos})
    }else{
      sails.log.error("cantidad de errores encontrados : "+errores.length);
      res.status(status).json({errores})
    }
  },

  RemoveAuthorization: async function (req,res) {
    var errores =[];
    let codigoRespuesta = 200;
      if(req.headers['access-token']){      
              var currentUser = await base.CheckToken(req.headers['access-token']);
              if(currentUser){
                      if(await base.CheckAuthorization(currentUser,'Authorization','Delete',req.ip,res)){   
                         var permisos = await Permiso.count({where: {id:req.body.Authorizations}})
                         var roles = await Rol.count({id: req.body.rol.id ,Eliminated:false});
                         sails.log.info("roles encontrados :"+roles);
                         sails.log.info("Permisos a borrar"+permisos);
                         if(roles == 1 && permisos == req.body.Authorizations.length){
                          await Rol.removeFromCollection(req.body.rol.id , 'Authorizations')
                          .members(req.body.Authorizations);
                        }else{
                          if(roles == 0){
                          errores.push("no existe el rol que desea eliminar")
                          codigoRespuesta = 400
                          sails.log.error("no existe el rol que se desea eliminar ")
                          }
                          if(roles > 1){
                            errores.push("datos inconsistentes con el id rol")
                            codigoRespuesta = 500
                            sails.log.error("datos inconsistentes con el id rol")
                          }
                          if(permisos != req.body.Authorizations.length){
                            errores.push("Uno o varios permisos no existen")
                            codigoRespuesta = 404
                            sails.log.error("Uno o varios permisos no existen")
                          }
                        }
                      }else{
                        errores.push("Acceso denegado")
                        codigoRespuesta = 401
                        sails.log.error("errores encontrados"+JSON.stringify(errores))
                      }   
              }else{
                errores.push("Medidas de seguridad invalidas.")
                codigoRespuesta = 401
                sails.log.error("errores encontrados"+JSON.stringify(errores))
              }
  }else{
    errores.push("Medidas de seguridad no ingresadas.")
    codigoRespuesta = 401
    sails.log.error("errores encontrados"+JSON.stringify(errores))
  }
  if(errores.length == 0 ){
    res.status(200).json({Message : "se borraron los permisos con el id : "+req.body.Authorizations})
  }else{
    sails.log.error("cantidad de errores" + errores.length)
    res.status(codigoRespuesta).json({errores})
  }
  },

  CreateRol: async function (req, res) {
    if (req.headers['access-token']) {
      var currentUser =await base.CheckToken(req.headers['access-token']);
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
    sails.log.info("aca3")
    let ids =[]
    var rol = await Rol.findOne({
      where: {id:IdRol},
    }).populate('Authorizations',{ select: ['id']})
    sails.log.info(JSON.stringify(rol.Authorizations));
    rol.Authorizations.forEach(async Auth => {
      ids.push(Auth.id)
    })
    await User.replaceCollection(idUser , 'Authorizations')
    .members(ids);
    sails.log.info("se agregaron los siguientes permisos al usuario "+ids)
  },
  DeleteRol: async function (req, res) {
    if (req.headers['access-token']) {
      var currentUser =await base.CheckToken(req.headers['access-token']);
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
      const currentUser =await base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        let data = req.body
        if (await base.CheckAuthorization(currentUser, 'Rol', 'Edit', req.ip, res)) {
          const rol = await Rol.update({
              id: data.Rol.id
            })
            .set(data.Rol).fetch();
          if (rol.length === 0) {
            // sails.log.Error('Se intento borrar usuario con id :'+data.id+" pero no existia alguno con ese id");
            res.status(401).json({
              error: 'No existe Rol.'
            });
          } else {
            await Rol.replaceCollection(data.Rol.id , 'Authorizations')
                          .members(data.Authorizations);
            await ActualizarPermisosUsuarios(data.Rol.id,data.Authorizations);
            res.status(200).json({
              message: 'Rol modificado.'
            });
          }
        }
      }
    }
  },
};
  async function ActualizarPermisosUsuarios(idrol,arrayPermiso){
    var usuarios =await User.find({Rols:idrol})
    usuarios.forEach(async usuario => {
      await User.replaceCollection(usuario.id , 'Authorizations')
                          .members(arrayPermiso);
    });
  }

