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

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
     //await Permiso.create({Name:'Usuario',Description:'Permite la creacion de ver , crear,editar y eliminar usuario',User:1})
    

   if (await User.count() > 0) {
     return done();
   }
  //
   await Rol.create({
    id:1, Name:'Admin',Description:'Administrador de usuarios de la aplicación',User:1
  });

   await User.create(
     {id:1 ,Dni: '35111111', Name: 'Admin',LastName:'Test',Password:'123456',Rols: 1,Authorizations:1},
   );
   await Permiso.create(
     {id:1 ,Name:'Usuario_Visualizar',Description:'Permite ver usuarios',User:1},
     {id:2 ,Name:'Usuario_Registrar',Description:'Permite la creacion del usuario',User:1},
     {id:3 ,Name:'Usuario_Modificar',Description:'Permite editar al usuario',User:1},
     {id:4 ,Name:'Usuario_Eliminar',Description:'Permite eliminar usuario',User:1},
     {id:5 ,Name:'Permiso_Visualizar',Description:'Permite ver Permiso',User:1},
     {id:6 ,Name:'Permiso_Registrar',Description:'Permite la creacion del Permiso',User:1},
     {id:7 ,Name:'Permiso_Eliminar',Description:'Permite eliminar Permiso',User:1},
     {id:8 ,Name:'Rol_Visualizar',Description:'Permite ver Rols',User:1},
     {id:9 ,Name:'Rol_Registrar',Description:'Permite la creacion del Rol',User:1},
     {id:10 ,Name:'Rol_Modificar',Description:'Permite editar al Rol',User:1},
     {id:11 ,Name:'Rol_Eliminar',Description:'Permite eliminar Rol',User:1},
     {id:12 ,Name:'Cliente_Visualizar',Description:'Permite ver Clientes',User:1},
     {id:13 ,Name:'Cliente_Registrar',Description:'Permite la creacion del Cliente',User:1},
     {id:14 ,Name:'Cliente_Modificar',Description:'Permite editar al Cliente',User:1},
     {id:15 ,Name:'Cliente_Eliminar',Description:'Permite eliminar Cliente',User:1},
     {id:16 ,Name:'Modulo_Producto_Visualizar',Description:'Permite ver Modulos de productos'},
     {id:17 ,Name:'Modulo_Producto_Registrar',Description:'Permite la creacion del Modulo y su contenido'},
     {id:18 ,Name:'Modulo_Producto_Modificar',Description:'Permite editar al Modulo y su contenido'},
     {id:19 ,Name:'Modulo_Producto_Eliminar',Description:'Permite eliminar Modulo y su contenido'},
     
     
    )
  // 

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();

};
