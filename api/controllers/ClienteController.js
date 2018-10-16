/**
 * ClienteController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var base = require('./BaseController.js')
module.exports = {
  
    CreateClient :async function (req,res) {
            var tokenDecode =  base.CheckToken(req.headers['access-token']);              
                if(tokenDecode){       
                    if(tokenDecode.Ip === req.ip){                          
                    var data = req.body;
                    try {                        
                        var usuario = await  Cliente.create(data.Client).fetch();
                        data.Adress.forEach(domicilio => {
                            var address = await Domicilio.create({
                                Adress:data.Adress.Adress,
                                Department:data.Adress.Department,
                                Floor:data.Adress.Floor,
                                Client:usuario.id
                            }).fetch();
                        })
                        res.status(200);
                    } catch (error) {
                        sails.log.debug(error)
                        res.status(402);
                    }       
                }else{
                    sails.log.Info("El usuario  de id : "+ tokenDecode.Id + "quiso acceder desde un ip erroneo.");
                    res.status(403).json({error: "Acceso denegado"})
                }     
            }
        }, 

        Clients:async function (req,res) {
            if(req.headers['access-token']){
                var currentUser = base.CheckToken(req.headers['access-token']);
                if(currentUser){
                    try {
                        currentUser.Authorizations.forEach(Authorization => {
                            if(Authorization.Name =='Usuario'){
                                Client.find() 
                                .then(function(cliente){
                                     if(!user || user.length ==0){
                                            return res.send({
                                                'sucess': false,
                                                'message':' no existen clientes'
                                            })
                                     }
                                     return  res.json(cliente)
                                })
                                .catch(function(err){
                                     sails.log.debug(err)
                                     return res.send({
                                        'sucess': false,
                                        'message':' no existe clientes'
                                    })
                                })
                            }             
                        });               
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

        UpdateClient: async function (req,res) {
            if(req.headers['access-token']){
                var data = req.body; 
            var currentUser = base.CheckToken(req.headers['access-token']);
                if(currentUser){
                    var cliente = await Cliente.update({id:data.Cliente.id})
                    .set(data.Cliente).fetch();                                               
                    if (cliente.length === 0) {
                    // sails.log.Error('Se intento borrar cliente con id :'+data.id+" pero no existia alguno con ese id");
                    res.status(204).json({ error: 'No existe usuario.' });
                    } else {
                    // sails.log.Info('Se elimino usuario con id:'+data.id, cliente[0]);
                    data.Adress.forEach(domicilio => {
                        var address = await Domicilio.update({id:domicilio.id})
                        .set(domicilio).fetch();
                        if (address.length === 0) {
                         // sails.log.Error('Se intento borrar usuario con id :'+data.id+" pero no existia alguno con ese id");
                         res.status(204).json({ error: 'No existe domicilio.' });
                         } 
                        })
                    res.status(200).json({ message: 'Usuario eliminado.' });
                    }
                }
            }else{
                return res.status(401).json({erros : 'Medidas de seguridad no ingresadas.'})
            }
        },
        DeleteClient: async function (req,res) {
            if(req.headers['access-token']){
                const currentUser = base.CheckToken(req.headers['access-token']);
                    if(currentUser){
                        if(currentUser.Ip == req.ip){
                            var data = req.body;
                            try{
                                var destruido = await Client.update({id:data.id})
                                                          .set({Eliminated:true}).fetch();                                               
                                if (destruido.length === 0) {
                                   // sails.log.Error('Se intento borrar usuario con id :'+data.id+" pero no existia alguno con ese id");
                                    res.status(204).json({ error: 'No existe cliente.' });
                                } else {
                                  // sails.log.Info('Se elimino usuario con id:'+data.id, destruido[0]);
                                    res.status(200).json({ message: 'cliente eliminado.' });
                                    
                                }
    
                            }catch(error){
                                //sails.log.Error("El usuario  de id : "+ currentUser.Id + "quiso acceder desde un ip erroneo.");
                                return res.status(500).json({ error: 'Existio un problema al eliminar cliente' +error });
                            }
    
                        }else{
                            sails.log.Info("El usuario  de id : "+ currentUser.Id + "quiso acceder desde un ip erroneo.");
                            return res.status(401).json({ error: 'Acceso denegado.' });
                        } 
                        
                    }else{
                        return res.status(401).json({ error: 'Acceso denegado.' });
                    } 
    
                }else{
                    return res.status(401).json({ error: 'Medidas de seguridad no ingresadas.' });
                }
        }
            
        

};

