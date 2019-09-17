/**
 * TurnoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var base = require('./BaseController.js');
var _validaciones = require('./ValidacionController');
module.exports = {
    turns: async function(req,res){
        try{
            let currentuser = await _validaciones.validarRequest(req,"Turno","View");
            let turnos = await Turno.find({Eliminated:false});
            validacion = _validaciones.ValidarEntidad(turnos,'turnos')
            res.status(200).json(turnos);
        }catch(err){
            console.log(err)
            sails.log.error("error"+JSON.stringify(err))
            res.status(err.code).json(err.message);
        }
    },
    assignedTurns: async function (req, res) {
        try{
            let currentuser = await _validaciones.validarRequest(req,"Turno","View");
            let turnos = await TurnosAsignados
                .find()
                .populate('Turn')
                .populate('Users')
                .sort('id ASC')
            sails.log.info("se encontraron los siguiente turnos"+JSON.stringify(turnos))
            let validacion = _validaciones.ValidarEntidad(turnos,'turnos')
            res.status(200).json(turnos);
        }catch(err){
            console.log(err)
            sails.log.error("error"+JSON.stringify(err))
            res.status(err.code).json(err.message);
        }
    },
    createTurn: async function (req, res) {
        try{
            let currentuser = await _validaciones.validarRequest(req,"Turno","Create");
            var data = req.body;
            let validacion =  await _validaciones.validarRequestCrearTurno(data);
            validacion = await _validaciones.validarExistencia({Name : data.Turno.Name},Turno);
            sails.log.info("[[TurnoController.createassist]]se procede a crear el turno")
            var turno = await Turno.create(data.Turno).fetch()
            res.status(200).json({
                message: "turno creado exitosamente",
                Turno : turno
            })
        }catch(err){
            console.log(err)
            sails.log.error("error"+JSON.stringify(err))
            res.status(err.code).json(err.message);
        }

    },
    deleteTurn: async function (req, res) {
        try{
            let currentuser = await _validaciones.validarRequest(req,"Turno","Delete");
            var data = req.body;
            let validacion =  await _validaciones.validarRequestEliminarEntidad(data.id);
            validacion = await _validaciones.validarExistenciaEliminar({id : data.id},Turno);
            sails.log.info("[[turnoController.createassist]]se procede a eliminar turno")
            var turno = await Turno.update({id:data.id}).set({Eliminated:true});
            sails.log.info("[[turnoController.createassist]]turno eliminado")
            res.status(200).json({
                message: "turno eliminado"
            })
        }catch(err){
            console.log(err)
            sails.log.error("error"+JSON.stringify(err))
            res.status(err.code).json(err.message);
        }
       
    },
    assignDate: async function (req, res) {
        try{
            let currentuser = await _validaciones.validarRequest(req,"Turno","Edit");
            var data = req.body
            var turnoAsignado = await TurnosAsignados.create({
            Date: data.Date,
            Turn:data.Turno
            }).fetch()
            sails.log.info(turnoAsignado)
            res.status(200).json(turnoAsignado)
        }catch(err){
            console.log(err)
            sails.log.error("error"+JSON.stringify(err))
            res.status(err.code).json(err.message);
        }
    },
    assignUser: async function (req, res) {
        let mensajes =[];
        let status = 200;
        let turnos;
       if(req.headers['access-token']){
           var currentUser = await base.CheckToken(req.headers['access-token']);
           if(currentUser){
               try {
                   var data = req.body
                        if(await base.CheckAuthorization(currentUser,'Turno','Edit',req.ip,res)){
                            var turnoAsignado = await TurnosAsignados.find({
                                id: data.Date,
                                })
                            var usuario = await User.find({id:data.User})
                            sails.log.info("usuarios encontradod: "+usuario.length +" usuarios en request : "+ data.User.length);    
                                if(turnoAsignado && turnoAsignado.length >0 && data.User.length == usuario.length){
                                sails.log.info(turnoAsignado);
                                await TurnosAsignados.addToCollection(data.Date,'Users')
                                .members(data.User);
                                mensajes.push("se asigno el turno correctamente");
                            }else{
                                sails.log.error("No existe turno o usuario asignado");
                                mensajes.push("No existe turno o usuario asignado");
                                status=404
                            }
                        }else{
                            sails.log.error("Acceso denegado");
                            mensajes.push("Acceso denegado");
                            status=401
                        }
                    }catch(error){
                        sails.log.error("ocurrio un error : "+error);
                        mensajes.push("existio un problema en el servidor");
                        status=500
                    }
                }else{
                    sails.log.error("Fallo la vericación del token")
                    status=401;
                    mensajes.push("acceso denegado")
                }
            }else{
                sails.log.error("no se ingresaron medidas de seguridad");
                status=401;
                mensajes.push("faltan ingresar medidas de seguridas")
            }
            res.status(status).json(mensajes);
        },
    deallocate: async function (req, res) {
        let mensajes =[];
        let status = 200;
       if(req.headers['access-token']){
           var currentUser = await base.CheckToken(req.headers['access-token']);
           if(currentUser){
               try {
                   var data = req.body
                       if(await base.CheckAuthorization(currentUser,'Turno','Delete',req.ip,res)){
                        var turnoAsignado = await TurnosAsignados.find({
                            id: data.Turno,
                           }).populate('Users');
                           if(!turnoAsignado || turnoAsignado.length ==0 ){
                            sails.log.error("No existe turno");
                            mensajes.push("No existe el turno asignado");
                            status=404
                           }else{
                            sails.log.info("se procede a eliminar el turno asignado :"+JSON.stringify(turnoAsignado));
                            await TurnosAsignados.removeFromCollection(data.Turno,'Users')
                            .members(data.User);
                            sails.log.info("el usuario :"+data.User+" fue removido del turno : "+turnoAsignado.id);
                           }
                    }else{
                        sails.log.error("Acceso denegado");
                        mensajes.push("Acceso denegado");
                        status=401
                    }
                 }catch(error){
                     sails.log.error("ocurrio un error : "+error);
                     mensajes.push("existio un problema en el servidor");
                     status=500
                 }
             }else{
                 sails.log.error("Fallo la vericación del token")
                 status=401;
                 mensajes.push("acceso denegado")
             }
         }else{
             sails.log.error("no se ingresaron medidas de seguridad");
             status=401;
             mensajes.push("faltan ingresar medidas de seguridas")
         }
         res.status(status).json(mensajes)
        }
};

