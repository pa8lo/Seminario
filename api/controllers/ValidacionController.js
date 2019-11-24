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
    ValidarToken:async function(req){
        if(req.headers['access-token']){
            let currentuser = await CheckToken(req.headers['access-token']);
            return currentuser
        }else{
            throw _error.GenerateError("Medidas de seguridad no ingresadas",401) 
        }
    },

    ValidarRequestLogin:function(data){
        if (!data.Dni || !data.Password){
            throw _error.GenerateError("faltan ingresar parametros",400) 
        }
    },
    ValidarRequestCrearAsistencia:function(data){
        if(!data.Asistencia.InTime || !data.Asistencia.User){
            throw _error.GenerateError("faltan ingresar parametros",400) 
        }
        ValidarFecha(sails.moment(data.Asistencia.InTime));
    },
    ValidarRequestBuscarxDelivery(id){
        if(!id || id.length == 0 || id == 0){
            throw _error.GenerateError("faltan ingresar parametros",400) 
        }
        sails.log.info("parametros ingresados correctamente")
    },
    ValidarExistenciaLogin: function(user){
        if(!user || user.length ==0){
            throw _error.GenerateError("Se han ingresado datos erroneos",401) 
        }
    },
    ValidarProductoxPedido: function(productosxpedido){
        let errors = false;
        console.log(JSON.stringify(productosxpedido))
        productosxpedido.forEach(productoxpedido => {
            console.log(JSON.stringify(productoxpedido.Product))
            sails.log.info("se procede a validar producto por pedido : " + productoxpedido)
            if(!productoxpedido.Product || productoxpedido.Product.length == 0  || productoxpedido.Count.length == 0 ){
                errors = true
            }
        })
        if(errors){
            throw _error.GenerateError("faltan ingresar parametros de algun producto",400)  
        }
        
    },
    ValidarComboxPedido: function(combosxpedido){
        let errors = false;
        console.log(JSON.stringify(combosxpedido))
        combosxpedido.forEach(comboxpedido => {
            console.log(JSON.stringify(comboxpedido.Product))
            sails.log.info("se procede a validar combo por pedido : " + comboxpedido)
            if(!comboxpedido.Offer || comboxpedido.Offer.length == 0  || comboxpedido.Count.length == 0 ){
                errors = true
            }
        })
        if(errors){
            throw _error.GenerateError("faltan ingresar parametros de algun producto",400)  
        }
        
    },
    ValidarFechaAsistencia: function(_asistencia,_asistenciaExistente){
        let horarioIngreso;
        let horarioSalida ;
        if(_asistencia.InTime){
            horarioIngreso =sails.moment(_asistencia.InTime);
        }else{
            horarioIngreso= sails.moment(_asistenciaExistente.InTime);
        }
        if(_asistencia.OutTime){
            horarioSalida = sails.moment(_asistencia.OutTime);
        }else{
            horarioSalida = sails.moment(_asistenciaExistente.OutTime)
        }
        ValidarFecha(horarioIngreso);
        ValidarFecha(horarioSalida)
        return DevolverDiferencia(horarioIngreso,horarioSalida);

    },
    ValidarDatosLogin:function (inputPassword, userPassword){
        if (inputPassword != userPassword){
            throw _error.GenerateError("Se han ingresado datos erroneos",401) 
        }
    },
    validarRequestIdEntidad:function(id){
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
    function DevolverDiferencia(_fechaIngreso,_fechaSalida){
        let minutosDiferencia = _fechaSalida.diff(_fechaIngreso, 'minutes');
        let diferencia = {
            horas: Math.trunc(minutosDiferencia/60),
            minutos:minutosDiferencia%60
        }
        if (diferencia<=0){
            throw _error.GenerateError("La fecha de salida no puede ser menor o igual a la de entrada",400)
        }
        return diferencia;
    }
    function ValidarFecha(fecha){
        if(!fecha.isValid()){
            throw _error.GenerateError("fecha invalida se espera DD/MM/YYYY HH:MM:SS:MS",400) 
        }
    }
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

