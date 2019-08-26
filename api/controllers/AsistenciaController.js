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
                let asistencias = await Asistencia.find();
                res.status(200).json({
                    asistencias
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
        
        sails.log.info("[[asistenciaController.createassist]]se encontro el usuario "+JSON.stringify(usuario))
            if (!data.Asistencia.Date || !data.Asistencia.OutTime || !data.Asistencia.InTime||!data.Asistencia.User) {
            res.status(400).json({
                error: 'Faltan ingresar parametros'
            });
            } else {
            var usuario = await User.findOne({
                id: data.Asistencia.User
            });
            if(usuario == undefined){
                return res.status(400).json({
                    error:"no existe usuario"
                })
            }
            if (await base.CheckAuthorization(currentUser, 'Turno', 'Create', req.ip, res)) {
                try {
                    sails.log.info("[[asistenciaController.createassist]]se procede a crear asistencia")
                   var asistencia = await Asistencia.create(data.Asistencia).fetch()
                   sails.log.info("[[asistenciaController.createassist]]asistencia creada con el id "+asistencia.id)
                    await User.addToCollection(asistencia.id, "AsignedTurns")
                    .members(usuario.id);
                } catch (error) {
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

