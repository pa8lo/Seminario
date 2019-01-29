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
    id:1, Name:'Admin',Description:'Administrador de usuarios de la aplicación',Authorizations:[1,2,3,5]});
    await Rol.create({
      id:2, Name:'Usuario',Description:'Administrador de usuarios de la aplicación'});
   await User.create(
     {id:1 ,Dni: '35111111', Name: 'Admin',LastName:'Test',Password:'123456',Authorizations:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],Rols:1,});
     await User.create(
      {id:3 ,Dni: '35211111', Name: 'Admin',LastName:'Test',Password:'123456',Authorizations:[1,2,3,4,5,6,7,8,9,10],Rols:1,});
      await User.create(
        {id:7 ,Dni: '352111', Name: 'Admin',LastName:'Test',Password:'123456',Authorizations:[1,2,3,4,5,6,7,8,9,10],Rols:1,});
        await User.create(
          {id:4 ,Dni: '35211211', Name: 'Admin',LastName:'Test',Password:'123456',Authorizations:[1,2,3,4,5,6,7,8,9,10],Rols:1,});
          await User.create(
            {id:5 ,Dni: '3521', Name: 'Admin',LastName:'Test',Password:'123456',Authorizations:[1,2,3,4,5,6,7,8,9,10],Rols:1,});
            await User.create(
              {id:6 ,Dni: '35221', Name: 'Admin',LastName:'Test',Password:'123456',Authorizations:[1,2,3,4,5,6,7,8,9,10],Rols:1,});
   await Permiso.create({id:1 ,Name:'Create',Description:'Permite la creacion  usuario',Type:'Usuario',User:1});
   await Permiso.create({id:2 ,Name:'View',Description:'Permite ver usuario',Type:'Usuario',User:1});
   await Permiso.create({id:3 ,Name:'Edit',Description:'Permite ver usuario',Type:'Usuario',User:1});
   await Permiso.create({id:4 ,Name:'Delete',Description:'Permite ver Clientes',Type:'Usuario',User:1});
   await Permiso.create({id:5 ,Name:'View',Description:'Permite ver Clientes',Type:'Cliente',User:1});
   await Permiso.create({id:6 ,Name:'Create',Description:'Permite ver Clientes',Type:'Rol',User:1});
   await Permiso.create({id:7 ,Name:'Edit',Description:'Permite ver Clientes',Type:'Rol',User:1});
   await Permiso.create({id:8 ,Name:'Delete',Description:'Permite ver Clientes',Type:'Rol',User:1});
   await Permiso.create({id:9 ,Name:'Delete',Description:'Permite ver Clientes',Type:'Authorization',User:1});
   await Permiso.create({id:10 ,Name:'View',Description:'Permite ver Clientes',Type:'Rol',User:1});
   await Permiso.create({id:21 ,Name:'Edit',Description:'Permite ver Clientes',Type:'Usuario',User:1});
   await Permiso.create({id:11 ,Name:'Delete',Description:'Permite Eliminar Producto',Type:'Producto',User:1});
   await Permiso.create({id:12 ,Name:'View',Description:'Permite ver Producto',Type:'Producto',User:1});
   await Permiso.create({id:13 ,Name:'Edit',Description:'Permite Editar Productos',Type:'Producto',User:1});
   await Permiso.create({id:14 ,Name:'Create',Description:'Permite Crear Productos',Type:'Producto',User:1});
   await Permiso.create({id:15 ,Name:'View',Description:'Permite ver Pedidos',Type:'Pedido',User:1});
   await Permiso.create({id:16 ,Name:'Edit',Description:'Permite Editar Pedidos',Type:'Pedido',User:1});
   await Permiso.create({id:17 ,Name:'Create',Description:'Permite Crear Pedidos',Type:'Pedido',User:1});
   await Permiso.create({id:18 ,Name:'View',Description:'Permite ver gastos',Type:'Gasto',User:1});
   await Permiso.create({id:19 ,Name:'Edit',Description:'Permite Editar gastos',Type:'Gasto',User:1});
   await Permiso.create({id:20 ,Name:'Create',Description:'Permite Crear gastos',Type:'Gasto',User:1});
   await Categoria.create({id:1,Name:'Sin Categoria', Description:'Productos sin categoria'})
  // 

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();

};
