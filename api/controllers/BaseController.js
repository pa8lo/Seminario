/**
 * BaseController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const jwt = require('jsonwebtoken');
const secretMessage = require('../Secret');

module.exports = {

    CheckToken:function (token){        
        var accessToken = token;            
        var tokenDecode = jwt.verify(accessToken,secretMessage.jwtSecret,(err, decoded) => {
            if (err) {                
                console.log(err)                
                return null;                                                                            
                }
                else {                
                var user = decoded;                                                                           
                return user;                
                }
            });
            return tokenDecode;
        },
     
    CheckAuthorization: async function (CurrentUser,CategoriaPermiso,NombrePermiso,ip) {
        if(CurrentUser.ip === ip){
            await CurrentUser.Authorizations.forEach(Authorization => {
                (Authorization.Name === NombrePermiso && Authorization.Type === CategoriaPermiso) ? "ok" :  false;        
            });
        }else{
            //sails.log.Info("El usuario  de id : "+ CurrentUser.Id + "quiso acceder desde un ip erroneo.");
            return false;
        }

    },

    SeeElements: function (Element,Mensaje,res){
        Element.find() 
        .then(function(data){
             if(!data || data.length ==0){
                    return res.send({
                        'sucess': false,
                        'message':' no existen '+Mensaje
                    })
             }
             return  res.json(data)
        })
        .catch(function(err){
             sails.log.debug(err)
             return res.send({
                'sucess': false,
                'message':' no existe '+Mensaje
            })
        })
    }    

                 

};

