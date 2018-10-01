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

    floor:{
      type:'number',
      description:'piso del departamento',
      allowNull:true,
      columnName: 'Piso',
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    User: {
      model:'user',
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
      via:'Adress'
    },
  },

};

