/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const token = require('jsonwebtoken');
const secretMessage = require('../Secret');
var base = require('./BaseController.js');
var rol = require('./RolController.js');
var message = require('../globals/index');
var _validaciones = require('./ValidacionController');
module.exports = {
  //traigo todos los usuarios.
  users: async function (req, res) {
    try {
      let currentUser = await _validaciones.validarRequest(req, 'Usuario', 'View');
      base.SeeElements(User, "usuario", res);
    } catch (err) {
      console.log(err)
      sails.log.error("error" + JSON.stringify(err))
      res.status(err.code).json(err.message);
    }
  },

  DeleteUser: async function (req, res) {
    try {
      let currentUser = await _validaciones.validarRequest(req, 'Usuario', 'View');
      var data = req.body;
      let validacion = await _validaciones.validarRequestIdEntidad(data.id);
      var destruido = await User.update({ id: data.id }).set({ Eliminated: true }).fetch();
      validacion = _validaciones.ValidarEntidad(destruido, "Usuario");
      res.status(200).json({ message: ' Usuario eliminado' });
    } catch (err) {
      sails.log.error("error" + JSON.stringify(err))
      res.status(err.code).json(err.message);
    }
  },

  createUser: async function (req, res) {
    try {
      let currentUser = await _validaciones.validarRequest(req, 'Usuario', 'Create');
      var data = req.body;
      sails.log.info(currentUser)
      let validacion = await _validaciones.validarExistencia({ Dni: data.User.Dni.trim(), Eliminated: false }, User)
      validacion = await _validaciones.validarExistenciaEliminar({ id: data.User.Rols, Eliminated: false }, Rol);
      var usuario = await User.create(data.User).fetch();
      sails.log.info(usuario);
      await rol.UpdateAuthorizations(usuario.id, data.User.Rols);
      res.status(200).json({
        message: "usuario creado correctamente",
        usuario: usuario
      })
    } catch (err) {
      sails.log.error("error" + JSON.stringify(err))
      res.status(err.code).json(err.message);
    }
  },

  login: async function (req, res) {
    try {
      const data = req.body;
      let validacion = _validaciones.ValidarRequestLogin(data);
      var user = await User.findOne({
        Dni: data.Dni.trim(),
        Eliminated: false
      }).decrypt().populate('Rols');
      validacion = _validaciones.ValidarExistenciaLogin(user);
      validacion = _validaciones.ValidarDatosLogin(user.Password, data.Password);
      var userToken = token.sign({
        Name: user.Name,
        Id: user.id,
        Ip: req.ip
      }, secretMessage.jwtSecret);
      sails.log.info("Enviando token")
      res.status(200).json({
        user: {
          Name: user.Name,
          Rol: user.Rol
        },
        token: userToken
      })
    } catch (err) {
      sails.log.error("error" + JSON.stringify(err))
      res.status(err.code).json(err.message);
    }
  },

  UserAuthorizations: async function (req, res) {
    try{
      var currentUser =await base.CheckToken(req.headers['access-token']);
      var usuario = await User.findOne({id: currentUser.Id}).populate('Authorizations');
      res.status(200).json({Authorizations: usuario.Authorizations});
    }catch(err){
      sails.log.error("error" + JSON.stringify(err))
      res.status(err.code).json(err.message);
    }
  },
    currentUser: async function (req, res) {
        if (!req.headers['access-token'] || req.headers['access-token'].length < 1) {
          res.status(401).json({
            error: "Falta ingresar token de seguridad"
         })
       } else {
         try {
           const tokenDecode =await base.CheckToken(req.headers['access-token']);
           if(tokenDecode != null){
           return res.send({
             'sucess': true,
             'User': tokenDecode,
           })
         }else{
           return res.send({
             'sucess': false,
             'User': tokenDecode,
           })
         }
         } catch (error) {
           res.status(401).json({
             error: "Falta ingresar token de seguridad"
           })
         }
        }
      },

  RemoveAuthorization: async function (req, res) {
    if (req.headers['access-token']) {
      var currentUser = await base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        var data = {
          modeloPrincipal: {
            id: req.body.User.id
          },
          modeloSecundario: {
            id: req.body.Authorizations.id
          }
        }
        if (await base.CheckAuthorization(currentUser, 'Authorization', 'Delete', req.ip, res)) {
          var existeAuthorization = await Permiso.findOne({
            id: data.modeloSecundario.id
          })
          var existeUsuario = await User.findOne({
            id: data.modeloPrincipal.id
          });
          if (existeAuthorization !== undefined && existeUsuario !== undefined) {
            await base.RemoveAuthorization(data, User, 'Authorizations', res)
            res.status(200).json({
              message: 'Permiso removido con exito.'
            })
          } else {
            res.status(401).json({
              error: "no existe el permiso que desea eliminar"
            })
          }

        } else {
          res.status(401).json({
            error: "Acceso denegado"
          })
        }

      } else {
        return res.status(401).json({
          erros: 'Medidas de seguridad no ingresadas.'
        })
      }

    } else {
      return res.status(401).json({
        erros: 'Medidas de seguridad no ingresadas.'
      })
    }
  },

  AssignAuthorization: async function (req, res) {
    if (req.headers['access-token']) {
      var currentUser = await base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        var data = req.body
        if (await base.CheckAuthorization(currentUser, 'Authorization', 'Assign', req.ip, res)) {
          var existeAuthorization = await Permiso.findOne({
            id: data.Authorization.id
          });
          var existeUsuario = await User.findOne({
            id: data.User.id
          });
          if (existeAuthorization !== undefined && existeUsuario !== undefined) {
            await User.addToCollection(data.Authorization.id, 'Authorizations')
              .members(data.User.id);
            res.status(200).json({
              message: 'ok.'
            })
          } else {
            res.status(401).json({
              error: "No existe el permiso ese permiso"
            })
          }

        } else {
          res.status(401).json({
            error: "Acceso denegado"
          })
        }

      }
    } else {
      res.status(401).json({
        erros: 'Medidas de seguridad no ingresadas.'
      })
    }
  },
  /**
  * Actualiza datos del usuario
  */
  UpdateUser: async function (req, res) {
    if (req.headers['access-token']) {
      var currentUser = await base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        var data = req.body;
        if (await base.CheckAuthorization(currentUser, 'Usuario', 'Edit', req.ip, res)) {
          await Checkrol(data.User.Rols, data.User.id)
          var usuario = await User.update({
            id: data.User.id
          })
            .set(data.User).fetch();
          if (usuario.length === 0) {
            // sails.log.Error('Se intento borrar usuario con id :'+data.id+" pero no existia alguno con ese id");
            res.status(401).json({
              error: 'No existe usuario.'
            });
          } else {
            res.status(200).json({
              message: 'Usuario modificado.'
            });
          }

        } else {
          res.status(401).json({
            error: "Acceso denegado"
          })
        }

      }
    } else {
      return res.status(401).json({
        erros: 'Medidas de seguridad no ingresadas.'
      })
    }
  },

  User: async function (req, res) {
    try{
      var data = req.allParams();
      let currentUser = await _validaciones.validarRequest(req,'Usuario','View');
      let validacion = await _validaciones.validarRequestIdEntidad(data.id);
      var usuario = await User.findOne({id: data.id}).decrypt().populate('Adress');
      validacion = await _validaciones.ValidarEntidad(usuario,"Usuario")
      res.status(200).json({user: usuario})
    }catch(err){
      sails.log.error("error" + JSON.stringify(err))
      res.status(err.code).json(err.message);
    }
  },
  //Modifica el rol del usuario configurando sus nuevos permisos
  // ChangeRol: async function (req, res) {
  //   let currentUser = await _validaciones.validarRequest(req,'Usuarios','Edit')
  //   // if (req.headers['access-token']) {
  //   //   var currentUser = await base.CheckToken(req.headers['access-token']);
  //   //   if (currentUser) {
  //   var parametros = req.body
  //       console.log(parametros)
  //       // if (await base.CheckAuthorization(currentUser, 'Usuario', 'Edit', req.ip, res)) {

  //         var ExisteRol = await Rol.findOne({
  //           id: parametros.Rol.id
  //         })
  //         var existeUsuario = await User.findOne({
  //           id: parametros.User.id
  //         })
  //         if (ExisteRol !== undefined && existeUsuario !== undefined) {
  //           var usuario = await User.findOne({
  //             id: parametros.User.id
  //           }).populate('Authorizations');
  //           await usuario.Authorizations.forEach(Auth => {
  //             var data = {
  //               User: {
  //                 id: parametros.User.id
  //               },
  //               Authorizations: {
  //                 id: Auth.id
  //               }
  //             }
  //             base.RemoveAuthorization(data, User, 'Authorizations', res);

  //           });
  //           try {
  //             await UpdateRol(parametros.Rol.id, parametros.User.id)
  //             res.status(200).json({
  //               message: "Usuario midificado correctamente"
  //             })
  //           } catch (err) {
  //             sails.log.debug(err);
  //             res.status(404).json({
  //               error: "Existío un error cuando se quiso actualizar el rol"
  //             })
  //           }
  //         } else {
  //           res.status(401).json({
  //             error: "No existe rol o usuario"
  //           })
  //         }
  //       } else {
  //         res.status(401).json({
  //           error: "Acceso denegado"
  //         })
  //       }
  //     }
  //   } else {
  //     return res.status(401).json({
  //       erros: 'Medidas de seguridad no ingresadas.'
  //     })
  //   }
  // },

  ChangePassword: async function (req, res) {
    if (req.headers['access-token']) {
      var currentUser = await base.CheckToken(req.headers['access-token']);
      if (currentUser) {
        var usuario = await User.findOne({
          id: currentUser.Id
        }).decrypt()
        sails.log.info(req.body.Password + "" + usuario.Password)
        if (req.body.Password === usuario.Password) {
          usuario.Password = req.body.NewPassword;
          await User.update({ id: usuario.id }).set({Password:usuario.Password});
          sails.log.info("Se modifico la contraseña del usuario con id " + currentUser.Id)
          res.status(message.response.ok).json({ message: "Contraseña Modificada" })
        } else {
          sails.log.info("Se quizo modifico la contraseña del usuario con id " + currentUser.Id + "pero se ingreso un password incorrecto")
          res.status(message.response.Unauthorized).json({ error: "Contraseña incorrecta" })
        }
      } else {
        res.status(message.response.Unauthorized).json({ error: "Su cuenta caduco por favor loguearse" })
      }
    } else {
      res.status(message.response.Unauthorized).json({ error: "Su cuenta caduco por favor loguearse" })
    }
  },
  ResetPassword: async function (req, res)
  {
    try {
      let currentUser = await _validaciones.validarRequest(req, 'Usuario', 'Edit');
      _validaciones.validarRequestIdEntidad(req.body.id);
      let data = req.body
      var usuario = await User.findOne({
        id: data.id
      }).decrypt()
      _validaciones.validarExistenciaEliminar(usuario.id,User);
      let respuesta = await User.update({ id: usuario.id }).set({Password:usuario.Dni}).fetch();
      sails.log.info(" se reinicio la contraseña del usuario " + usuario.id);
      res.status(200).json(respuesta);
    } catch (err) {
      console.log(err)
      sails.log.error("error" + JSON.stringify(err))
      res.status(err.code).json(err.message);
    }
  }

};
/**
* Actualiza el rol del usuario.
*/
async function UpdateRol(idNewRol, idUsuario) {
  try {
    await User.update({
      id: idUsuario
    })
      .set({
        Rols: idNewRol
      }).fetch();
    await rol.UpdateAuthorizations(idUsuario, idNewRol);
  } catch (err) {
    sails.log.debug("Existio un error cuando se quiso modificar el rol del usuario " + err);
  }

};
/**
* Controla si el id del rol es igual que el id del rol que se quiere modificar
*/
async function Checkrol(idNewRol, idUsuario) {
  try {
    var usuario = await User.findOne({ id: idUsuario })
    if (idNewRol !== usuario.rols) {
      console.log("AD")
      await UpdateRol(idNewRol, idUsuario)
    } else {
      return false
    }
  } catch (error) {
    sails.log.debug("Existio un error cuando se quiso comprobar el rol del usuario " + error);
  }
}
