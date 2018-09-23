/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const token = require('jsonwebtoken');
const secretMessage = require('../Secret');


module.exports = {
    //traigo todos los usuarios.
    users :   function (req,res) {
        if(req.headers['access-token']){
        var accessToken = req.headers['access-token'];
        const currentUser = token.verify(accessToken,secretMessage.jwtSecret,(err, decoded) => {
            if (err) {
           return null;
           }
            else {
            req.user = decoded;
            
            return req.user;
            }
        });
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
                res.status(500).json({error: "Acceso denegado"})
            }
        }else{
            return res.status(400).json({ error: 'no entro el currents.' });
        }    
        }else{
            return res.status(400).json({ error: 'Medidas de seguridad no ingresadas.' });
        }
    },
    //Devuelvo Los datos del usuario decodificados del token
          currentUser: async function(req,res){
           try {    
                var accessToken = req.headers['access-token'];
                const tokenDecode = await token.verify(accessToken,secretMessage.jwtSecret,(err, decoded) => {
                    if (err) {
                    return res.json(null);
                    }
                    else {
                    req.user = decoded;
                    
                    return req.user;
                    }
                });
                return res.send({
                    'sucess': true,
                    'User':tokenDecode,
                })
            } catch (error) {
                res.status(500).json({error: "Falta ingresar token de seguridad"})
            }
            },

            createUser: async function(req,res){
                
                                if(req.headers['access-token']){                
                                    var accessToken = req.headers['access-token'];            
                                    var tokenDecode = token.verify(accessToken,secretMessage.jwtSecret,(err, decoded) => {
                
                                        if (err) {                
                                            console.log(err)                
                                            return res.json(null);                                                                            
                                            }
                
                                            else {                
                                            var user = decoded;                                                                           
                                            return user;                
                                            }
                
                                        });
                
                                    }                
                                    if(tokenDecode){                
                                        var user = req.body;
                                        
                                        try {
                                            var domicilio = await Domicilio.create(user.Adress)                              
                                            var telefono = await Telefono.create(user.Number)                              
                                            var usuario  = await  User.create(user.user) 

                                        } catch (error) {
                                            sails.log.debug(err)
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
                    const userToken = token.sign({Name: user.Name, Id: user.id, Authorizations: user.Authorizations}, secretMessage.jwtSecret);
                    return res.status(200).json({
                        user:{
                            Name:user.Name,
                            Rol:user.Rol
                        }, 
                        token: userToken
                })
                }else{
                    return res.status(400).json({ error: 'Ha ingresado datos erroneos' });
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



    }

};

