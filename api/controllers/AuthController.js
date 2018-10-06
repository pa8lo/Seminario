/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var base = require('./BaseController.js');

module.exports = {

    Authorizations: function (req,res) {
        if(req.headers['access-token']){
            var currentUser = base.CheckToken(req.headers['access-token']);
            if(currentUser){
                try {
                    currentUser.Authorizations.forEach(Authorization => {
                        if(Authorization.Name =='Usuario'){
                            Permiso.find() 
                            .then(function(permiso){
                                 if(!permiso || permiso.length ==0){
                                        return res.send({
                                            'sucess': false,
                                            'message':' no existen Permisos'
                                        })
                                 }
                                 return  res.json(permiso)
                            })
                            .catch(function(err){
                                 sails.log.debug(err)
                                 return res.send({
                                    'sucess': false,
                                    'message':' no existe usuario'
                                })
                            })
                        }             
                    });               
                } catch (error) {
                    res.status(401).json({error: "Acceso denegado"})
                }
            }else{
                return res.status(401).json({ error: 'Acceso denegado.' });
            }    
            }else{
                return res.status(401).json({ error: 'Medidas de seguridad no ingresadas.' });
            }
        
    }

};

