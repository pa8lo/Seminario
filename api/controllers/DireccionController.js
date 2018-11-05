/**
 * DireccionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const jwt = require('jsonwebtoken');
const secretMessage = require('../Secret');
module.exports = {
  
        UpdateAddress: async function(res,req){
            try {
                console.log(await req.headers)
            if(req.headers['access-token']) {
                var currentUser = base.CheckToken(req.headers['access-token']);
                if(currentUser){
                    try {
                        if (await base.CheckAuthorization(currentUser,'Direccion','edit',req.ip,res)){  
                            var direccion = await Cliente.update({id:data.Adress.id})
                            .set(data.Address).fetch();                                               
                            if (direccion.length === 0) {
                            // sails.log.Error('Se intento borrar cliente con id :'+data.id+" pero no existia alguno con ese id");
                            res.status(401).json({ error: 'No existe usuario.' });
                            } else {
        
                            res.status(200).json({ message: 'Dirección modificado.' });
                            }
                        }
                    }catch(error){

                    }
                }
            }
        } catch (error) {
                console.log(error)
        }
        }
};

