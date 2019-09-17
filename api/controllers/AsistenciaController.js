/**
 * AsistenciaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var base = require('./BaseController.js');

module.exports = {
    Assists: async function (req, res) {
        if (req.headers['access-token']) {
          var currentUser =await base.CheckToken(req.headers['access-token']);
          if (currentUser) {
            try {
              if (await base.CheckAuthorization(currentUser, 'Turno', 'View', req.ip, res)) {
                console.log(currentUser);
                let usuarios = await User
                .find({
                  select: ['id','Name','LastName'],
                })
              .populate('Assistance',{where : {
                Eliminated:false
              }});
                res.status(200).json({
                    User: usuarios
                })
              } else {
                res.status(401).json({
                  error: "Acceso denegado"
                })
              }
            } catch (error) {
                sails.log.error(error)
              res.status(500).json({
                error: "Error al procesar datos"
              })
            }
          } else {
            return res.status(401).json({
              error: 'login invalido vuelva a loguearse.'
            });
          }
        } else {
          return res.status(401).json({
            error: 'Medidas de seguridad no ingresadas.'
          });
        }
      },
      Assist: async function (req, res) {
        var data = req.allParams();
        if (req.headers['access-token']) {
          var currentUser =await base.CheckToken(req.headers['access-token']);
          if (currentUser) {
            try {
              if (await base.CheckAuthorization(currentUser, 'Turno', 'View', req.ip, res)) {
                let usuarios = await User
                .find({
                  select: ['id','Name','LastName'],
                  where:{id: data.id}
                })
              .populate('Assistance',{where : {
                Eliminated:false
              }});
                res.status(200).json({
                    User: usuarios
                })
              } else {
                res.status(401).json({
                  error: "Acceso denegado"
                })
              }
            } catch (error) {
                sails.log.error(error)
              res.status(500).json({
                error: "Error al procesar datos"
              })
            }
          } else {
            return res.status(401).json({
              error: 'login invalido vuelva a loguearse.'
            });
          }
        } else {
          return res.status(401).json({
            error: 'Medidas de seguridad no ingresadas.'
          });
        }
      },
    createAssist: async function (req, res) {
    if (req.headers['access-token']) {
        var currentUser =await base.CheckToken(req.headers['access-token']);
        if (currentUser) {
        var data = req.body;
        
            if (!data.Asistencia.Date || !data.Asistencia.OutHour || !data.Asistencia.InHour||!data.Asistencia.User) {
            res.status(400).json({
                error: 'Faltan ingresar parametros'
            });
            } else {
            var usuario = await User.findOne({
                id: data.Asistencia.User
            });
            if(usuario == undefined){
                return res.status(404).json({
                    error:"no existe usuario"
                })
            }
            if (await base.CheckAuthorization(currentUser, 'Turno', 'Create', req.ip, res)) {
                try {
                    sails.log.info("[[asistenciaController.createassist]]se procede a crear asistencia")
                    var datos = {
                      Date : data.Asistencia.Date,
                      OutHour:data.Asistencia.OutHour,
                      InHour:data.Asistencia.InHour,
                      OutMinute:data.Asistencia.OutMinute,
                      InMinute:data.Asistencia.InMinute,
                    }
                   var asistencia = await Asistencia.create(datos).fetch()
                   sails.log.info("[[asistenciaController.createassist]]asistencia creada con el id "+asistencia.id)
                    await User.addToCollection(usuario.id, "Assistance")
                    .members(asistencia.id);
                    res.status(200).json({
                      message: "asistencia agregada para el usuario "+usuario.id
                    })
                } catch (error) {
                  res.status(500).json({
                    error:"error al guardar la asistencia"
                  })
                sails.log.debug(error)
                }
            } else {
                res.status(401).json({
                error: "Acceso denegado"
                })
            }
            }
        }
    } else {
        res.status(401).json({
        error: 'Medidas de seguridad no ingresadas.'
        });
    }
    },
    deleteAssist: async function (req, res) {
      if (req.headers['access-token']) {
          var currentUser =await base.CheckToken(req.headers['access-token']);
          if (currentUser) {
          var data = req.body;
              if (!data.id ) {
              res.status(400).json({
                  error: 'Faltan ingresar parametros'
              });
              } else {
              var asistencia = await Asistencia.findOne({
                  id: data.id
              });
              if(asistencia == undefined){
                  return res.status(400).json({
                      error:"no existe asistencia"
                  })
              }
              if (await base.CheckAuthorization(currentUser, 'Turno', 'Delete', req.ip, res)) {
                  try {
                      sails.log.info("[[asistenciaController.createassist]]se procede a eliminar asistencia")
                     var asistencia = await Asistencia.update({id:asistencia.id}).set({Eliminated:true});
                     sails.log.info("[[asistenciaController.createassist]]asistencia eliminada")
                      res.status(200).json({
                        message: "asistencia eliminada "
                      })
                  } catch (error) {
                    res.status(500).json({
                      error:"error al eliminar la asistencia"
                    })
                  sails.log.debug(error)
                  }
              } else {
                  res.status(401).json({
                  error: "Acceso denegado"
                  })
              }
              }
          }
      } else {
          res.status(401).json({
          error: 'Medidas de seguridad no ingresadas.'
          });
      }
      },
};

