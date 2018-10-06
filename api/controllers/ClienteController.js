/**
 * ClienteController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var base = require('./BaseController.js')
module.exports = {
  
    CreateClient :async function (req,res) {
        console.log("Ingreso");
            var tokenDecode =  base.CheckToken(req.headers['access-token']);              
                if(tokenDecode){       
                    console.log("funciono");
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

            
        }
            
        

};

