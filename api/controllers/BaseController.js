/**
 * BaseController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const jwt = require('jsonwebtoken');
const secretMessage = require('../Secret');

var messages = require("../globals/index");



module.exports = {
    state: function(req,res){
      res.status(200).json();
    },
    CheckToken :async function  (token){ 
      sails.log.info("se procede a chequear el token "+token)
        var accessToken = token;            
        var tokenDecode = jwt.verify(accessToken,secretMessage.jwtSecret,(err, decoded) => {
            if (err) {                            
                return null;                                                                            
                }
                else {                
                var user = decoded;         
                sails.log.info("se devuelve la informacion : "+JSON.stringify(user));
                return user;                
                }
            });
            return tokenDecode;

        },
     /**
     * Controla si el usuario tiene todos los permisos necesarios
     * @param {*} CurrentUser  el perfil del usuario
     * @param {*} CategoriaPermiso  la categoria  del permiso que se desea comprobar
     * @param {*} NombrePermiso  el nombre  del permiso que se desea comprobar
     * @param {*} ip  el ip que viene en el req
     * @param {*} re  respuesta del servidor
     */
    CheckAuthorization: async function (CurrentUser,CategoriaPermiso,NombrePermiso,ip,res) {
            try {
                sails.log.info("se procede a verificar los permisos del usuario "+JSON.stringify(CurrentUser))
                var existeModelo =await User.findOne({id: CurrentUser.Id}).populate('Authorizations',{Name: NombrePermiso,Type: CategoriaPermiso}); 
                sails.log.info("los permisos que se tienen son "+JSON.stringify(existeModelo));
                return (existeModelo !== undefined && existeModelo.Authorizations.length > 0) ?  true :false; 
            } catch (error) {
                sails.log.debug("Existio un error para ver permisos : "+error)
                res.status(500).json({error :"Error en el servidor"});
            } 


    },
    /**
 * Muestra todos los elementos de un objeto
 */
    SeeElements: function (Element,NombreElemento,res){
        Element.find({Eliminated: false}).decrypt() 
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
            var currentUser =await CheckToken(req.headers['access-token']);
            if (currentUser) {
                sails.log.info("[[BASECONTROLLER]] current user : " +JSON.stringify(currentUser));
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
            sails.log.info( "se creo la entidad :"+ entidadUno)
            sails.log.info( "se comprueba si existe mas de una entidad a crear")
            if(DataEntidadUno){
            var entidadUno = await EntidadUno.create(DataEntidadUno).fetch();
            sails.log.info("se creo la entidad dos"+JSON.stringify(entidadUno))
            await EntidadUno.addToCollection(entidadDos.id, ViaEntidadUno)
            .members(entidadUno.id); 
            }
            sails.log.info( "se creo correctamente");
            res.status(200).json({message: ViaEntidadUno+"Registrado"});
        } catch (error) {
            sails.log.debug(error)
            res.status(500).json({error: "existio un error para crear la entidad"});
        }
    
    },
    /**
     * Controla si existe un elemento de una entidad en particular
     * @param {*} Entidad 
     * @param {*} dato  el dato especifico que se desea buscar
     */
    ElementExist: async function(Entidad,dato){
        sails.log.info("Se busco si existe el elemento :"  +"id" + dato)
        var existeElemento = await Entidad.find({id:dato})
        return (existeElemento !== undefined && existeElemento.length > 0) ?  true :false; 
    },
    /**
     * Permite modificar un elemento
     * @param {*} req 
     * @param {*} res 
     * @param {string} Ejemplo : "Usuario" 
     * @param {string} Ejemplo : "View"  
     * @param {*} Elemento es el tipo de objeto
     * @param {int} Elemento es el tipo de objeto
     * @param {*} objeto completo  modifido
     */
    updateElement: async function (req, res,TipoPermiso,TipoDato,Elemento,id,Objeto) {
        if (await this.validator(req, res, TipoPermiso, TipoDato)) {
            var data = req.body
            if (data.id) {
                var elemento = await Elemento.update({
                    id
                  })
                  .set(Objeto).fetch();
                if (elemento.length === 0) {
                  sails.log.info('Se intento modificar el '+Elemento+' con id :' + elemento.id + " pero no existia alguno con ese id");
                  res.status(messages.response.noFound).json({
                    error: 'No existe '+Elemento
                  });
                } else {
                  sails.log.info('Se modifico el estado con id :' + id);
                  res.status(messages.response.ok).json({
                    message: Elemento+' modificada.'
                  });
                }
              } else {
                sails.log.info("el usuario " + currentUser.Id + "No ingreso el id ");
                res.status(messages.response.wrongSintexis).json({
                  error: 'Faltan ingresar parametros'
                });
              }
        }
      },
    // addError:function(error){

    // }  




                 

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
            try {
                var existeModelo =await User.findOne({id: CurrentUser.Id}).populate('Authorizations',{Name: NombrePermiso,Type: CategoriaPermiso}); 
                return (existeModelo !== undefined && existeModelo.Authorizations.length > 0) ?  true :false; 
            } catch (error) {
                console.log(error)
                res.status(500).json({error :"Error en el servidor"});
            } 

    }

