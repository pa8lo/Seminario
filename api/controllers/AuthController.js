/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var base = require('./BaseController.js');

module.exports = {

     Authorizations:async function (req,res) {
         let errores =[];
         let status = 200;
         let permisos;
        if(req.headers['access-token']){
            var currentUser = await base.CheckToken(req.headers['access-token']);
            if(currentUser){
                try {
                        if(await base.CheckAuthorization(currentUser,'Authorization','View',req.ip,res)){
                           var permiso = await Permiso.find().sort('id ASC')
                           sails.log.info("se encontraron los siguiente permisos"+JSON.stringify(permiso))
                                 if(permiso.length ==0){
                                     errores.push('existio un problema tecnico con los permisos');
                                     status=500
                                 }else{
                                     status=200
                                     permisos= permiso;
                                 }
                        }             
                } catch (error) {
                    sails.log.error(JSON.stringify(error))
                    errores.push('problemas en el servidor')
                    status=500
                }
            }else{
                status=401;
                errores.push('Acceso denegado');
            }    
            }else{
                status=401;
                errores.push('Medidas de seguridad no ingresadas')
            }
        if(errores == 0){
            res.status(status).json(permisos)
        }else{
            res.status(status).json(errores)
        }    
        
    }

};

