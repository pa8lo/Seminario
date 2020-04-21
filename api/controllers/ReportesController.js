/**
 * ReportesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    Gastos:async function(req , res){
        var data = req.allParams();
        sails.log.debug("se recibieron los siguientes datos")
        sails.log.debug(data)
        try{
            let prueba = await Gasto.find({
                Date: {'>':data.min,'<':data.max},
                Eliminated:false
            }).sort('Date ASC');
            let pruebaToday = await Gasto.find({
                Date: data.min,
                Eliminated:false
            })

            sails.log.info(prueba)
            sails.log.info(pruebaToday)
            pruebaToday.forEach(dato => {
                prueba.push(dato)
            })
            if(data.min == data.max){
                let lastDate= await Gasto.find({
                    Date: data.max,
                    Eliminated:false
                })
                lastDate.forEach(dato => {
                    prueba.push(dato)
                })
            }
            sails.log.info(prueba)
            let ordenado = [];
                prueba.forEach(dato => 
                    dato.Date = sails.moment(dato.Date).format("YYYY-MM-DD"))
                while(prueba.length >0 ){
                    let a  = prueba.filter(x => x.Date === prueba[0].Date)
                    let dinero = 0;
                    a.forEach(valor => {
                        dinero += valor.Amount
                    });
                 ordenado.push({
                        day : prueba[0].Date,
                        datos  :  prueba.filter(x => x.Date === prueba[0].Date),
                        amount : dinero
                    })
                prueba =  prueba.filter(x => x.Date != prueba[0].Date)
            }
            sails.log.debug("se devolven lo siguientes datos")
            sails.log.debug(ordenado)
            res.status(200).json(ordenado);
        }
        catch(err){
            sails.log.debug(err)
            res.status(500).json("error en la busqueda de datos")
        }
    },
    Pedidos: async function(req , res){
        
        var data = req.allParams();
        try {
            let ordenado = []
            let pedidos = await Pedido.find({
                Date: {'>':data.min,'<':data.max},
                Eliminated:false
            });
            pedidos.forEach(dato =>  
            dato.Date = sails.moment(dato.Date).format("hA"))
            sails.log.debug(pedidos)
            while(pedidos.length >0 ){
                let a  = pedidos.filter(x => x.Date === pedidos[0].Date)
                let dinero = 0;
                a.forEach(valor => {
                    
                    dinero += valor.Amount
                });
             ordenado.push({
                    day : pedidos[0].Date,
                    datos  :  pedidos.filter(x => x.Date === pedidos[0].Date),
                    amount : dinero
                })
            pedidos =  pedidos.filter(x => x.Date != pedidos[0].Date)

        }
        sails.log.debug("se devolven lo siguientes datos")
        sails.log.debug(ordenado)
        res.status(200).json(ordenado);
        } catch (error) {
            res.status(500).json(error)
        }
    },
    Ganancias:async function(req, res){
        var data = req.allParams();
        sails.log.debug("se recibieron los siguientes datos")
        sails.log.debug(data)
        try{
            let estadoEnviado = await Estado.findOne({Description:'Enviado'})
            let pedido = await Pedido.find({
                Date: {'>':data.min,'<':data.max},
                Eliminated:false,
                State:estadoEnviado.id
            }).sort('Date ASC');
            let ordenado = [];
                pedido.forEach(dato => 
                    dato.Date = sails.moment(dato.Date).format("YYYY-MM-DD"))
                while(pedido.length >0 ){
                    let a  = pedido.filter(x => x.Date === pedido[0].Date)
                    let dinero = 0;
                    a.forEach(valor => {
                        dinero += valor.Amount
                    });
                 ordenado.push({
                        day : pedido[0].Date,
                        datos  :  pedido.filter(x => x.Date === pedido[0].Date),
                        amount : dinero
                    })
                pedido =  pedido.filter(x => x.Date != pedido[0].Date)
            }
            sails.log.debug("se devolven lo siguientes datos")
            sails.log.debug(ordenado)
            res.status(200).json(ordenado);
        }
        catch(err){
            sails.log.debug(err)
            res.status(500).json("error en la busqueda de datos")
        }
    }
};

