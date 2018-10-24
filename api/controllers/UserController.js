/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const token = require('jsonwebtoken');
const secretMessage = require('../Secret');
var base = require('./BaseController.js');
var rol = require('./RolController.js');


module.exports = {
    //traigo todos los usuarios.
    users :   function (req,res) {
        if(req.headers['access-token']){
        var currentUser = base.CheckToken(req.headers['access-token']);
        if(currentUser){
            try {
                if (base.CheckAuthorization(currentUser,'Usuario','View',req.ip,res)){  
                    console.log(currentUser);             
                        base.SeeElements(User,"usuario",res);
                    }                  
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
                    if(base.CheckAuthorization(currentUser,'Usuario','Delete',req.ip,res)){
                        var data = req.body;
                        console.log(data);
                        try{
                            var destruido = await User.update({id : data.id})
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
                                    var currentUser = base.CheckToken(req.headers['access-token']);               
                                    if(currentUser){       
                                        if (base.CheckAuthorization(currentUser,'Usuario','Create',req.ip,res)){                                         
                                            var data = req.body;                                     
                                            try {
                                               await  base.CreateElement(Domicilio,User,data.Adress,data.User,'User',res)
                                            } catch (error) {
                                                sails.log.debug(error)
                                            }      
                                        }                                                                                                                            
                                    }else{
                                        res.status(401).json({ error: 'Medidas de seguridad no ingresadas.' });
                                    } 
                                    
                                }else{
                                     res.status(401).json({ error: 'Medidas de seguridad no ingresadas.' });
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
                if(base.CheckAuthorization(currentUser,'Usuario','View',req.ip,res)){
                try {
                    if(parametros.id !== undefined){
                        var usuario = await User.findOne({id:parametros.id}).populate('Authorizations');
                        res.status(200).json({Authorizations : usuario.Authorizations});
                    }else{
                        res.status(401).json({error: "faltan ingresar parametros"})
                    }
                 
                }catch(error){
                    console.log(error);
                    res.status(500).json({error: "existio un problema para mostrar los permisos"})
                }
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
                        if(base.CheckAuthorization(currentUser,'Authorization','Delete',req.ip,res)){   
                           await base.RemoveAuthorization(req.body,User,'Authorizations',res)
                            res.status(200).json({message : 'Permiso removido con exito.'})
                            

                        }
                }else{
                    return res.status(401).json({erros : 'Medidas de seguridad no ingresadas.'})
                }
    }else{
        return res.status(401).json({erros : 'Medidas de seguridad no ingresadas.'})
    }
    },

    AssignAuthorization:async  function (req,res) {
        if(req.headers['access-token']){ 
                var currentUser = base.CheckToken(req.headers['access-token']);
                if(currentUser){
                    var data = req.body
                    if (base.CheckAuthorization(currentUser,'Authorization','Assign',req.ip,res)){
                await User.addToCollection( data.Authorization.id, 'Authorizations')
                .members(data.User.id);  
                res.status(200).json({message : 'ok.'})
                }
            }
        }else{
             res.status(401).json({erros : 'Medidas de seguridad no ingresadas.'})
        }
    },

    UpdateUser: async function (req,res) {
        if(req.headers['access-token']){ 
        var currentUser = base.CheckToken(req.headers['access-token']);
            if(currentUser){
                var data = req.body;
                if(base.CheckAuthorization(currentUser,'Usuario','Edit',req.ip,res)){            
                    var usuario = await User.update({id:data.User.id})
                    .set(data.User).fetch();                                                             
                    if (usuario.length === 0) {
                    // sails.log.Error('Se intento borrar usuario con id :'+data.id+" pero no existia alguno con ese id");
                    res.status(401).json({ error: 'No existe usuario.' });
                    } else {
                    res.status(200).json({ message: 'Usuario modificado.' });
                    }
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
                    if(base.CheckAuthorization(currentUser,'Usuario','View',req.ip,res)){
                    var usuario =await User.findOne({id: data.id}).populate('Adress');   
                    res.status(200).json({user:usuario})             
                    }
                }
            }else{
                return res.status(401).json({erros : 'Medidas de seguridad no ingresadas.'})
            }
    },
    //Modifica el rol del usuario configurando sus nuevos permisos
    ChangeRol :async function (req,res) {
        if(req.headers['access-token']){ 
            var currentUser = base.CheckToken(req.headers['access-token']);
                if(currentUser){
                    var parametros = req.body
                    console.log(parametros)
                    if(base.CheckAuthorization(currentUser,'Usuario','Edit',req.ip,res)){
                        var usuario = await User.findOne({id:parametros.User.id}).populate('Authorizations');
                        await usuario.Authorizations.forEach(Auth => {
                            var data ={
                                User:{
                                    id:parametros.User.id
                                },
                                Authorizations:{
                                    id:Auth.id
                                }
                            }
                            base.RemoveAuthorization(data,User,'Authorizations',res);
                            
                        });
                        try{
                            await UpdateRol(parametros.Rol.id,parametros.User.id)
                            res.status(200).json({message:"Usuario midificado correctamente"})
                        }catch(err)
                        {
                            sails.log.debug(err);
                            res.status(404).json({error:"Existío un error cuando se quiso actualizar el rol"})
                        }
                        
                    }
                }
            }else{
                return res.status(401).json({erros : 'Medidas de seguridad no ingresadas.'})
            }
    },
    
     

};
//Permite Actualizar rol a un usuario
 async function UpdateRol(idNewRol,idUsuario){
    try{
     await User.update({id : idUsuario})
     .set({Rols:idNewRol}).fetch();  
     rol.AssignAuthorizations(idUsuario,idNewRol);
    } 
    catch(err){
        sails.log.debug("Existio un error cuando se quiso modificar el rol del usuario "+err);
    }

 }

