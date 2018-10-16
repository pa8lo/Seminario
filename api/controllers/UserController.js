/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const token = require('jsonwebtoken');
const secretMessage = require('../Secret');
var base = require('./BaseController.js');


module.exports = {
    //traigo todos los usuarios.
    users :   function (req,res) {
        if(req.headers['access-token']){
        var currentUser = base.CheckToken(req.headers['access-token']);
        if(currentUser){
            try {
                currentUser.Authorizations.forEach(Authorization => {
                    if(Authorization.Name =='Usuario'){
                        User.find() 
                        .then(function(user){
                             if(!user || user.length ==0){
                                    return res.send({
                                        'sucess': false,
                                        'message':' no existen usuarios'
                                    })
                             }
                             return  res.json(user)
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
    },

    DeleteUser :  async function (req,res) {
            if(req.headers['access-token']){
            const currentUser = base.CheckToken(req.headers['access-token']);
                if(currentUser){
                    if(currentUser.Ip == req.ip){
                        var data = req.body;
                        try{
                            var destruido = await User.update({id:data.id})
                                                      .set({Eliminated:true}).fetch();                                               
                            if (destruido.length === 0) {
                               // sails.log.Error('Se intento borrar usuario con id :'+data.id+" pero no existia alguno con ese id");
                                res.status(204).json({ error: 'No existe usuario.' });
                            } else {
                              // sails.log.Info('Se elimino usuario con id:'+data.id, destruido[0]);
                                console.log("exito");
                                res.status(200).json({ message: 'Usuario eliminado.' });
                                
                            }

                        }catch(error){
                            //sails.log.Error("El usuario  de id : "+ currentUser.Id + "quiso acceder desde un ip erroneo.");
                            return res.status(500).json({ error: 'Existio un problema al eliminar usuario' +error });
                        }

                    }else{
                        sails.log.Info("El usuario  de id : "+ currentUser.Id + "quiso acceder desde un ip erroneo.");
                        return res.status(401).json({ error: 'Acceso denegado.' });
                    } 
                    
                }else{
                    return res.status(401).json({ error: 'Acceso denegado.' });
                } 

            }else{
                return res.status(401).json({ error: 'Medidas de seguridad no ingresadas.' });
            }
    },
    //Devuelvo Los datos del usuario decodificados del token
          currentUser: async function(req,res){
            try {    
                    const tokenDecode = base.CheckToken(req.headers['access-token']);
                    return res.send({
                        'sucess': true,
                        'User':tokenDecode,
                    })

                } catch (error) {
                    res.status(401).json({error: "Falta ingresar token de seguridad"})
                }
                
            },

            createUser: async function(req,res){
                
                                if(req.headers['access-token']){                       
                                    var tokenDecode = base.CheckToken(req.headers['access-token']);               
                                    if(tokenDecode){       
                                        if(tokenDecode.Ip === req.ip){
                                        console.log("token Correcto")
                                              
                                        var user = req.body;
                                        console.log("LOS DATOS  "+JSON.stringify(user));
                                        try {

                                            var domicilio = await Domicilio.create({
                                                id:user.Adress.id,
                                                Adress:user.Adress.Adress,
                                                Department:user.Adress.Department,
                                                Floor:user.Adress.Floor,
                                            }).fetch();
                                            var usuario = await  User.create(user.User).fetch();
                                            await Domicilio.addToCollection( usuario.id, 'User')
                                            .members(domicilio.id);                   
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
                        
    login : async function(req,res){
        try {
            //Traigo todos los datos del request y controlo que existan los necesarios
            const data = req.allParams();
            if(!data.Dni || !data.Password){
            return res.status(400).json({ error: 'Faltan ingresar parametros' });
            }
            try{
                //Busco un usuario que coincida y Inflo el atributo rols
                const user = await User.findOne({Dni: data.Dni.trim()}).decrypt().populate('Rols').populate('Authorizations');
                if(!user){
                    return res.status(400).json({ error: 'Ha ingresado datos erroneos' });
                }
                try{
                    if(user.Password == data.Password){
                        const userToken = token.sign({Name: user.Name, Id: user.id, Authorizations: user.Authorizations,Ip:req.ip}, secretMessage.jwtSecret);
                        return res.status(200).json({
                            user:{
                                Name:user.Name,
                                Rol:user.Rol
                            }, 
                            token: userToken
                    })
                    }else{
                        return res.status(402).json({ error: 'Ha ingresado datos erroneos' });
                    }
                }catch(err){
                    console.log(err)
                }
            }catch(err){
                console.log(err)
            }    
       } catch (error) {
           res.status(500).json({error:'Hubo un problema con el logueo, revisar parametros'});
        }
    },

    UserAuthorizations: async function (req,res) {
        var parametros = req.allParams();
        if(req.headers['access-token']){  
                var currentUser = base.CheckToken(req.headers['access-token']);
            if(currentUser){
                try {
                    var usuario = await User.findOne({id:parametros.id}).populate('Authorizations');
                    res.status(200).json({Authorizations : usuario.Authorizations});
                }catch(error){
                    console.log(error);
                    res.status(500).json({error: "existio un problema para mostrar los permisos"})
                }               
            }else{
                return res.status(401).json({ error: 'Medidas de seguridad no ingresadas.' });
            }
            
        }
    },

    RemoveAuthorization: async function (req,res) {
        if(req.headers['access-token']){ 
            var currentUser = base.CheckToken(req.headers['access-token']);
            if(currentUser){
            await User.removeFromCollection(data.User.id, 'Authorizations')
            .members(data.Authorizations.id);
            }
        }else{
            return res.status(401).json({erros : 'Medidas de seguridad no ingresadas.'})
        }
    },

    AssignAuthorization:async  function (req,res) {
        if(req.headers['access-token']){ 
            var currentUser = base.CheckToken(req.headers['access-token']);
            if(currentUser){
            await User.addToCollection( data.Authorization.id, 'Authorizations')
            .members(data.User.id);  
            }  
        }else{
            return res.status(401).json({erros : 'Medidas de seguridad no ingresadas.'})
        }
    },

    UpdateUser: async function (req,res) {
        if(req.headers['access-token']){ 
        var currentUser = base.CheckToken(req.headers['access-token']);
            if(currentUser){
                var usuario = await User.update({id:data.User.id})
                .set(data.User).fetch();                                                             
                if (usuario.length === 0) {
                // sails.log.Error('Se intento borrar usuario con id :'+data.id+" pero no existia alguno con ese id");
                res.status(204).json({ error: 'No existe usuario.' });
                } else {
                // sails.log.Info('Se elimino usuario con id:'+data.id, usuario[0]);
                Data.Adress.forEach(domicilio => {
                   var address = await Domicilio.update({id:domicilio.id})
                   .set(domicilio).fetch();
                   if (address.length === 0) {
                    // sails.log.Error('Se intento borrar usuario con id :'+data.id+" pero no existia alguno con ese id");
                    res.status(204).json({ error: 'No existe domicilio.' });
                    }    
                });
                res.status(200).json({ message: 'Usuario modificado.' });
                }
                
            }
        }else{
            return res.status(401).json({erros : 'Medidas de seguridad no ingresadas.'})
        }
    },

    User: async function (req,res) {
        var data = req.allParams();
        if(req.headers['access-token']){ 
            var currentUser = base.CheckToken(req.headers['access-token']);
                if(currentUser){
                var usuario =await User.findOne({id: data.id}).populate('Adress');   2
                res.status(200).json({user:usuario})             
                }
            }else{
                return res.status(401).json({erros : 'Medidas de seguridad no ingresadas.'})
            }
    }

};

