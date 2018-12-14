/**
 * BaseController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const jwt = require('jsonwebtoken');
const secretMessage = require('../Secret');

var base = require('./BaseController.js')

module.exports = {

    CheckToken :async function  (token){        
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
        console.log(CurrentUser.Ip)
        if(CurrentUser.Ip === ip){
            try {
                var existeModelo =await User.findOne({id: CurrentUser.Id}).populate('Authorizations',{Name: NombrePermiso,Type: CategoriaPermiso}); 
                return (existeModelo !== undefined && existeModelo.Authorizations.length > 0) ?  true :false; 
            } catch (error) {
                sails.log.debug("Existio un error para ver permisos : "+error)
                res.status(500).json({error :"Error en el servidor"});
            } 

        }else{
        sails.log.info("El usuario  de id : "+ CurrentUser.Id + "quiso acceder desde un ip erroneo.");
        sails.log.info("-id esperada : " +CurrentUser.Ip);
        sails.log.info("-id recibida : " +ip);
        return false;
        }

    },
/**
 * Muestra todos los elementos de un objeto
 */
    SeeElements: function (Element,NombreElemento,res){
        Element.find({Eliminated: false}) 
        .then(function(data){
             if(!data || data.length ==0){
                    return res.json([])
             }
             return  res.json(data)
        })
        .catch(function(err){
             sails.log.debug(err)
             return res.send({
                'sucess': false,
                'message':' no existe '+NombreElemento
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
    /**
     * Permite validar permisos y que esten los datos necesarios para una ejecución
     * @param {*} req 
     * @param {*} res 
     * @param {String} CategoriaPermiso 
     * @param {String} TipoPermiso 
     */
    validator: async function(req,res,CategoriaPermiso,TipoPermiso){
        if (req.headers['access-token']) {
            var data = req.body;
            var currentUser =  CheckToken(req.headers['access-token']);
            if (currentUser) {
                sails.log.info("current user : " +currentUser);
              if (await CheckAuthorizations(currentUser, CategoriaPermiso, TipoPermiso, req.ip, res)) {
                    return true;
            } else {
                
                sails.log.info("el usuario " + currentUser.Id + "quiso acceder a un lugar sin permisos");
                res.status(401).json({
                  error: 'Acceso denegado.'
                });
                
              }
            }
          } else {
            res.status(401).json({
              erros: 'Medidas de seguridad no ingresadas.'
            })
            return false;
          }
        },
    
    /**
     * 
     * creacion de dos entidades relacionadas.
     */
    CreateElement: async function (EntidadUno,EntidadDos,DataEntidadUno,DataEntidadDos,ViaEntidadUno,res) {
        try {
            var entidadDos = await EntidadDos.create(DataEntidadDos).fetch();
            
            var entidadUno = await EntidadUno.create(DataEntidadUno).fetch();
            await EntidadUno.addToCollection(entidadDos.id, ViaEntidadUno)
            .members(entidadUno.id); 
            res.status(200).json({message: ViaEntidadUno+"Registrado"});
        } catch (error) {
            sails.log.debug(error)
            res.status(500).json({error: "existio un error para crear la entidad"});
        }
    
    },




                 

};
async function CheckToken (token){        
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
    }
    async function  CheckAuthorizations (CurrentUser,CategoriaPermiso,NombrePermiso,ip,res) {
        if(CurrentUser.Ip === ip){
            try {
                var existeModelo =await User.findOne({id: CurrentUser.Id}).populate('Authorizations',{Name: NombrePermiso,Type: CategoriaPermiso}); 
                return (existeModelo !== undefined && existeModelo.Authorizations.length > 0) ?  true :false; 
            } catch (error) {
                console.log(error)
                res.status(500).json({error :"Error en el servidor"});
            } 

        }else{
        sails.log.info("El usuario  de id : "+ CurrentUser.Id + "quiso acceder desde un ip erroneo.");
        res.status(405).json({error :"Acceso denegado"});
        }

    }

