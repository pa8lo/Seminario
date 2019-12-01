/**
 * Producto.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    Description:{
      type:'string',
      required:true
    },
    Name:{
      type:'string',
      required:true
    },
    Amount:{
      type:'string',
      required:true
    },
    Eliminated:{
      type: 'boolean',
      defaultsTo: false, 
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    Orders:{
      collection:'pedido',
      via:'Products'
    },
    ProductosPorPedido:{
      collection:'productosporpedido',
      via: 'Product'
    },
    ProductosPorCombo:{
      collection:'productosporcombos',
      via:'Product'
    },
    Offers:{
      collection:'combo',
      via:'Products'
    },
    Items:{
      collection:'item',
      via:'Products'
    },
    Category:{
      model:'categoria',
    }

  },

};

