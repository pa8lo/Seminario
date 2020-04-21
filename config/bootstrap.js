/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function(done) {
  sails.moment = require('moment');
  sails.nestedPop = require('nested-pop');
  setInterval(() => {
     Pedido.getDatastore().sendNativeQuery('CALL proc_actualizar_estado') 
  }, 60000);

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
     //await Permiso.create({Name:'Usuario',Description:'Permite la creacion de ver , crear,editar y eliminar usuario',User:1})
    

   if (await User.count() > 0) {
     return done();
   }
   /*
   *
   * Creación de estados
   *
   */
  await Estado.create({
    id:1,
    Description:'Recibido'
  })
  await Estado.create({
    id:2,
    Description:'En Preparación'
  })
  await Estado.create({
    id:3,
    Description:'Entregado'
  })
  await Estado.create({
    id:4,
    Description:'Rechazado'
  })
  await Estado.create({
    id:5,
    Description:'Enviado'
  })
   /*
   *
   * Creación de permisos
   *
   */ 
  await Rol
        .create({
          id:1,
          Name:'Admin',
          Description:'Administrador de usuarios de la aplicación',
          Authorizations:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
        });
  /*
   *
   * Creación de usuarios
   *
   */ 
  await User
      .create({
          Dni: 'Administrador',
          Name: 'Admin',
          LastName:'Test',
          Password:'Administrador-1990',
          Authorizations:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
          Rols:1
        });

   /*
   *
   * Creación de permisos
   *
   */ 
   //Permisos usuario           
   await Permiso.create({id:1 ,Name:'Create',Description:'Permite la creacion  usuario',Type:'Usuario',User:1});
   await Permiso.create({id:2 ,Name:'View',Description:'Permite ver usuario',Type:'Usuario',User:1});
   await Permiso.create({id:3 ,Name:'Edit',Description:'Permite editar usuario',Type:'Usuario',User:1});
   await Permiso.create({id:4 ,Name:'Delete',Description:'Permite Borrar usuarios',Type:'Usuario',User:1});
   //Permisos Cliente
   await Permiso.create({id:5 ,Name:'Create',Description:'Permite Crear Clientes',Type:'Cliente',User:1});
   await Permiso.create({id:6 ,Name:'View',Description:'Permite ver Clientes',Type:'Cliente',User:1});
   await Permiso.create({id:7 ,Name:'Edit',Description:'Permite Editar Clientes',Type:'Cliente',User:1});
   await Permiso.create({id:8 ,Name:'Delete',Description:'Permite Eliminar Clientes',Type:'Cliente',User:1});
   //Permisos Roles
   await Permiso.create({id:9 ,Name:'Create',Description:'Permite crear Roles',Type:'Rol',User:1});
   await Permiso.create({id:10 ,Name:'View',Description:'Permite ver Roles',Type:'Rol',User:1});
   await Permiso.create({id:11 ,Name:'Edit',Description:'Permite Editar Roles',Type:'Rol',User:1});
   await Permiso.create({id:12 ,Name:'Delete',Description:'Permite Borrar Roles',Type:'Rol',User:1});
   //Permisos Autorizaciones
   await Permiso.create({id:13 ,Name:'View',Description:'Permite Ver Permisos',Type:'Authorization',User:1});
   await Permiso.create({id:14 ,Name:'Edit',Description:'Permite Editar Permisos',Type:'Authorization',User:1});
   await Permiso.create({id:15 ,Name:'Delete',Description:'Permite Borrar Permisos',Type:'Authorization',User:1});
   //Permisos Producto
   await Permiso.create({id:16 ,Name:'Create',Description:'Permite Crear Productos',Type:'Producto',User:1});
   await Permiso.create({id:17 ,Name:'View',Description:'Permite ver Producto',Type:'Producto',User:1});
   await Permiso.create({id:18 ,Name:'Edit',Description:'Permite Editar Productos',Type:'Producto',User:1});
   await Permiso.create({id:19 ,Name:'Delete',Description:'Permite Eliminar Producto',Type:'Producto',User:1});
   //Permisos Pedido
   await Permiso.create({id:20 ,Name:'Create',Description:'Permite Crear Pedidos',Type:'Pedido',User:1});
   await Permiso.create({id:21 ,Name:'View',Description:'Permite Ver Pedidos',Type:'Pedido',User:1});
   await Permiso.create({id:22 ,Name:'Edit',Description:'Permite Editar Pedidos',Type:'Pedido',User:1});
   await Permiso.create({id:23 ,Name:'Delete',Description:'Permite Eliminar Pedidos',Type:'Pedido',User:1});
   //Permisos Gastos
   await Permiso.create({id:24 ,Name:'Create',Description:'Permite Crear gastos',Type:'Gasto',User:1});
   await Permiso.create({id:25 ,Name:'View',Description:'Permite Ver gastos',Type:'Gasto',User:1});
   await Permiso.create({id:26 ,Name:'Edit',Description:'Permite Editar gastos',Type:'Gasto',User:1});
   await Permiso.create({id:27 ,Name:'Delete',Description:'Permite Eliminar gastos',Type:'Gasto',User:1});
   //Permisos Turnos y asistencias 
   await Permiso.create({id:28 ,Name:'Create',Description:'Permite crear turnos ',Type:'Turno',User:1});
   await Permiso.create({id:29 ,Name:'View',Description:'Permite Ver turnos ',Type:'Turno',User:1});
   await Permiso.create({id:30 ,Name:'Edit',Description:'Permite modificar turnos ',Type:'Turno',User:1});
   await Permiso.create({id:31 ,Name:'Delete',Description:'Permite eliminar turnos ',Type:'Turno',User:1});
   

   /*
   *
   * Creación de categorias
   *
   */ 
   await Cliente.create({Name: 'test',LastName:'Test',email:'texs@test.com',Phone:'123445',Adress:[1],Orders:[1]});
   await Domicilio.create({Adress:'test',Cp:1406,Client:1,User:1,LatLong:"-34.6325883;-58.4686851"});

   await Categoria.create({id:1,Name:'Sin Categoria', Description:'Productos sin categoria'})
   await Producto.create({id:1,Name:'Prueba', Description:'Producto prueba',Amount:123,Category:1})
   await Combo.create({id:1,Name:'Combo', Description:'Producto prueba',Amount:223})
   await ProductosPorCombos.create({Offer:1,Product:1,Count:2})
   await CombosPorPedido.create({Count:1,Order:1,Offer:1})
   await ProductosPorPedido.create({Count:1,Order:1,Product:1})
   await Pedido.create({id:1,Amount:123,Users:1,Delivery:1,Clients:1,Adress:1,Products:1,ProductosPorPedido:1,CombosPorPedido:1,Offers:1,State:1,Date:new Date()})
  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();

};
