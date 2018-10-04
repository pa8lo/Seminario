/**
 * RolController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const token = require('jsonwebtoken');
const secretMessage = require('../Secret');
module.exports = {
    rols :   function (req,res) {
        if(req.headers['access-token']){
            var accessToken = req.headers['access-token'];
            const currentUser = token.verify(accessToken,secretMessage.jwtSecret,(err, decoded) => {
                if (err) {
                    console.log(err)
                return null;
                }
                else {
                req.user = decoded;
                console.log(req.user)
                return req.user.Authorizations;
                }
            });
            if(currentUser){
                if(currentUser.Ip == req.ip){
                    if(currentUser.roles.Name === 'Admin'){
                        try {
                            Rol.find() 
                            .then(function(rol){
                                if(!rol || rol.length ==0){
                                        return res.send({
                                            'sucess': false,
                                            'message':' no existen Roles'
                                        })
                                }
                                return res.send({
                                    'roles': rol
                                })
                            })
                            .catch(function(err){
                                sails.log.debug(err)
                                return res.send({
                                    'sucess': false,
                                    'message':' Existio un problema para traer los roles'
                                })
                            })                        
                        } catch (error) {
                            res.status(500).json({error: "Acceso denegado"})
                        }
                    }else{
                        //sails.log.Info("el usuario "+currentUser.Name+"no tuvo permisos para ver los role");
                        res.status(500).json({error: "Acceso denegado"});
                    }
                    
                }else{
                    //sails.log.error("El usuario "+currentUser.name+"intento ingresar con un ip que no le correspondia");
                    res.status(500).json({error: "Acceso denegado"})
                }        

            }else{
                return res.status(400).json({ error: 'Acceso denegado.' });
            }    

        }else{
            return res.status(400).json({ error: 'Medidas de seguridad no ingresadas.' });
        }
    },

};

