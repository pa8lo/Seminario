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

'POST /User/AddAddress' : 'ClienteController.AddAddress',

'POST /User/Login': 'UserController.Login',

'PUT /User/UpdateUser' : 'UserController.UpdateUser',

'PUT /User/RemoveAuthorization' : 'UserController.RemoveAuthorization',

'PUT /User/AssignAuthorization' : 'UserController.AssignAuthorization',

'GET /User/User' : 'UserController.User',

'PATCH /User/DeleteUser' : 'UserController.DeleteUser',

'PUT /User/ChangeRol' : 'UserController.ChangeRol',

'POST /User/ChangePassword' : 'UserController.ChangePassword',
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

'GET /Rol/Rol' : 'RolController.Rol',

'POST /Rol/RemoveAuthorizations' : 'RolController.RemoveAuthorization',

'POST /Rol/AssignAuthorizations' : 'RolController.AssignAuthorizations',

'POST /Rol/CreateRol': 'RolController.CreateRol',

'POST /Rol/UpdateRol' : 'RolController.UpdateRol',

'POST /Rol/DeleteRol' : 'RolController.DeleteRol',
// ENDPOINTS PERMISOS
//
'GET /Auth/Authorizations': 'AuthController.Authorizations',

// ENDPOINTS DIRECCIÓNES
//
'POST /Adress/UpdateAddress' : 'DireccionController.UpdateAddress',


// ENDPOINTS PRODUCTOS
//
'POST /Product/CreateProduct': 'ProductoController.createProduct',

'GET  /Product/Products' : 'ProductoController.products',

'POST /Product/DeleteProduct': 'ProductoController.deleteProduct',

// 'POST /Product/UpdateProduct': 'ProductoController.updateProduct',

// ENDPOINTS CATEGORIA
//
'GET /Category/Categories' : 'CategoriaController.categories',

'POST /Category/CreateCategory' : 'CategoriaController.createCategory',

'POST /Category/DeleteCategory' : 'CategoriaController.deleteCategory',

'POST /Category/UpdateCategory' : 'CategoriaController.updateCategory',

'Post /Category/Products' : 'CategoriaController.products',

'POST /Category/Category' : 'CategoriaController.category',

// ENDPOINTS ITEMS
//

'GET /Item/Items'  : 'ItemController.items',

'POST /Item/Delete' : 'ItemController.deleteItem',

'POST /Item/Create' : 'ItemController.createItem',

'POST /Item/UpdateItem' : 'ItemController.updateItem',

//ENDPOINTS PEDIDOS
//

'GET /Pedido/Pedidos' : 'PedidoController.Orders',

'POST /Pedido/Create' : 'PedidoController.CreateOrder',


//ENDPOINTS ESTADO
//

'GET /Estado/Estados' : 'EstadoController.states',

'POST /Estado/Create' : 'EstadoController.createState',

'POST /Estado/Delete' : 'EstadoController.deleteState',

'POST /Estado/Update' : 'EstadoController.UpdateState' ,

'POST /Estado/Orders' :  'EstadoController.seeOrders',

//ENDPOINTS GASTO
//
'GET /Gasto/Expenses' : 'GastoController.expenses',

'POST /Gasto/Create' : 'GastoController.createExpense',

'POST /Gasto/Delete' : 'GastoController.deleteExpense',

'POST /Gasto/Update' : 'GastoController.UpdateExpense' ,

//ENDPOINTS Combos
//
'GET /Offerts/Offerts' : 'ComboController.Offerts',

'POST /Offerts/Create' : 'ComboController.createOffert',

'POST /Offerts/Delete' : 'ComboController.deleteOffert',

// 'POST /Gasto/Update' : 'GastoController.UpdateExpense' ,



  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝



};
