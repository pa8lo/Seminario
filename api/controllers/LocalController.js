/**
 * LocalController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var _validaciones = require('./ValidacionController');
module.exports = {
    getLocal:async function (req, res) {
        let local = await Local.find().limit(1).sort('id DESC')
        sails.log.info("se devuelven")
        res.status(200).json(local);
    },
    setLocal:async function (req,res){
        console.log("asd")
        sails.log.debug("se procede a crear el local")
        let data = req.body
        sails.log.debug(data)
        let local = await Local.create(data.Local).fetch();
        res.status(200).json(local);
    },
    updateLocal:async function(req,res){
        let data = req.body
        let local = await Local.create(data.Local).fetch();
        res.status(200).json(local);
    }

};

