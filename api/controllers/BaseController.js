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
     
    CheckAuthorization: function (authorizations) {
        authorizations.forEach(Authorization => {
            if(Authorization.Name =='Usuario'){
                User.find() 
                .then(function(user){
                     if(!user || user.length ==0){
                            return {
                                'sucess': false,
                                'message':' no existen usuarios'
                            }
                     }
                     return  user
                })
                .catch(function(err){
                     sails.log.debug(err)
                     return {
                        'sucess': false,
                        'message':' no existe usuario'
                    }
                })
            }             
        });
    }    

                 

};

