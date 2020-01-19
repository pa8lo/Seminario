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
   //  url: 'mysql://sql10254732:I3SeRawNqU@sql10.freemysqlhosting.net:3306/sql10254732', //Online
   url: 'mysql://E9FBwOknS0:Em6wc60zbg@remotemysql.com:3306/E9FBwOknS0', //Online desa
   //url: 'mysql://fJI1aUfvRB:P3I3MQUACw@remotemysql.com:3306/fJI1aUfvRB' //ide
//url: 'mysql://root@127.0.0.1:3308/seminario',//Facultad
     //url: 'mysql://root@127.0.0.1:14864/seminario',//Casa
     //https://remotemysql.com/databases.php pagina donde esta el sql
     //usuario pablorozek@gmail.com
     //password: magogarre n
  },
};
