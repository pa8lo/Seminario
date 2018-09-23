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
   await Permiso.create({id:1 ,Name:'Usuario',Description:'Permite la creacion de ver , crear,editar y eliminar usuario',User:1})
  // 

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();

};