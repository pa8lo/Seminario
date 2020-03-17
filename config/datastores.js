/**
 * Datastores
 * (sails.config.datastores)
 *
 * A set of datastore configurations which tell Sails where to fetch or save
 * data when you execute built-in model methods like `.find()` and `.create()`.
 *
 *  > This file is mainly useful for configuring your development database,
 *  > as well as any additional one-off databases used by individual models.
 *  > Ready to go live?  Head towards `config/env/production.js`.
 *
 * For more information on configuring datastores, check out:
 * https://sailsjs.com/config/datastores
 */

module.exports.datastores = {


  /***************************************************************************
  *                                                                          *
  * Your app's default datastore.                                            *
  *                                                                          *
  * Sails apps read and write to local disk by default, using a built-in     *
  * database adapter called `sails-disk`.  This feature is purely for        *
  * convenience during development; since `sails-disk` is not designed for   *
  * use in a production environment.                                         *
  *                                                                          *
  * To use a different db _in development_, follow the directions below.     *
  * Otherwise, just leave the default datastore as-is, with no `adapter`.    *
  *                                                                          *
  * (For production configuration, see `config/env/production.js`.)          *
  *                                                                          *
  ***************************************************************************/

  default: {

    /***************************************************************************
    *                                                                          *
    * Want to use a different database during development?                     *
    *                                                                          *
    * 1. Choose an adapter:                                                    *
    *    https://sailsjs.com/plugins/databases                                 *
    *                                                                          *
    * 2. Install it as a dependency of your Sails app.                         *
    *    (For example:  npm install sails-mysql --save)                        *
    *                                                                          *
    * 3. Then pass it in, along with a connection URL.                         *
    *    (See https://sailsjs.com/config/datastores for help.)                 *
    *                                                                          *
    ***************************************************************************/
    // adapter: 'sails-postgresql',
    // url: 'postgres://nhugaulg:exJ3FY7-OSmS8c7WcaLUmymAgX0P1TLw@raja.db.elephantsql.com:5432/nhugaulg', 
     adapter: 'sails-mysql',
    url: 'mysql://sql10327705:8mIEwhUxJs@sql10.freemysqlhosting.net:3306/sql10327705', //Online en internet
    // url: 'mysql://sql10328334:8l4Zb45h7Q@sql10.freemysqlhosting.net:3306/sql10328334', //Online nueva

    // url: 'mysql://E9FBwOknS0:Em6wc60zbg@remotemysql.com:3306/E9FBwOknS0', //Online pruebas
   //url: 'mysql://fJI1aUfvRB:P3I3MQUACw@remotemysql.com:3306/fJI1aUfvRB' ,//ide
    //url: 'mysql://X8oE9dua0u:PR8awkGyw9@remotemysql.com:3306/X8oE9dua0u', //desa
   //url: 'mysql://PoSuHIi0BP:CAeF6XT13v@remotemysql.com:3306/PoSuHIi0BP', //Online Produccipon
    //url: 'mysql://id11472528_roraso:roraso@000webhost.com:3306/id11472528_roraso' ,//ide

    
  //  INSERT INTO `permiso_Users__user_Authorizations` (`id`, `permiso_Users`, `user_Authorizations`) VALUES (NULL, '1', '4'), (NULL, '1', '5'), (NULL, '1', '6'), (NULL, '1', '7'), (NULL, '1', '8'), (NULL, '1', '9'), (NULL, '1', '10'), (NULL, '1', '11'), (NULL, '1', '12'), (NULL, '1', '13'), (NULL, '1', '14'), (NULL, '1', '15'), (NULL, '1', '16'), (NULL, '1', '17'), (NULL, '1', '18'), (NULL, '1', '19'), (NULL, '1', '20'), (NULL, '1', '21'), (NULL, '1', '22'), (NULL, '1', '23');

//url: 'mysql://root@127.0.0.1:3308/seminario',//Facultad
     //url: 'mysql://root@127.0.0.1:14864/seminario',//Casa
     //https://remotemysql.com/databases.php pagina donde esta el sql
     //usuario pablorozek@gmail.com
     //password: magogarre n
  },
};
