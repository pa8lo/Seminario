/**
 * DireccionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const jwt = require('jsonwebtoken');
const secretMessage = require('../Secret');
var base = require('./BaseController.js');
module.exports = {   
  
        UpdateAddress: async function (req, res){
            try {
                
                console.log(req.headers['access-token'])
            if( req.headers['access-token']) {
                var currentUser =await base.CheckToken(req.headers['access-token']);
                if(await currentUser){
                    let data = req.body
                    sails.log.info("se recibieron los datos"+JSON.stringify(data))
                    sails.log.info("se procede a actualizar datos con permisos del usuario " + JSON.stringify(currentUser))
                    try {
                        if ( base.CheckAuthorization(currentUser,'Direccion','edit',req.ip,res)){  
                            sails.log.info("se procede a modificar la direccion con id :"+ JSON.stringify(data.Address))
                            var direccion = await Domicilio.update({id:data.Address.id})
                            .set(data.Address).fetch();          
                            sails.log.info("Se procede amodificar "+direccion);                                     
                            if (direccion.length === 0) {
                            // sails.log.error('Se intento borrar cliente con id :'+data.id+" pero no existia alguno con ese id");
                            res.status(401).json({ error: 'No existe Direccion.' });
                            } else {
        
                            res.status(200).json({ message: 'Dirección modificado.' });
                            }
                        }
                    }catch(error){
                        sails.log.error({error: error});
                    }
                }else{
                    sails.log.error("existio un problema para verificar usuario que utiliza el servicio")
                }
                
                
            }
        } catch (error) {
                console.log(error)
        }
        }
};

