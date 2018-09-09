/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const token = require('jsonwebtoken');
const secretMessage = require('../Secret');


module.exports = {
    users :   function (req,res) {
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
    },
          user2: async function(req,res){
         const user = await User.findOne({Name:'Admin'})
      //   const userToken = token.sign({Name: user.Name, Id: user.id, Rol: user.Rols}, secretMessage.jwtSecret);
        const tokenDecode = token.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJOYW1lIjoiQWRtaW4iLCJJZCI6MSwiaWF0IjoxNTM2NTA5MDkxfQ.tVKHoTLoRq7rgk2EGWI_iPWj-ml4qO_cpN9QVTp6aoY',secretMessage.jwtSecret,(err, decoded) => {
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
      //      'tokenDecode':tokenDecode
          })
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
    user : async function(req,res){
        try {
        const data = req.allParams();
        if(!data.Name || !data.Password){
           return res.status(400).json({ error: 'Faltan ingresar Parametros' });
        }
             const user = await User.findOne({Name: data.Name.trim()}).decrypt();

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
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }
       } catch (error) {
           res.status(500).json({error:'Hubo un problema con el logueo, revisar parametros'});
        }



    }

};

