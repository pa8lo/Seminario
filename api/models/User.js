/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'Usuario',
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    Email:{
      type: 'string',
      description:'Dirección de correo electronico',
    },

    Dni: {
      type: 'string',
      description:'Documento de identida del usuario',
      allowNull: true
    },

    Name: {
      type:'string',
      description:'Nombre del usuario',
      columnName: 'Nombre',
      allowNull:false
    },

    LastName: {
      type:'string',
      description:'Apellido dle usuario',
      columnName:'Apellido',
      allowNull:true
    },

    Password: {
      type:'string',
      description:'password del usuario',
      columnName:'Password',
      allowNull:false,
      encrypt: true
    },
    
    PhonePrincipal: {
      type:'string',
      description:'Telefono principal del usuario',
      encrypt:true
    },

    SecondaryPhone: {
      type:'string',
      description:'Telefono secundario del usuario',
      encrypt:true
    },
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    Adress: {
      collection:'domicilio',
      via:'User'
    },

    expenses: {
      collection:'gasto',
      via:'User'
    },
    Rols :{
      collection:'rol',
      via:"Users"
    },
    Authorizations:{
      collection:'permiso',
      via:"Users"
    },
    Assistance:{
      collection:'asistencia',
      via:'User'
    },
    Orders:{
      collection:'pedido',
      via:'Users'
    },
    AsignedTurns:{
      collection:'turnosAsignados',
      via:'Users'
    }
  },

};

