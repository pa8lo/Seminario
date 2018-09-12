/**
 * RolController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    rols :   function (req,res) {
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
                Rol.find() 
                .then(function(rol){
                     if(!rol || rol.length ==0){
                            return res.send({
                                'sucess': false,
                                'message':' no existen Roles'
                            })
                     }
                     return res.send({
                         'sucess':true,
                         'message': rol
                     })
                })
                .catch(function(err){
                     sails.log.debug(err)
                     return res.send({
                        'sucess': false,
                        'message':' Existio un problema para traer los roles'
                    })
                })                        
            } catch (error) {
                res.status(500).json({error: "Acceso denegado"})
            }
        }else{
            return res.status(400).json({ error: 'Acceso denegado.' });
        }    
        }else{
            return res.status(400).json({ error: 'Medidas de seguridad no ingresadas.' });
        }
    },

};

