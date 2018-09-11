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
                if(currentUser.Acceso =='VerUsuarios'){
                User.find() 
                .then(function(user){
                     if(!user || user.length ==0){
                            return res.send({
                                'sucess': false,
                                'message':' no existen usuarios'
                            })
                     }
                     return res.send({
                         'sucess':true,
                         'message': user
                     })
                })
                .catch(function(err){
                     sails.log.debug(err)
                     return res.send({
                        'sucess': false,
                        'message':' no existe usuario'
                    })
                })
              }           
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
                const tokenDecode = token.verify(accessToken,secretMessage.jwtSecret,(err, decoded) => {
                    if (err) {
                    return res.json(null);
                    }
                    else {
                    req.user = decoded;
                    
                    return req.user;
                    }
                });
                return res.send({
                    'sucess': false,
                    'message': user.Name,
                    'token':tokenDecode,
                })
            } catch (error) {
                res.status(500).json({error: "Falta ingresar token de seguridad"})
            }
            },

            createUser: function(req,res){
                var user = req.body;
                User.create(req.allParams())
                    .then(function(user){
                        return res.send({
                            'sucess':true,
                            'message': 'se creo el usuario',
                            'user': req.body
                        })
                    })
                    .catch(function(err){
                        sails.log.debug(err)
                        return res.send({
                        'sucess': false,
                        'message':' no se pudo crear el nuevo usuario'
                    })
                })
            },
    login : async function(req,res){
        try {
            //Traigo todos los datos del request y controlo que existan los necesarios
        const data = req.allParams();
        if(!data.Name || !data.Password){
           return res.status(400).json({ error: 'Faltan ingresar Parametros' });
        }
        try{
            //Busco un usuario que coincida y Inflo el atributo rols
            const user = await User.findOne({Name: data.Name.trim()}).decrypt().populate('Rols');
            try{
                if(user.Password == data.Password){
                    const userToken = token.sign({Name: user.Name, Id: user.id, Rol: user.Rols}, secretMessage.jwtSecret);
                    return res.status(200).json({
                        user:{
                            Name:user.Name,
                            Rol:user
                        }, 
                        token: userToken
                })
                }else{
                    return res.status(400).json({ error: 'Usuario y/o contraseña incorrecta' });
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

