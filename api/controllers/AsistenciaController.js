/**
 * AsistenciaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var base = require('./BaseController.js');
var _validaciones = require('./ValidacionController');

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
                  where: {Eliminated :false}
                })
              .populate('Assistance',{where : {
                Eliminated:false
                },
                sort: 'InTime DESC',

            });
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
                },
                sort: 'InTime DESC'
              });
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
    AssistByJwT: async function (req,res){
      try {
        let currentUser = await _validaciones.CheckToken(req.headers['access-token']);
        sails.log.debug("se proceden a buscar las asistencias del siguiente token ")
        sails.log.debug(currentUser)
        let asistencias = await User
        .find({
          select: ['id','Name','LastName'],
          where:{id: currentUser.Id}
        })
      .populate('Assistance',{where : {
        Eliminated:false
        },
        sort: 'InTime DESC'
      });
      sails.log.debug("se encontraron lassiguientes asistencias")
      sails.log.debug(asistencias)
      res.status(200).json(asistencias)
    }catch(err){
      sails.log.error(JSON.stringify(err))
      res.status(200).json(err);
    }

    }, 
    createAssist: async function (req, res) {
      try {
        let currentUser = await _validaciones.validarRequest(req,'Turno','Create');
        var data = req.body;
        var usuario = await User.findOne({id: data.Asistencia.User});
        let validaciones = _validaciones.ValidarExistenciaLogin(usuario);
        sails.log.info("[[asistenciaController.createassist]]se procede a crear asistencia")
        let fecha =data.Asistencia.InTime.split("/")
        let hora = fecha[2].split(" ");
        let horaParseada = hora[1].split(":")
        let fechacompleta = new Date(hora[0],fecha[1]-1,fecha[0],horaParseada[0].trim(),horaParseada[1],horaParseada[2],horaParseada[3])
        sails.log.info(fechacompleta);
        var datos = {
          OutTime:fechacompleta,
          InTime:fechacompleta,
          User: data.Asistencia.User
        }
        var asistencia = await Asistencia.create(datos).fetch()
        sails.log.info("[[asistenciaController.createassist]]asistencia creada con el id "+asistencia.id)
        await User.addToCollection(usuario.id, "Assistance")
        .members(asistencia.id);
        res.status(200).json({
          message: "asistencia agregada para el usuario "+usuario.id
        })
      } catch (err) {
        sails.log.error("error" + JSON.stringify(err))
        res.status(err.code).json(err.message);
      }  
    },

    updateAsisst: async function (req, res) {
      try {
        let currentUser = await _validaciones.validarRequest(req,'Turno','Edit');
        sails.log.debug("se ingresaron los siguientes datos ")
        sails.log.debug(req.body)
        var data = req.body;
        var asistenciaExistente = await Asistencia.findOne({id: data.Asistencia.id});
        let validaciones = _validaciones.ValidarExistenciaLogin(asistenciaExistente);
        sails.log.info("[[asistenciaController.createassist]]se procede a crear asistencia") 
        let fecha =data.Asistencia.InTime.split("/")
        let hora = fecha[2].split(" ");
        let horaParseada = hora[1].split(":")
        let fechacompleta = new Date(hora[0],fecha[1]-1,fecha[0],horaParseada[0],horaParseada[1],horaParseada[2],00)
        let fechasalida =data.Asistencia.OutTime.split("/")
        let horasalida = fechasalida[2].split(" ");
        let horaParseadasalida = horasalida[1].split(":")
        let fechacompletasalida = new Date(horasalida[0],fechasalida[1]-1,fechasalida[0],horaParseadasalida[0],horaParseadasalida[1],horaParseadasalida[2],00)
        sails.log.info(fechacompleta);
        let datos = {
          OutTime:fechacompletasalida,
          InTime:fechacompleta,
        }
        let asistencia = await Asistencia.update({
          id: data.Asistencia.id
        })
          .set(datos).fetch();
        sails.log.info("[[asistenciaController.createassist]]asistencia modificada ")
        res.status(200).json({
          message: asistencia
        })
      } catch (err) {
        sails.log.error("error" + JSON.stringify(err))
        res.status(err.code).json(err.message);
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


