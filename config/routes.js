/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */


module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'pages/homepage'
  },

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝

//
// ENDPOINTS USUARIO
//
'GET /User/users': 'UserController.users',

'GET /User/user/': 'UserController.user',

'GET /User/CurrentUser' : 'UserController.CurrentUser',

'GET /User/Authorizations' : 'UserController.UserAuthorizations',

'POST /User/CreateUser': 'UserController.createUser',

'POST /User/Login': 'UserController.Login',

'PUT /User/UpdateUser' : 'UserController.UpdateUser',

'PUT /User/RemoveAuthorization' : 'UserController.RemoveAuthorization',

'PUT /User/AssignAuthorization' : 'UserController.AssignAuthorization',

'GET /User/User' : 'UserController.User',

'PATCH /User/DeleteUser' : 'UserController.DeleteUser',

'PUT /User/ChangeRol' : 'UserController.ChangeRol',
//
// ENDPOINTS CLIENTE
//
'GET /Client/Clients': 'ClienteController.Clients',

'GET /Client/Client' : 'ClienteController.Client',

'POST /Client/CreateCLient' : 'ClienteController.CreateClient',

'POST /Client/AddAddress' : 'ClienteController.AddAddress',

'PUT /Client/UpdateUser' : 'ClienteController.UpdateClient',

'PATCH /Client/DeleteClient' : 'ClienteController.DeleteClient',

//
// ENDPOINSTS ROLES
//
'GET /Rol/Rols' : 'RolController.Rols',

'POST /Rol/RemoveAuthorizations' : 'RolController.RemoveAuthorization',

'POST /Rol/AssignAuthorizations' : 'RolController.AssignAuthorizations',

'POST /Rol/CreateRol': 'RolController.CreateRol',
//'PUT /User/AssignAuthorization' : 'UserController.AssignAuthorization',
//'PATCH /User/DeleteUser' : 'UserController.DeleteUser',
//'PUT /User/UpdateUser' : 'UserController.UpdateUser',
// ENDPOINTS PERMISOS
//
'GET /Auth/Authorizations': 'AuthController.Authorizations',
  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝
  'Post /test/AssignUser': 'RolController.AssignAuthorizations'


};
