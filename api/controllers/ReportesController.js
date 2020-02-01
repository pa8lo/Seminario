/**
 * ReportesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    Pedidos:async function(req , res){
        let prueba = await Gasto.find();
        Array.prototype.groupBy = function(prop) {
            return this.reduce(function(groups, item) {
              const val = item[prop]
              groups[val] = groups[val] || []
              groups[val].push(item)
              return groups
            }, {})
        }
        res.status(200).json(prueba.groupBy(prueba.date))

        // sails.log.info(a)
        // Gasto.getDatastore().sendNativeQuery('SELECT * FROM gasto ' ,function(err, rawResult) {
        //     if (err) { return sails.log.info("err"); }
            
        //     // sails.log(rawResult.rows);
        //     // (result format depends on the SQL query that was passed in, and the adapter you're using)
          
        //     // Then parse the raw result and do whatever you like with it.
        //     res.status(200).json(rawResult.rows)
        //     // return res.status(200).json(rawResult);
        //     })

    }
};

