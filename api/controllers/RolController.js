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
                    if(base.CheckAuthorization(currentUser,'Rol','View',req.ip,res)){
                         base.SeeElements(Rol,"Rol",res);
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

    AssignAuthorizations:async  function (req,res,ModeloPrincipal,data) {
        if(req.headers['access-token']){ 
                var currentUser = base.CheckToken(req.headers['access-token']);
                if(currentUser){
                   
                var reqUser = req.body;
                reqUser.Authorizations.forEach(async Authorization    => {
                    console.log(Authorization);
                    if (base.CheckAuthorization(currentUser,'Authorization','Assign',req.ip,res)){
                    await Rol.addToCollection(Authorization, 'Authorizations')
                    .members(reqUser.rol.id);
                    }  
                 });
                res.status(200).json({message : 'ok.'})
               
            }
        }else{
             res.status(401).json({erros : 'Medidas de seguridad no ingresadas.'})
        }
    },

    RemoveAuthorizations:async function (req,res){
        if(req.headers['access-token']){
            var currentUser = base.CheckToken(req.headers['access-token']);
                if(await base.CheckAuthorization(currentUser,'Rol','Edit',req.ip,res)){
                    var reqUser = req.body;
                    reqUser.Authorizations.forEach(Authorization   => {
                
                        var data = {
                            modeloPrincipal:{
                                id:reqUser.rol
                            },
                            modeloSecundario:{
                                id:Authorization
                            }
                        };
                        base.RemoveAuthorization(data,Rol,'Authorizations',res)
                    });
                    res.status(200).json({message : 'ok'})
            }else{
                res.status(401).json({error:'Permiso denegado'});
            }
        }else{
            return res.status(401).json({erros : 'Medidas de seguridad no ingresadas.'})
        }
    },

    CreateRol: async function (req,res){
        if(req.headers['access-token']){                       
            var currentUser = base.CheckToken(req.headers['access-token']);               
            if(currentUser){       
                if(base.CheckAuthorization(currentUser,'Rol','Create',req.ip,res)){
                    var data = req.body
                  try {
                     var rol = await Rol.create(data).fetch();
                    res.status(200).json({idRol:rol.id})
                  } catch (error) {
                    sails.log.Info("Existio un error al crear el rol : "+ error);
                    res.status(500).json({error:"Existio un problema al crear rol"})
                  }  
                }
            }else{
                sails.log.Info("El usuario  de id : "+ tokenDecode.Id + "quiso acceder desde un ip erroneo.");
                res.status(403).json({error: "Acceso denegado"})
            }                                      
            }
        },
        UpdateAuthorizations: async function (idUser,IdRol){
            var rol =await Rol.findOne({id : IdRol}).populate('Authorizations');
            try{
                await rol.Authorizations.forEach(async Auth => {
                await User.addToCollection(idUser , 'Authorizations')
                .members(Auth.id);  
                })
            }catch(error){
                sails.log.debug(error);
            }
        }   
    

};

