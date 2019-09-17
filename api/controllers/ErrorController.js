/**
 * ErrorController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
   GenerateError: function  (mensaje,tipo){ 
            var error =  {
                message: mensaje,
                code:tipo    
            }
            // error.name = tipo;
            return error;
   },
   GenerateErrorResponse: function( objetoRespuesta,objetoError){
    objetoRespuesta.mensaje = objetoError.message;
    objetoRespuesta.estado = objetoError.code
   }

};

