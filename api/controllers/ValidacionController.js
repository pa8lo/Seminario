/**
 * ValidacionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const jwt = require('jsonwebtoken');
const secretMessage = require('../Secret');
var messages = require("../globals/index");
var _error =  require("./ErrorController");

module.exports = {
   
     
    
    ValidarEntidad : function (entidad,mensaje){
        if(!entidad || entidad.length ==0){
            throw _error.GenerateError('no existe/n '+mensaje,404) 
        }
    },
    ValidarCantidadUsuariosEncontrados(cantidadEnviado,cantidadEncontrado){
        if(cantidadEnviado != cantidadEncontrado){
            throw _error.GenerateError('no existen uno o varios usuarios que se quieren asignar',400) 
        }
    },
    validarRequest:async  function (req,CategoriaPermiso,NombrePermiso){
        let currentuser = await CheckToken(req.headers['access-token']);
        sails.log.info(currentuser)
        let validacion = await ValidarIp(currentuser.Ip,req.ip);
        validacion = await CheckAuthorization(currentuser,CategoriaPermiso,NombrePermiso);
        return currentuser;
    },
    ValidarRequestLogin:function(data){
        if (!data.Dni || !data.Password){
            throw _error.GenerateError("faltan ingresar parametros",400) 
        }
    },
    ValidarExistenciaLogin: function(user){
        if(!user || user.length ==0){
            throw _error.GenerateError("Se han ingresado datos erroneos",401) 
        }
    },
    ValidarDatosLogin:function (inputPassword, userPassword){
        if (inputPassword != userPassword){
            throw _error.GenerateError("Se han ingresado datos erroneos",401) 
        }
    },
    validarRequestEliminarEntidad:function(id){
        if (!id) {
            throw _error.GenerateError("faltan ingresar parametros",400) 
            } 
    },
    validarRequestCrearTurno: function(data){
        if (!data.Turno.OutHour || !data.Turno.InHour) {
            throw _error.GenerateError("faltan ingresar parametros",400) 
            } 
    },
    validarRequestCrearUsuario : function(){
        if(!data.User.Dni || !data.User.Password || !data.User.Name){
            throw _error.GenerateError("faltan ingresar parametros",400) 
        }
    },
    validarExistencia: async function(_campo,_entidad){
        let entidad = await _entidad.find(_campo)
        if (entidad.length > 0){
            throw _error.GenerateError('ya existe el elemento :  '+JSON.stringify(_campo),400) 
        }
    },
    validarExistenciaEliminar: async function(_campo,_entidad){
        let entidad = await _entidad.find(_campo)
        if (entidad.length == 0){
            throw _error.GenerateError('no existe el elemento :  '+JSON.stringify(_campo),400) 
        }
    }

};
     function CheckToken(token){ 
        sails.log.info("se procede a chequear el token "+token)
        var accessToken = token;            
        var tokenDecode = jwt.verify(accessToken,secretMessage.jwtSecret,(err, decoded) => {
            if (err) {                            
                throw _error.GenerateError('jwt invalido',401)                                                                           
                }
                else {                
                var user = decoded;         
                sails.log.info("se devuelve la informacion : "+JSON.stringify(user));
                return user;                
                }
            });
            return tokenDecode;
      }
     function ValidarIp(ipToken,ipRequest){
        if(ipToken !== ipRequest){

            sails.log.error("el usuario quiso acceder con uns numero de ip erroneo" + ipToken);
            throw _error.GenerateError('numero de ip incorrecto',401);
        }
    }
               /**
    * Controla si el usuario tiene todos los permisos necesarios
    * @param {*} CurrentUser  el perfil del usuario
    * @param {*} CategoriaPermiso  la categoria  del permiso que se desea comprobar
    * @param {*} NombrePermiso  el nombre  del permiso que se desea comprobar
    * @param {*} ip  el ip que viene en el req
    * @param {*} re  respuesta del servidor
    */
   async function CheckAuthorization (CurrentUser,CategoriaPermiso,NombrePermiso) {
           sails.log.info("se procede a verificar los permisos del usuario "+JSON.stringify(CurrentUser))
           var existeModelo =await User.findOne({id: CurrentUser.Id}).populate('Authorizations',{Name: NombrePermiso,Type: CategoriaPermiso}); 
           if(!existeModelo || existeModelo.length == 0){
               sails.log.info("acceso denegado")
               throw _error.GenerateError('acceso denegado',401) 
           }
   }

