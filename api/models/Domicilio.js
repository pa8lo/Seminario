/**
 * Domicilio.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'Domicilios',
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    Adress:{
      type:'string',
      description:'Direccion del usuario',
      allowNull:false,
      columnName: 'Dirección',
    },

    Department:{
      type:'string',
      description:'Departamento del usuario',
      allowNull:true,
      columnName: 'Departamento',
    },

    Floor:{
      type:'String',
      description:'piso del departamento',
      columnName: 'Piso',
    },
    
    LatLong:{
      type: 'string',
      description:'Latitud y longitud del cliente'
    },

    Cp:{
      type:'string',
      required:true,
      description:'Codigo postal del cliente'
    },
    Validado:{
      type:'boolean',
      columnType:'char',
      defaultsTo: true, 
    },
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    User: {
      collection:'User',
      description:'Usuario relacionado con la dirección',
      via:'Adress'
    },
    Orders:{
      collection:'pedido',
      via:'Adress'
    },
    Client: {
      model:'cliente',
      description:'cliente relacionado con la dirección',
    },
  },

};

