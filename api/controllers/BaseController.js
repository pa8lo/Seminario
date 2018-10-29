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
     
    CheckAuthorization: async function (CurrentUser,CategoriaPermiso,NombrePermiso,ip,res) {
        if(CurrentUser.Ip === ip){
            var existeModelo =await User.findOne({id: 1}).populate('Authorizations',{Name: NombrePermiso,Type: CategoriaPermiso}); 
            return (existeModelo.Authorizations.length > 0) ?  true :false; 

        }else{
            //sails.log.Info("El usuario  de id : "+ CurrentUser.Id + "quiso acceder desde un ip erroneo.");
        res.status(405).json({error :"Acceso denegado"});
        }

    },

    SeeElements: function (Element,Mensaje,res){
        Element.find() 
        .then(function(data){
             if(!data || data.length ==0){
                    return res.send({
                        'sucess': false,
                        'message':' no existen '+Mensaje
                    })
             }
             return  res.json(data)
        })
        .catch(function(err){
             sails.log.debug(err)
             return res.send({
                'sucess': false,
                'message':' no existe '+Mensaje
            })
        })
    },
    RemoveAuthorization: async function (data,modeloPrincipal,modeloSecundarioString,res) {
            try{
                await modeloPrincipal.removeFromCollection(data.modeloPrincipal.id, modeloSecundarioString)
                .members(data.modeloSecundario.id);
            }catch(error){
                sails.log.debug(error)
                res.status(500).json({error : "Error en el servidor"})
            } 
            
    },
    CreateElement: async function (EntidadUno,EntidadDos,DataEntidadUno,DataEntidadDos,ViaEntidadUno,res) {
        try {
            var entidadDos = await EntidadDos.create(DataEntidadDos).fetch();
            
            var entidadUno = await EntidadUno.create(DataEntidadUno).fetch();
            await EntidadUno.addToCollection(entidadDos.id, ViaEntidadUno)
            .members(entidadUno.id); 
            res.status(200).json({message: ViaEntidadUno+"Registrado"});
        } catch (error) {
            sails.log.debug(error)
        }
    
    },




                 

};

