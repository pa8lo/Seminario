/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    get :   function (req,res) {
        User.find() 
            .then(function(user){
                 if(!user || user.length ==0){
                        return res.send({
                            'sucess': false,
                            'message':' no existe usuario'
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

    createUser: function(req,res){
        User.create(req.allParams())
            .then(function(user){
                return res.send({
                    'sucess':true,
                    'message': 'se creo el usuario'
                })
            })
            .catch(function(err){
                sails.log.debug(err)
                return res.send({
                   'sucess': false,
                   'message':' no se pudo crear el nuevo usuario'
               })
           })
    }

};

