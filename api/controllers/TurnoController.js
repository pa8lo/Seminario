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
            validacion = await _validaciones.validarExistencia({Name : data.Turno.Name,Eliminated:false},Turno);
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
            let validacion =  await _validaciones.validarRequestIdEntidad(data.id);
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
        try{
            let currentuser = await _validaciones.validarRequest(req,"Turno","Edit");
            var data = req.body
            var turnoAsignado = await TurnosAsignados.find({id: data.Date})
            var usuario = await User.find({id:data.User})
            validacion = _validaciones.ValidarEntidad(turnoAsignado,'turno')
            validacion = _validaciones.ValidarCantidadUsuariosEncontrados(data.User.length,usuario.length)
            sails.log.info(turnoAsignado);
            await TurnosAsignados.addToCollection(data.Date,'Users')
            .members(data.User);
            res.status(200).json({message:'Se agregaron los usuarios' + JSON.stringify(usuario)})
        }catch(err){
            console.log(err)
            sails.log.error("error"+JSON.stringify(err))
            res.status(err.code).json(err.message);
        }
    },
    deallocate: async function (req, res) {
        try{
            let currentuser = await _validaciones.validarRequest(req,"Turno","Delete");
            var data = req.body
            let validacion = await _validaciones.validarRequestIdEntidad(data.Turno);
            validacion = await _validaciones.validarRequestIdEntidad(data.User);
            var turnoAsignado = await TurnosAsignados.find({
             id: data.Turno,
             }).populate('Users');
             validacion = _validaciones.ValidarEntidad(turnoAsignado,"Turno asignado");
             await TurnosAsignados.removeFromCollection(data.Turno,'Users')
             .members(data.User);
             sails.log.info("el usuario :"+data.User+" fue removido del turno : "+turnoAsignado.id);
             res.status(200).json({message:"usuario removido del turno con exito"})
        }catch(err){
            sails.log.error("error"+JSON.stringify(err))
            res.status(err.code).json(err.message);
        }
    }
};

