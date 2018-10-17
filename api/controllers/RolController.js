/**
 * RolController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const token = require('jsonwebtoken');
const secretMessage = require('../Secret');
var base = require('./BaseController.js');
module.exports = {
    rols :   function (req,res) {
        if(req.headers['access-token']){
            var accessToken = base.CheckToken(req.headers['access-token']);
            if(accessToken){
                if(accessToken.Ip == req.ip){
                //    if(accessToken.roles.Name === 'Admin'){
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
                   // }else{
                        //sails.log.Info("el usuario "+currentUser.Name+"no tuvo permisos para ver los role");
                  //      res.status(500).json({error: "Acceso denegado"});
                  // }
                    
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

    RemoveAuthorization:async function (req,res){
        if(req.headers['access-token']){ 
            var currentUser = base.CheckToken(req.headers['access-token']);
            if(currentUser){
            await Rol.removeFromCollection(data.Rol.id, 'Authorizations')
            .members(data.Authorizations.id);
            }
        }else{
            return res.status(401).json({erros : 'Medidas de seguridad no ingresadas.'})
        }
    },

    CreateRol: function (req,res){
        if(req.headers['access-token']){                       
            var tokenDecode = base.CheckToken(req.headers['access-token']);               
            if(tokenDecode){       
                if(tokenDecode.Ip === req.ip){
                var rol = req.body;
                try {

                /*    var domicilio = await Domicilio.create({
                        id:user.Adress.id,
                        Adress:user.Adress.Adress,
                        Department:user.Adress.Department,
                        Floor:user.Adress.Floor,
                    }).fetch();
                    var usuario = await  User.create(user.User).fetch();
                    await Domicilio.addToCollection( usuario.id, 'User')
                    .members(domicilio.id);*/               
                } catch (error) {
                    sails.log.debug(error)
                }                                                                       
            }else{
                sails.log.Info("El usuario  de id : "+ tokenDecode.Id + "quiso acceder desde un ip erroneo.");
                res.status(403).json({error: "Acceso denegado"})
            }                                      
            }
        }
    },       
    

};

