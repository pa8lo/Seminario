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
            var currentUser = base.CheckToken(req.headers['access-token']);
            if(currentUser){
                try{
                    if(base.CheckAuthorization(currentUser,'Roles','View',req.ip)){
                         base.SeeElements(Rol,"Rol",res);
                    }else{
                        res.status(401).json({error: "Acceso denegado"})
                    }                        
                } catch (error) {
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
                if(base.CheckAuthorization(currentUser,'Rol','Delete',req.ip)){
                    base.RemoveAuthorization(req.body,Rol,'Authorizations',res);
                }else{
                    res.status(401).json({Error: "Acceso denegado"})
                }
            }
        }else{
            return res.status(401).json({erros : 'Medidas de seguridad no ingresadas.'})
        }
    },

    CreateRol: function (req,res){
        if(req.headers['access-token']){                       
            var tokenDecode = base.CheckToken(req.headers['access-token']);               
            if(tokenDecode){       
                if(base.CheckAuthorization(currentUser,'Rol','Create',req.ip)){
                    var data = req.body
                    Rol.Create(data);
                }else{
                    res.status(401).json({error:"Acceso denegado"})
                }
            }else{
                sails.log.Info("El usuario  de id : "+ tokenDecode.Id + "quiso acceder desde un ip erroneo.");
                res.status(403).json({error: "Acceso denegado"})
            }                                      
            }
        },
           
    

};

