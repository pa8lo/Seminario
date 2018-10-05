/**
 * ClienteController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    CreateClient :async function (req,res) {
               
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
                    if(tokenDecode.Ip === req.ip){                          
                    var data = req.body;
                    console.log("LOS DATOS  "+JSON.stringify(data));
                    try {                        
                        var usuario = await  Cliente.create(data.Client).fetch();
                        var domicilio = await Domicilio.create({
                            id:data.Adress.id,
                            Adress:data.Adress.Adress,
                            Department:data.Adress.Department,
                            Floor:data.Adress.Floor,
                            Client:usuario.id
                        }).fetch();

                    } catch (error) {
                        sails.log.debug(error)
                    }       

                }else{
                    sails.log.Info("El usuario  de id : "+ tokenDecode.Id + "quiso acceder desde un ip erroneo.");
                    res.status(403).json({error: "Acceso denegado"})
                }
                   
                }

        }, 
            
        

};

