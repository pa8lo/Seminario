/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    users :   function (req,res) {
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
    user:function(req,res){
        return res.send({
            'sucess': false,
            'message': "asd"
        })
    },

    createUser: function(req,res){
        var user = req.body;
        User.create(req.allParams())
            .then(function(user){
                return res.send({
                    'sucess':true,
                    'message': 'se creo el usuario',
                    'user': req.body
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

