// CommonJS package manager support
if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
  // Export the *name* of this Angular module
  // Sample usage:
  //
  //   import lbServices from './lb-services';
  //   angular.module('app', [lbServices]);
  //
  module.exports = "apiServices";
}

(function(window, angular, undefined) {'use strict';

var urlBase = "/api";
var authHeader = 'authorization';

function getHost(url) {
  var m = url.match(/^(?:https?:)?\/\/([^\/]+)/);
  return m ? m[1] : null;
}

var urlBaseHost = getHost(urlBase) || location.host;


/**
 * @ngdoc overview
 * @name apiServices
 * @module
 * @description
 *
 * The `apiServices` module provides services for interacting with
 * the models exposed by the LoopBack server via the REST API.
 *
 */
var module = angular.module("apiServices", ['ngResource']);

/**
 * @ngdoc object
 * @name apiServices.User
 * @header apiServices.User
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `User` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "User",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Users/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name apiServices.User#prototype$__findById__accessTokens
         * @methodOf apiServices.User
         *
         * @description
         *
         * Find a related item by id for accessTokens.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "prototype$__findById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Users/:id/accessTokens/:fk",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#prototype$__destroyById__accessTokens
         * @methodOf apiServices.User
         *
         * @description
         *
         * Delete a related item by id for accessTokens.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__destroyById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Users/:id/accessTokens/:fk",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#prototype$__updateById__accessTokens
         * @methodOf apiServices.User
         *
         * @description
         *
         * Update a related item by id for accessTokens.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "prototype$__updateById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Users/:id/accessTokens/:fk",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#prototype$__get__accessTokens
         * @methodOf apiServices.User
         *
         * @description
         *
         * Queries accessTokens of User.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "prototype$__get__accessTokens": {
          isArray: true,
          url: urlBase + "/Users/:id/accessTokens",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#prototype$__create__accessTokens
         * @methodOf apiServices.User
         *
         * @description
         *
         * Creates a new instance in accessTokens of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "prototype$__create__accessTokens": {
          url: urlBase + "/Users/:id/accessTokens",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#prototype$__delete__accessTokens
         * @methodOf apiServices.User
         *
         * @description
         *
         * Deletes all accessTokens of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__delete__accessTokens": {
          url: urlBase + "/Users/:id/accessTokens",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#prototype$__count__accessTokens
         * @methodOf apiServices.User
         *
         * @description
         *
         * Counts accessTokens of User.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "prototype$__count__accessTokens": {
          url: urlBase + "/Users/:id/accessTokens/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#create
         * @methodOf apiServices.User
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/Users",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#createMany
         * @methodOf apiServices.User
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/Users",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#upsert
         * @methodOf apiServices.User
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/Users",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#exists
         * @methodOf apiServices.User
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/Users/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#findById
         * @methodOf apiServices.User
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/Users/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#find
         * @methodOf apiServices.User
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/Users",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#findOne
         * @methodOf apiServices.User
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/Users/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#updateAll
         * @methodOf apiServices.User
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/Users/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#deleteById
         * @methodOf apiServices.User
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/Users/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#count
         * @methodOf apiServices.User
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/Users/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#prototype$updateAttributes
         * @methodOf apiServices.User
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/Users/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#createChangeStream
         * @methodOf apiServices.User
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/Users/change-stream",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#login
         * @methodOf apiServices.User
         *
         * @description
         *
         * Login a user with username/email and password.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `include` – `{string=}` - Related objects to include in the response. See the description of return value for more details.
         *   Default value: `user`.
         *
         *  - `rememberMe` - `boolean` - Whether the authentication credentials
         *     should be remembered in localStorage across app/browser restarts.
         *     Default: `true`.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The response body contains properties of the AccessToken created on login.
         * Depending on the value of `include` parameter, the body may contain additional properties:
         *
         *   - `user` - `{User}` - Data of the currently logged in user. (`include=user`)
         *
         *
         */
        "login": {
          params: {
            include: "user"
          },
          interceptor: {
            response: function(response) {
              var accessToken = response.data;
              LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
              LoopBackAuth.rememberMe = response.config.params.rememberMe !== false;
              LoopBackAuth.save();
              return response.resource;
            }
          },
          url: urlBase + "/Users/login",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#logout
         * @methodOf apiServices.User
         *
         * @description
         *
         * Logout a user with access token.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `access_token` – `{string}` - Do not supply this argument, it is automatically extracted from request headers.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "logout": {
          interceptor: {
            response: function(response) {
              LoopBackAuth.clearUser();
              LoopBackAuth.clearStorage();
              return response.resource;
            }
          },
          url: urlBase + "/Users/logout",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#confirm
         * @methodOf apiServices.User
         *
         * @description
         *
         * Confirm a user registration with email verification token.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `uid` – `{string}` -
         *
         *  - `token` – `{string}` -
         *
         *  - `redirect` – `{string=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "confirm": {
          url: urlBase + "/Users/confirm",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#resetPassword
         * @methodOf apiServices.User
         *
         * @description
         *
         * Reset password for a user with email.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "resetPassword": {
          url: urlBase + "/Users/reset",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.User#getCurrent
         * @methodOf apiServices.User
         *
         * @description
         *
         * Get data of the currently logged user. Fail with HTTP result 401
         * when there is no user logged in.
         *
         * @param {function(Object,Object)=} successCb
         *    Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *    `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         */
        "getCurrent": {
           url: urlBase + "/Users" + "/:id",
           method: "GET",
           params: {
             id: function() {
              var id = LoopBackAuth.currentUserId;
              if (id == null) id = '__anonymous__';
              return id;
            },
          },
          interceptor: {
            response: function(response) {
              LoopBackAuth.currentUserData = response.data;
              return response.resource;
            }
          },
          __isGetCurrentUser__ : true
        }
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.User#updateOrCreate
         * @methodOf apiServices.User
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.User#update
         * @methodOf apiServices.User
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.User#destroyById
         * @methodOf apiServices.User
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.User#removeById
         * @methodOf apiServices.User
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.User#getCachedCurrent
         * @methodOf apiServices.User
         *
         * @description
         *
         * Get data of the currently logged user that was returned by the last
         * call to {@link apiServices.User#login} or
         * {@link apiServices.User#getCurrent}. Return null when there
         * is no user logged in or the data of the current user were not fetched
         * yet.
         *
         * @returns {Object} A User instance.
         */
        R.getCachedCurrent = function() {
          var data = LoopBackAuth.currentUserData;
          return data ? new R(data) : null;
        };

        /**
         * @ngdoc method
         * @name apiServices.User#isAuthenticated
         * @methodOf apiServices.User
         *
         * @returns {boolean} True if the current user is authenticated (logged in).
         */
        R.isAuthenticated = function() {
          return this.getCurrentId() != null;
        };

        /**
         * @ngdoc method
         * @name apiServices.User#getCurrentId
         * @methodOf apiServices.User
         *
         * @returns {Object} Id of the currently logged-in user or null.
         */
        R.getCurrentId = function() {
          return LoopBackAuth.currentUserId;
        };

    /**
    * @ngdoc property
    * @name apiServices.User#modelName
    * @propertyOf apiServices.User
    * @description
    * The name of the model represented by this $resource,
    * i.e. `User`.
    */
    R.modelName = "User";


    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.Advocate
 * @header apiServices.Advocate
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Advocate` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Advocate",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/advocates/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use Advocate.lawFirm() instead.
        "prototype$__get__lawFirm": {
          url: urlBase + "/advocates/:id/lawFirm",
          method: "GET"
        },

        // INTERNAL. Use Advocate.appearance.findById() instead.
        "prototype$__findById__appearance": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/advocates/:id/appearance/:fk",
          method: "GET"
        },

        // INTERNAL. Use Advocate.appearance.destroyById() instead.
        "prototype$__destroyById__appearance": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/advocates/:id/appearance/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Advocate.appearance.updateById() instead.
        "prototype$__updateById__appearance": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/advocates/:id/appearance/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Advocate.appearance.link() instead.
        "prototype$__link__appearance": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/advocates/:id/appearance/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Advocate.appearance.unlink() instead.
        "prototype$__unlink__appearance": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/advocates/:id/appearance/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Advocate.appearance.exists() instead.
        "prototype$__exists__appearance": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/advocates/:id/appearance/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use Advocate.appearance() instead.
        "prototype$__get__appearance": {
          isArray: true,
          url: urlBase + "/advocates/:id/appearance",
          method: "GET"
        },

        // INTERNAL. Use Advocate.appearance.create() instead.
        "prototype$__create__appearance": {
          url: urlBase + "/advocates/:id/appearance",
          method: "POST"
        },

        // INTERNAL. Use Advocate.appearance.destroyAll() instead.
        "prototype$__delete__appearance": {
          url: urlBase + "/advocates/:id/appearance",
          method: "DELETE"
        },

        // INTERNAL. Use Advocate.appearance.count() instead.
        "prototype$__count__appearance": {
          url: urlBase + "/advocates/:id/appearance/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Advocate#create
         * @methodOf apiServices.Advocate
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Advocate` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/advocates",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Advocate#createMany
         * @methodOf apiServices.Advocate
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Advocate` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/advocates",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Advocate#upsert
         * @methodOf apiServices.Advocate
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Advocate` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/advocates",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Advocate#exists
         * @methodOf apiServices.Advocate
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/advocates/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Advocate#findById
         * @methodOf apiServices.Advocate
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Advocate` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/advocates/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Advocate#find
         * @methodOf apiServices.Advocate
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Advocate` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/advocates",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Advocate#findOne
         * @methodOf apiServices.Advocate
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Advocate` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/advocates/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Advocate#updateAll
         * @methodOf apiServices.Advocate
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/advocates/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Advocate#deleteById
         * @methodOf apiServices.Advocate
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Advocate` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/advocates/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.Advocate#count
         * @methodOf apiServices.Advocate
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/advocates/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Advocate#prototype$updateAttributes
         * @methodOf apiServices.Advocate
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Advocate` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/advocates/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Advocate#createChangeStream
         * @methodOf apiServices.Advocate
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/advocates/change-stream",
          method: "POST"
        },

        // INTERNAL. Use LawFirm.advocates.findById() instead.
        "::findById::lawFirm::advocates": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/lawFirms/:id/advocates/:fk",
          method: "GET"
        },

        // INTERNAL. Use LawFirm.advocates.destroyById() instead.
        "::destroyById::lawFirm::advocates": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/lawFirms/:id/advocates/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use LawFirm.advocates.updateById() instead.
        "::updateById::lawFirm::advocates": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/lawFirms/:id/advocates/:fk",
          method: "PUT"
        },

        // INTERNAL. Use LawFirm.advocates() instead.
        "::get::lawFirm::advocates": {
          isArray: true,
          url: urlBase + "/lawFirms/:id/advocates",
          method: "GET"
        },

        // INTERNAL. Use LawFirm.advocates.create() instead.
        "::create::lawFirm::advocates": {
          url: urlBase + "/lawFirms/:id/advocates",
          method: "POST"
        },

        // INTERNAL. Use LawFirm.advocates.createMany() instead.
        "::createMany::lawFirm::advocates": {
          isArray: true,
          url: urlBase + "/lawFirms/:id/advocates",
          method: "POST"
        },

        // INTERNAL. Use LawFirm.advocates.destroyAll() instead.
        "::delete::lawFirm::advocates": {
          url: urlBase + "/lawFirms/:id/advocates",
          method: "DELETE"
        },

        // INTERNAL. Use LawFirm.advocates.count() instead.
        "::count::lawFirm::advocates": {
          url: urlBase + "/lawFirms/:id/advocates/count",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.Advocate#updateOrCreate
         * @methodOf apiServices.Advocate
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Advocate` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.Advocate#update
         * @methodOf apiServices.Advocate
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.Advocate#destroyById
         * @methodOf apiServices.Advocate
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Advocate` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.Advocate#removeById
         * @methodOf apiServices.Advocate
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Advocate` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.Advocate#modelName
    * @propertyOf apiServices.Advocate
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Advocate`.
    */
    R.modelName = "Advocate";


        /**
         * @ngdoc method
         * @name apiServices.Advocate#lawFirm
         * @methodOf apiServices.Advocate
         *
         * @description
         *
         * Fetches belongsTo relation lawFirm.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LawFirm` object.)
         * </em>
         */
        R.lawFirm = function() {
          var TargetResource = $injector.get("LawFirm");
          var action = TargetResource["::get::advocate::lawFirm"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name apiServices.Advocate.appearance
     * @header apiServices.Advocate.appearance
     * @object
     * @description
     *
     * The object `Advocate.appearance` groups methods
     * manipulating `Appearance` instances related to `Advocate`.
     *
     * Call {@link apiServices.Advocate#appearance Advocate.appearance()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name apiServices.Advocate#appearance
         * @methodOf apiServices.Advocate
         *
         * @description
         *
         * Queries appearance of advocate.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appearance` object.)
         * </em>
         */
        R.appearance = function() {
          var TargetResource = $injector.get("Appearance");
          var action = TargetResource["::get::advocate::appearance"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Advocate.appearance#count
         * @methodOf apiServices.Advocate.appearance
         *
         * @description
         *
         * Counts appearance of advocate.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        R.appearance.count = function() {
          var TargetResource = $injector.get("Appearance");
          var action = TargetResource["::count::advocate::appearance"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Advocate.appearance#create
         * @methodOf apiServices.Advocate.appearance
         *
         * @description
         *
         * Creates a new instance in appearance of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appearance` object.)
         * </em>
         */
        R.appearance.create = function() {
          var TargetResource = $injector.get("Appearance");
          var action = TargetResource["::create::advocate::appearance"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Advocate.appearance#createMany
         * @methodOf apiServices.Advocate.appearance
         *
         * @description
         *
         * Creates a new instance in appearance of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appearance` object.)
         * </em>
         */
        R.appearance.createMany = function() {
          var TargetResource = $injector.get("Appearance");
          var action = TargetResource["::createMany::advocate::appearance"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Advocate.appearance#destroyAll
         * @methodOf apiServices.Advocate.appearance
         *
         * @description
         *
         * Deletes all appearance of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.appearance.destroyAll = function() {
          var TargetResource = $injector.get("Appearance");
          var action = TargetResource["::delete::advocate::appearance"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Advocate.appearance#destroyById
         * @methodOf apiServices.Advocate.appearance
         *
         * @description
         *
         * Delete a related item by id for appearance.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for appearance
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.appearance.destroyById = function() {
          var TargetResource = $injector.get("Appearance");
          var action = TargetResource["::destroyById::advocate::appearance"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Advocate.appearance#exists
         * @methodOf apiServices.Advocate.appearance
         *
         * @description
         *
         * Check the existence of appearance relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for appearance
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appearance` object.)
         * </em>
         */
        R.appearance.exists = function() {
          var TargetResource = $injector.get("Appearance");
          var action = TargetResource["::exists::advocate::appearance"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Advocate.appearance#findById
         * @methodOf apiServices.Advocate.appearance
         *
         * @description
         *
         * Find a related item by id for appearance.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for appearance
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appearance` object.)
         * </em>
         */
        R.appearance.findById = function() {
          var TargetResource = $injector.get("Appearance");
          var action = TargetResource["::findById::advocate::appearance"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Advocate.appearance#link
         * @methodOf apiServices.Advocate.appearance
         *
         * @description
         *
         * Add a related item by id for appearance.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for appearance
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appearance` object.)
         * </em>
         */
        R.appearance.link = function() {
          var TargetResource = $injector.get("Appearance");
          var action = TargetResource["::link::advocate::appearance"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Advocate.appearance#unlink
         * @methodOf apiServices.Advocate.appearance
         *
         * @description
         *
         * Remove the appearance relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for appearance
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.appearance.unlink = function() {
          var TargetResource = $injector.get("Appearance");
          var action = TargetResource["::unlink::advocate::appearance"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Advocate.appearance#updateById
         * @methodOf apiServices.Advocate.appearance
         *
         * @description
         *
         * Update a related item by id for appearance.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for appearance
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appearance` object.)
         * </em>
         */
        R.appearance.updateById = function() {
          var TargetResource = $injector.get("Appearance");
          var action = TargetResource["::updateById::advocate::appearance"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.AreaOfLaw
 * @header apiServices.AreaOfLaw
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `AreaOfLaw` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "AreaOfLaw",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/areaOfLaws/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use AreaOfLaw.parent() instead.
        "prototype$__get__parent": {
          url: urlBase + "/areaOfLaws/:id/parent",
          method: "GET"
        },

        // INTERNAL. Use AreaOfLaw.parent.create() instead.
        "prototype$__create__parent": {
          url: urlBase + "/areaOfLaws/:id/parent",
          method: "POST"
        },

        // INTERNAL. Use AreaOfLaw.parent.update() instead.
        "prototype$__update__parent": {
          url: urlBase + "/areaOfLaws/:id/parent",
          method: "PUT"
        },

        // INTERNAL. Use AreaOfLaw.parent.destroy() instead.
        "prototype$__destroy__parent": {
          url: urlBase + "/areaOfLaws/:id/parent",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw#create
         * @methodOf apiServices.AreaOfLaw
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AreaOfLaw` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/areaOfLaws",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw#createMany
         * @methodOf apiServices.AreaOfLaw
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AreaOfLaw` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/areaOfLaws",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw#upsert
         * @methodOf apiServices.AreaOfLaw
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AreaOfLaw` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/areaOfLaws",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw#exists
         * @methodOf apiServices.AreaOfLaw
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/areaOfLaws/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw#findById
         * @methodOf apiServices.AreaOfLaw
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AreaOfLaw` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/areaOfLaws/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw#find
         * @methodOf apiServices.AreaOfLaw
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AreaOfLaw` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/areaOfLaws",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw#findOne
         * @methodOf apiServices.AreaOfLaw
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AreaOfLaw` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/areaOfLaws/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw#updateAll
         * @methodOf apiServices.AreaOfLaw
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/areaOfLaws/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw#deleteById
         * @methodOf apiServices.AreaOfLaw
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AreaOfLaw` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/areaOfLaws/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw#count
         * @methodOf apiServices.AreaOfLaw
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/areaOfLaws/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw#prototype$updateAttributes
         * @methodOf apiServices.AreaOfLaw
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AreaOfLaw` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/areaOfLaws/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw#createChangeStream
         * @methodOf apiServices.AreaOfLaw
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/areaOfLaws/change-stream",
          method: "POST"
        },

        // INTERNAL. Use AreaOfLaw.parent() instead.
        "::get::areaOfLaw::parent": {
          url: urlBase + "/areaOfLaws/:id/parent",
          method: "GET"
        },

        // INTERNAL. Use AreaOfLaw.parent.create() instead.
        "::create::areaOfLaw::parent": {
          url: urlBase + "/areaOfLaws/:id/parent",
          method: "POST"
        },

        // INTERNAL. Use AreaOfLaw.parent.createMany() instead.
        "::createMany::areaOfLaw::parent": {
          isArray: true,
          url: urlBase + "/areaOfLaws/:id/parent",
          method: "POST"
        },

        // INTERNAL. Use AreaOfLaw.parent.update() instead.
        "::update::areaOfLaw::parent": {
          url: urlBase + "/areaOfLaws/:id/parent",
          method: "PUT"
        },

        // INTERNAL. Use AreaOfLaw.parent.destroy() instead.
        "::destroy::areaOfLaw::parent": {
          url: urlBase + "/areaOfLaws/:id/parent",
          method: "DELETE"
        },

        // INTERNAL. Use Case.areaOfLaw() instead.
        "::get::case::areaOfLaw": {
          url: urlBase + "/cases/:id/areaOfLaw",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw#updateOrCreate
         * @methodOf apiServices.AreaOfLaw
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AreaOfLaw` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw#update
         * @methodOf apiServices.AreaOfLaw
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw#destroyById
         * @methodOf apiServices.AreaOfLaw
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AreaOfLaw` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw#removeById
         * @methodOf apiServices.AreaOfLaw
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AreaOfLaw` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.AreaOfLaw#modelName
    * @propertyOf apiServices.AreaOfLaw
    * @description
    * The name of the model represented by this $resource,
    * i.e. `AreaOfLaw`.
    */
    R.modelName = "AreaOfLaw";

    /**
     * @ngdoc object
     * @name apiServices.AreaOfLaw.parent
     * @header apiServices.AreaOfLaw.parent
     * @object
     * @description
     *
     * The object `AreaOfLaw.parent` groups methods
     * manipulating `AreaOfLaw` instances related to `AreaOfLaw`.
     *
     * Call {@link apiServices.AreaOfLaw#parent AreaOfLaw.parent()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw#parent
         * @methodOf apiServices.AreaOfLaw
         *
         * @description
         *
         * Fetches hasOne relation parent.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AreaOfLaw` object.)
         * </em>
         */
        R.parent = function() {
          var TargetResource = $injector.get("AreaOfLaw");
          var action = TargetResource["::get::areaOfLaw::parent"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw.parent#create
         * @methodOf apiServices.AreaOfLaw.parent
         *
         * @description
         *
         * Creates a new instance in parent of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AreaOfLaw` object.)
         * </em>
         */
        R.parent.create = function() {
          var TargetResource = $injector.get("AreaOfLaw");
          var action = TargetResource["::create::areaOfLaw::parent"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw.parent#createMany
         * @methodOf apiServices.AreaOfLaw.parent
         *
         * @description
         *
         * Creates a new instance in parent of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AreaOfLaw` object.)
         * </em>
         */
        R.parent.createMany = function() {
          var TargetResource = $injector.get("AreaOfLaw");
          var action = TargetResource["::createMany::areaOfLaw::parent"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw.parent#destroy
         * @methodOf apiServices.AreaOfLaw.parent
         *
         * @description
         *
         * Deletes parent of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.parent.destroy = function() {
          var TargetResource = $injector.get("AreaOfLaw");
          var action = TargetResource["::destroy::areaOfLaw::parent"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.AreaOfLaw.parent#update
         * @methodOf apiServices.AreaOfLaw.parent
         *
         * @description
         *
         * Update parent of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AreaOfLaw` object.)
         * </em>
         */
        R.parent.update = function() {
          var TargetResource = $injector.get("AreaOfLaw");
          var action = TargetResource["::update::areaOfLaw::parent"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.CaseLegislations
 * @header apiServices.CaseLegislations
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `CaseLegislations` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "CaseLegislations",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/caseLegislations/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use CaseLegislations.case() instead.
        "prototype$__get__case": {
          url: urlBase + "/caseLegislations/:id/case",
          method: "GET"
        },

        // INTERNAL. Use CaseLegislations.legislation() instead.
        "prototype$__get__legislation": {
          url: urlBase + "/caseLegislations/:id/legislation",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseLegislations#create
         * @methodOf apiServices.CaseLegislations
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseLegislations` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/caseLegislations",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseLegislations#createMany
         * @methodOf apiServices.CaseLegislations
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseLegislations` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/caseLegislations",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseLegislations#upsert
         * @methodOf apiServices.CaseLegislations
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseLegislations` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/caseLegislations",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseLegislations#exists
         * @methodOf apiServices.CaseLegislations
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/caseLegislations/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseLegislations#findById
         * @methodOf apiServices.CaseLegislations
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseLegislations` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/caseLegislations/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseLegislations#find
         * @methodOf apiServices.CaseLegislations
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseLegislations` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/caseLegislations",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseLegislations#findOne
         * @methodOf apiServices.CaseLegislations
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseLegislations` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/caseLegislations/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseLegislations#updateAll
         * @methodOf apiServices.CaseLegislations
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/caseLegislations/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseLegislations#deleteById
         * @methodOf apiServices.CaseLegislations
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseLegislations` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/caseLegislations/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseLegislations#count
         * @methodOf apiServices.CaseLegislations
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/caseLegislations/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseLegislations#prototype$updateAttributes
         * @methodOf apiServices.CaseLegislations
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseLegislations` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/caseLegislations/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseLegislations#createChangeStream
         * @methodOf apiServices.CaseLegislations
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/caseLegislations/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.CaseLegislations#updateOrCreate
         * @methodOf apiServices.CaseLegislations
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseLegislations` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.CaseLegislations#update
         * @methodOf apiServices.CaseLegislations
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.CaseLegislations#destroyById
         * @methodOf apiServices.CaseLegislations
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseLegislations` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.CaseLegislations#removeById
         * @methodOf apiServices.CaseLegislations
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseLegislations` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.CaseLegislations#modelName
    * @propertyOf apiServices.CaseLegislations
    * @description
    * The name of the model represented by this $resource,
    * i.e. `CaseLegislations`.
    */
    R.modelName = "CaseLegislations";


        /**
         * @ngdoc method
         * @name apiServices.CaseLegislations#case
         * @methodOf apiServices.CaseLegislations
         *
         * @description
         *
         * Fetches belongsTo relation case.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.case = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::get::caseLegislations::case"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.CaseLegislations#legislation
         * @methodOf apiServices.CaseLegislations
         *
         * @description
         *
         * Fetches belongsTo relation legislation.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        R.legislation = function() {
          var TargetResource = $injector.get("Legislation");
          var action = TargetResource["::get::caseLegislations::legislation"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.Case
 * @header apiServices.Case
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Case` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Case",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/cases/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use Case.areaOfLaw() instead.
        "prototype$__get__areaOfLaw": {
          url: urlBase + "/cases/:id/areaOfLaw",
          method: "GET"
        },

        // INTERNAL. Use Case.casesReferedTo.findById() instead.
        "prototype$__findById__casesReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/casesReferedTo/:fk",
          method: "GET"
        },

        // INTERNAL. Use Case.casesReferedTo.destroyById() instead.
        "prototype$__destroyById__casesReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/casesReferedTo/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Case.casesReferedTo.updateById() instead.
        "prototype$__updateById__casesReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/casesReferedTo/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Case.casesReferedTo.link() instead.
        "prototype$__link__casesReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/casesReferedTo/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Case.casesReferedTo.unlink() instead.
        "prototype$__unlink__casesReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/casesReferedTo/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Case.casesReferedTo.exists() instead.
        "prototype$__exists__casesReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/casesReferedTo/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use Case.court() instead.
        "prototype$__get__court": {
          url: urlBase + "/cases/:id/court",
          method: "GET"
        },

        // INTERNAL. Use Case.legislationsReferedTo.findById() instead.
        "prototype$__findById__legislationsReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/legislationsReferedTo/:fk",
          method: "GET"
        },

        // INTERNAL. Use Case.legislationsReferedTo.destroyById() instead.
        "prototype$__destroyById__legislationsReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/legislationsReferedTo/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Case.legislationsReferedTo.updateById() instead.
        "prototype$__updateById__legislationsReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/legislationsReferedTo/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Case.legislationsReferedTo.link() instead.
        "prototype$__link__legislationsReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/legislationsReferedTo/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Case.legislationsReferedTo.unlink() instead.
        "prototype$__unlink__legislationsReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/legislationsReferedTo/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Case.legislationsReferedTo.exists() instead.
        "prototype$__exists__legislationsReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/legislationsReferedTo/rel/:fk",
          method: "HEAD"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#prototype$__findById__workReferedTo
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Find a related item by id for workReferedTo.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for workReferedTo
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        "prototype$__findById__workReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/workReferedTo/:fk",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#prototype$__destroyById__workReferedTo
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Delete a related item by id for workReferedTo.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for workReferedTo
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__destroyById__workReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/workReferedTo/:fk",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#prototype$__updateById__workReferedTo
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Update a related item by id for workReferedTo.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for workReferedTo
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        "prototype$__updateById__workReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/workReferedTo/:fk",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#prototype$__link__workReferedTo
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Add a related item by id for workReferedTo.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for workReferedTo
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        "prototype$__link__workReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/workReferedTo/rel/:fk",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#prototype$__unlink__workReferedTo
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Remove the workReferedTo relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for workReferedTo
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__unlink__workReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/workReferedTo/rel/:fk",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#prototype$__exists__workReferedTo
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Check the existence of workReferedTo relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for workReferedTo
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        "prototype$__exists__workReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/workReferedTo/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use Case.plaintiffSynonym() instead.
        "prototype$__get__plaintiffSynonym": {
          url: urlBase + "/cases/:id/plaintiffSynonym",
          method: "GET"
        },

        // INTERNAL. Use Case.defendantSynonym() instead.
        "prototype$__get__defendantSynonym": {
          url: urlBase + "/cases/:id/defendantSynonym",
          method: "GET"
        },

        // INTERNAL. Use Case.jurisdiction() instead.
        "prototype$__get__jurisdiction": {
          url: urlBase + "/cases/:id/jurisdiction",
          method: "GET"
        },

        // INTERNAL. Use Case.location() instead.
        "prototype$__get__location": {
          url: urlBase + "/cases/:id/location",
          method: "GET"
        },

        // INTERNAL. Use Case.courtDivision() instead.
        "prototype$__get__courtDivision": {
          url: urlBase + "/cases/:id/courtDivision",
          method: "GET"
        },

        // INTERNAL. Use Case.casesReferedTo() instead.
        "prototype$__get__casesReferedTo": {
          isArray: true,
          url: urlBase + "/cases/:id/casesReferedTo",
          method: "GET"
        },

        // INTERNAL. Use Case.casesReferedTo.create() instead.
        "prototype$__create__casesReferedTo": {
          url: urlBase + "/cases/:id/casesReferedTo",
          method: "POST"
        },

        // INTERNAL. Use Case.casesReferedTo.destroyAll() instead.
        "prototype$__delete__casesReferedTo": {
          url: urlBase + "/cases/:id/casesReferedTo",
          method: "DELETE"
        },

        // INTERNAL. Use Case.casesReferedTo.count() instead.
        "prototype$__count__casesReferedTo": {
          url: urlBase + "/cases/:id/casesReferedTo/count",
          method: "GET"
        },

        // INTERNAL. Use Case.legislationsReferedTo() instead.
        "prototype$__get__legislationsReferedTo": {
          isArray: true,
          url: urlBase + "/cases/:id/legislationsReferedTo",
          method: "GET"
        },

        // INTERNAL. Use Case.legislationsReferedTo.create() instead.
        "prototype$__create__legislationsReferedTo": {
          url: urlBase + "/cases/:id/legislationsReferedTo",
          method: "POST"
        },

        // INTERNAL. Use Case.legislationsReferedTo.destroyAll() instead.
        "prototype$__delete__legislationsReferedTo": {
          url: urlBase + "/cases/:id/legislationsReferedTo",
          method: "DELETE"
        },

        // INTERNAL. Use Case.legislationsReferedTo.count() instead.
        "prototype$__count__legislationsReferedTo": {
          url: urlBase + "/cases/:id/legislationsReferedTo/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#prototype$__get__workReferedTo
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Queries workReferedTo of case.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        "prototype$__get__workReferedTo": {
          isArray: true,
          url: urlBase + "/cases/:id/workReferedTo",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#prototype$__create__workReferedTo
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Creates a new instance in workReferedTo of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        "prototype$__create__workReferedTo": {
          url: urlBase + "/cases/:id/workReferedTo",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#prototype$__delete__workReferedTo
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Deletes all workReferedTo of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__delete__workReferedTo": {
          url: urlBase + "/cases/:id/workReferedTo",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#prototype$__count__workReferedTo
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Counts workReferedTo of case.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "prototype$__count__workReferedTo": {
          url: urlBase + "/cases/:id/workReferedTo/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#create
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/cases",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#createMany
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/cases",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#upsert
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/cases",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#exists
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/cases/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#findById
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/cases/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#find
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        "find": {
          url: urlBase + "/cases",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#findOne
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/cases/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#updateAll
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/cases/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#deleteById
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/cases/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#count
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/cases/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#prototype$updateAttributes
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/cases/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#createChangeStream
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/cases/change-stream",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Case#generateNames
         * @methodOf apiServices.Case
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `names` – `{string=}` -
         */
        "generateNames": {
          url: urlBase + "/cases/generatenames",
          method: "GET"
        },

        // INTERNAL. Use CaseLegislations.case() instead.
        "::get::caseLegislations::case": {
          url: urlBase + "/caseLegislations/:id/case",
          method: "GET"
        },

        // INTERNAL. Use Case.casesReferedTo.findById() instead.
        "::findById::case::casesReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/casesReferedTo/:fk",
          method: "GET"
        },

        // INTERNAL. Use Case.casesReferedTo.destroyById() instead.
        "::destroyById::case::casesReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/casesReferedTo/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Case.casesReferedTo.updateById() instead.
        "::updateById::case::casesReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/casesReferedTo/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Case.casesReferedTo.link() instead.
        "::link::case::casesReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/casesReferedTo/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Case.casesReferedTo.unlink() instead.
        "::unlink::case::casesReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/casesReferedTo/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Case.casesReferedTo.exists() instead.
        "::exists::case::casesReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/casesReferedTo/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use Case.casesReferedTo() instead.
        "::get::case::casesReferedTo": {
          isArray: true,
          url: urlBase + "/cases/:id/casesReferedTo",
          method: "GET"
        },

        // INTERNAL. Use Case.casesReferedTo.create() instead.
        "::create::case::casesReferedTo": {
          url: urlBase + "/cases/:id/casesReferedTo",
          method: "POST"
        },

        // INTERNAL. Use Case.casesReferedTo.createMany() instead.
        "::createMany::case::casesReferedTo": {
          isArray: true,
          url: urlBase + "/cases/:id/casesReferedTo",
          method: "POST"
        },

        // INTERNAL. Use Case.casesReferedTo.destroyAll() instead.
        "::delete::case::casesReferedTo": {
          url: urlBase + "/cases/:id/casesReferedTo",
          method: "DELETE"
        },

        // INTERNAL. Use Case.casesReferedTo.count() instead.
        "::count::case::casesReferedTo": {
          url: urlBase + "/cases/:id/casesReferedTo/count",
          method: "GET"
        },

        // INTERNAL. Use CaseCases.case() instead.
        "::get::caseCases::case": {
          url: urlBase + "/caseCases/:id/case",
          method: "GET"
        },

        // INTERNAL. Use CaseCases.caseReferedTo() instead.
        "::get::caseCases::caseReferedTo": {
          url: urlBase + "/caseCases/:id/caseReferedTo",
          method: "GET"
        },

        // INTERNAL. Use CaseWorks.case() instead.
        "::get::caseWorks::case": {
          url: urlBase + "/caseWorks/:id/case",
          method: "GET"
        },

        // INTERNAL. Use Citation.case() instead.
        "::get::citation::case": {
          url: urlBase + "/citations/:id/case",
          method: "GET"
        },

        // INTERNAL. Use Citation.case.create() instead.
        "::create::citation::case": {
          url: urlBase + "/citations/:id/case",
          method: "POST"
        },

        // INTERNAL. Use Citation.case.createMany() instead.
        "::createMany::citation::case": {
          isArray: true,
          url: urlBase + "/citations/:id/case",
          method: "POST"
        },

        // INTERNAL. Use Citation.case.update() instead.
        "::update::citation::case": {
          url: urlBase + "/citations/:id/case",
          method: "PUT"
        },

        // INTERNAL. Use Citation.case.destroy() instead.
        "::destroy::citation::case": {
          url: urlBase + "/citations/:id/case",
          method: "DELETE"
        },

        // INTERNAL. Use Legislation.cases.findById() instead.
        "::findById::legislation::cases": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/legislations/:id/cases/:fk",
          method: "GET"
        },

        // INTERNAL. Use Legislation.cases.destroyById() instead.
        "::destroyById::legislation::cases": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/legislations/:id/cases/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Legislation.cases.updateById() instead.
        "::updateById::legislation::cases": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/legislations/:id/cases/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Legislation.cases() instead.
        "::get::legislation::cases": {
          isArray: true,
          url: urlBase + "/legislations/:id/cases",
          method: "GET"
        },

        // INTERNAL. Use Legislation.cases.create() instead.
        "::create::legislation::cases": {
          url: urlBase + "/legislations/:id/cases",
          method: "POST"
        },

        // INTERNAL. Use Legislation.cases.createMany() instead.
        "::createMany::legislation::cases": {
          isArray: true,
          url: urlBase + "/legislations/:id/cases",
          method: "POST"
        },

        // INTERNAL. Use Legislation.cases.destroyAll() instead.
        "::delete::legislation::cases": {
          url: urlBase + "/legislations/:id/cases",
          method: "DELETE"
        },

        // INTERNAL. Use Legislation.cases.count() instead.
        "::count::legislation::cases": {
          url: urlBase + "/legislations/:id/cases/count",
          method: "GET"
        },

        // INTERNAL. Use Appuser.cases.findById() instead.
        "::findById::appuser::cases": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/appusers/:id/cases/:fk",
          method: "GET"
        },

        // INTERNAL. Use Appuser.cases.destroyById() instead.
        "::destroyById::appuser::cases": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/appusers/:id/cases/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Appuser.cases.updateById() instead.
        "::updateById::appuser::cases": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/appusers/:id/cases/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Appuser.cases() instead.
        "::get::appuser::cases": {
          isArray: true,
          url: urlBase + "/appusers/:id/cases",
          method: "GET"
        },

        // INTERNAL. Use Appuser.cases.create() instead.
        "::create::appuser::cases": {
          url: urlBase + "/appusers/:id/cases",
          method: "POST"
        },

        // INTERNAL. Use Appuser.cases.createMany() instead.
        "::createMany::appuser::cases": {
          isArray: true,
          url: urlBase + "/appusers/:id/cases",
          method: "POST"
        },

        // INTERNAL. Use Appuser.cases.destroyAll() instead.
        "::delete::appuser::cases": {
          url: urlBase + "/appusers/:id/cases",
          method: "DELETE"
        },

        // INTERNAL. Use Appuser.cases.count() instead.
        "::count::appuser::cases": {
          url: urlBase + "/appusers/:id/cases/count",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.Case#updateOrCreate
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.Case#update
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.Case#destroyById
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.Case#removeById
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.Case#modelName
    * @propertyOf apiServices.Case
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Case`.
    */
    R.modelName = "Case";


        /**
         * @ngdoc method
         * @name apiServices.Case#areaOfLaw
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Fetches belongsTo relation areaOfLaw.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AreaOfLaw` object.)
         * </em>
         */
        R.areaOfLaw = function() {
          var TargetResource = $injector.get("AreaOfLaw");
          var action = TargetResource["::get::case::areaOfLaw"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name apiServices.Case.casesReferedTo
     * @header apiServices.Case.casesReferedTo
     * @object
     * @description
     *
     * The object `Case.casesReferedTo` groups methods
     * manipulating `Case` instances related to `Case`.
     *
     * Call {@link apiServices.Case#casesReferedTo Case.casesReferedTo()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name apiServices.Case#casesReferedTo
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Queries casesReferedTo of case.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.casesReferedTo = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::get::case::casesReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case.casesReferedTo#count
         * @methodOf apiServices.Case.casesReferedTo
         *
         * @description
         *
         * Counts casesReferedTo of case.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        R.casesReferedTo.count = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::count::case::casesReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case.casesReferedTo#create
         * @methodOf apiServices.Case.casesReferedTo
         *
         * @description
         *
         * Creates a new instance in casesReferedTo of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.casesReferedTo.create = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::create::case::casesReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case.casesReferedTo#createMany
         * @methodOf apiServices.Case.casesReferedTo
         *
         * @description
         *
         * Creates a new instance in casesReferedTo of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.casesReferedTo.createMany = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::createMany::case::casesReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case.casesReferedTo#destroyAll
         * @methodOf apiServices.Case.casesReferedTo
         *
         * @description
         *
         * Deletes all casesReferedTo of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.casesReferedTo.destroyAll = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::delete::case::casesReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case.casesReferedTo#destroyById
         * @methodOf apiServices.Case.casesReferedTo
         *
         * @description
         *
         * Delete a related item by id for casesReferedTo.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for casesReferedTo
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.casesReferedTo.destroyById = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::destroyById::case::casesReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case.casesReferedTo#exists
         * @methodOf apiServices.Case.casesReferedTo
         *
         * @description
         *
         * Check the existence of casesReferedTo relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for casesReferedTo
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.casesReferedTo.exists = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::exists::case::casesReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case.casesReferedTo#findById
         * @methodOf apiServices.Case.casesReferedTo
         *
         * @description
         *
         * Find a related item by id for casesReferedTo.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for casesReferedTo
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.casesReferedTo.findById = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::findById::case::casesReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case.casesReferedTo#link
         * @methodOf apiServices.Case.casesReferedTo
         *
         * @description
         *
         * Add a related item by id for casesReferedTo.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for casesReferedTo
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.casesReferedTo.link = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::link::case::casesReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case.casesReferedTo#unlink
         * @methodOf apiServices.Case.casesReferedTo
         *
         * @description
         *
         * Remove the casesReferedTo relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for casesReferedTo
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.casesReferedTo.unlink = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::unlink::case::casesReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case.casesReferedTo#updateById
         * @methodOf apiServices.Case.casesReferedTo
         *
         * @description
         *
         * Update a related item by id for casesReferedTo.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for casesReferedTo
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.casesReferedTo.updateById = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::updateById::case::casesReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case#court
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Fetches belongsTo relation court.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Court` object.)
         * </em>
         */
        R.court = function() {
          var TargetResource = $injector.get("Court");
          var action = TargetResource["::get::case::court"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name apiServices.Case.legislationsReferedTo
     * @header apiServices.Case.legislationsReferedTo
     * @object
     * @description
     *
     * The object `Case.legislationsReferedTo` groups methods
     * manipulating `Legislation` instances related to `Case`.
     *
     * Call {@link apiServices.Case#legislationsReferedTo Case.legislationsReferedTo()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name apiServices.Case#legislationsReferedTo
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Queries legislationsReferedTo of case.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        R.legislationsReferedTo = function() {
          var TargetResource = $injector.get("Legislation");
          var action = TargetResource["::get::case::legislationsReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case.legislationsReferedTo#count
         * @methodOf apiServices.Case.legislationsReferedTo
         *
         * @description
         *
         * Counts legislationsReferedTo of case.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        R.legislationsReferedTo.count = function() {
          var TargetResource = $injector.get("Legislation");
          var action = TargetResource["::count::case::legislationsReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case.legislationsReferedTo#create
         * @methodOf apiServices.Case.legislationsReferedTo
         *
         * @description
         *
         * Creates a new instance in legislationsReferedTo of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        R.legislationsReferedTo.create = function() {
          var TargetResource = $injector.get("Legislation");
          var action = TargetResource["::create::case::legislationsReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case.legislationsReferedTo#createMany
         * @methodOf apiServices.Case.legislationsReferedTo
         *
         * @description
         *
         * Creates a new instance in legislationsReferedTo of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        R.legislationsReferedTo.createMany = function() {
          var TargetResource = $injector.get("Legislation");
          var action = TargetResource["::createMany::case::legislationsReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case.legislationsReferedTo#destroyAll
         * @methodOf apiServices.Case.legislationsReferedTo
         *
         * @description
         *
         * Deletes all legislationsReferedTo of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.legislationsReferedTo.destroyAll = function() {
          var TargetResource = $injector.get("Legislation");
          var action = TargetResource["::delete::case::legislationsReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case.legislationsReferedTo#destroyById
         * @methodOf apiServices.Case.legislationsReferedTo
         *
         * @description
         *
         * Delete a related item by id for legislationsReferedTo.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for legislationsReferedTo
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.legislationsReferedTo.destroyById = function() {
          var TargetResource = $injector.get("Legislation");
          var action = TargetResource["::destroyById::case::legislationsReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case.legislationsReferedTo#exists
         * @methodOf apiServices.Case.legislationsReferedTo
         *
         * @description
         *
         * Check the existence of legislationsReferedTo relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for legislationsReferedTo
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        R.legislationsReferedTo.exists = function() {
          var TargetResource = $injector.get("Legislation");
          var action = TargetResource["::exists::case::legislationsReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case.legislationsReferedTo#findById
         * @methodOf apiServices.Case.legislationsReferedTo
         *
         * @description
         *
         * Find a related item by id for legislationsReferedTo.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for legislationsReferedTo
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        R.legislationsReferedTo.findById = function() {
          var TargetResource = $injector.get("Legislation");
          var action = TargetResource["::findById::case::legislationsReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case.legislationsReferedTo#link
         * @methodOf apiServices.Case.legislationsReferedTo
         *
         * @description
         *
         * Add a related item by id for legislationsReferedTo.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for legislationsReferedTo
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        R.legislationsReferedTo.link = function() {
          var TargetResource = $injector.get("Legislation");
          var action = TargetResource["::link::case::legislationsReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case.legislationsReferedTo#unlink
         * @methodOf apiServices.Case.legislationsReferedTo
         *
         * @description
         *
         * Remove the legislationsReferedTo relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for legislationsReferedTo
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.legislationsReferedTo.unlink = function() {
          var TargetResource = $injector.get("Legislation");
          var action = TargetResource["::unlink::case::legislationsReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case.legislationsReferedTo#updateById
         * @methodOf apiServices.Case.legislationsReferedTo
         *
         * @description
         *
         * Update a related item by id for legislationsReferedTo.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for legislationsReferedTo
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        R.legislationsReferedTo.updateById = function() {
          var TargetResource = $injector.get("Legislation");
          var action = TargetResource["::updateById::case::legislationsReferedTo"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case#plaintiffSynonym
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Fetches belongsTo relation plaintiffSynonym.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PlaintiffSynonyms` object.)
         * </em>
         */
        R.plaintiffSynonym = function() {
          var TargetResource = $injector.get("PlaintiffSynonyms");
          var action = TargetResource["::get::case::plaintiffSynonym"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case#defendantSynonym
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Fetches belongsTo relation defendantSynonym.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DefendantSynonyms` object.)
         * </em>
         */
        R.defendantSynonym = function() {
          var TargetResource = $injector.get("DefendantSynonyms");
          var action = TargetResource["::get::case::defendantSynonym"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case#jurisdiction
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Fetches belongsTo relation jurisdiction.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Jurisdiction` object.)
         * </em>
         */
        R.jurisdiction = function() {
          var TargetResource = $injector.get("Jurisdiction");
          var action = TargetResource["::get::case::jurisdiction"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case#location
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Fetches belongsTo relation location.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Location` object.)
         * </em>
         */
        R.location = function() {
          var TargetResource = $injector.get("Location");
          var action = TargetResource["::get::case::location"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Case#courtDivision
         * @methodOf apiServices.Case
         *
         * @description
         *
         * Fetches belongsTo relation courtDivision.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CourtDivision` object.)
         * </em>
         */
        R.courtDivision = function() {
          var TargetResource = $injector.get("CourtDivision");
          var action = TargetResource["::get::case::courtDivision"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.CaseCases
 * @header apiServices.CaseCases
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `CaseCases` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "CaseCases",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/caseCases/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use CaseCases.case() instead.
        "prototype$__get__case": {
          url: urlBase + "/caseCases/:id/case",
          method: "GET"
        },

        // INTERNAL. Use CaseCases.caseReferedTo() instead.
        "prototype$__get__caseReferedTo": {
          url: urlBase + "/caseCases/:id/caseReferedTo",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseCases#create
         * @methodOf apiServices.CaseCases
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseCases` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/caseCases",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseCases#createMany
         * @methodOf apiServices.CaseCases
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseCases` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/caseCases",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseCases#upsert
         * @methodOf apiServices.CaseCases
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseCases` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/caseCases",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseCases#exists
         * @methodOf apiServices.CaseCases
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/caseCases/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseCases#findById
         * @methodOf apiServices.CaseCases
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseCases` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/caseCases/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseCases#find
         * @methodOf apiServices.CaseCases
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseCases` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/caseCases",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseCases#findOne
         * @methodOf apiServices.CaseCases
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseCases` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/caseCases/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseCases#updateAll
         * @methodOf apiServices.CaseCases
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/caseCases/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseCases#deleteById
         * @methodOf apiServices.CaseCases
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseCases` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/caseCases/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseCases#count
         * @methodOf apiServices.CaseCases
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/caseCases/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseCases#prototype$updateAttributes
         * @methodOf apiServices.CaseCases
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseCases` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/caseCases/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseCases#createChangeStream
         * @methodOf apiServices.CaseCases
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/caseCases/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.CaseCases#updateOrCreate
         * @methodOf apiServices.CaseCases
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseCases` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.CaseCases#update
         * @methodOf apiServices.CaseCases
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.CaseCases#destroyById
         * @methodOf apiServices.CaseCases
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseCases` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.CaseCases#removeById
         * @methodOf apiServices.CaseCases
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseCases` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.CaseCases#modelName
    * @propertyOf apiServices.CaseCases
    * @description
    * The name of the model represented by this $resource,
    * i.e. `CaseCases`.
    */
    R.modelName = "CaseCases";


        /**
         * @ngdoc method
         * @name apiServices.CaseCases#case
         * @methodOf apiServices.CaseCases
         *
         * @description
         *
         * Fetches belongsTo relation case.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.case = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::get::caseCases::case"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.CaseCases#caseReferedTo
         * @methodOf apiServices.CaseCases
         *
         * @description
         *
         * Fetches belongsTo relation caseReferedTo.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.caseReferedTo = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::get::caseCases::caseReferedTo"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.CaseWorks
 * @header apiServices.CaseWorks
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `CaseWorks` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "CaseWorks",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/caseWorks/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use CaseWorks.case() instead.
        "prototype$__get__case": {
          url: urlBase + "/caseWorks/:id/case",
          method: "GET"
        },

        // INTERNAL. Use CaseWorks.workReferedTo() instead.
        "prototype$__get__workReferedTo": {
          url: urlBase + "/caseWorks/:id/workReferedTo",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseWorks#create
         * @methodOf apiServices.CaseWorks
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseWorks` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/caseWorks",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseWorks#createMany
         * @methodOf apiServices.CaseWorks
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseWorks` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/caseWorks",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseWorks#upsert
         * @methodOf apiServices.CaseWorks
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseWorks` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/caseWorks",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseWorks#exists
         * @methodOf apiServices.CaseWorks
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/caseWorks/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseWorks#findById
         * @methodOf apiServices.CaseWorks
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseWorks` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/caseWorks/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseWorks#find
         * @methodOf apiServices.CaseWorks
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseWorks` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/caseWorks",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseWorks#findOne
         * @methodOf apiServices.CaseWorks
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseWorks` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/caseWorks/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseWorks#updateAll
         * @methodOf apiServices.CaseWorks
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/caseWorks/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseWorks#deleteById
         * @methodOf apiServices.CaseWorks
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseWorks` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/caseWorks/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseWorks#count
         * @methodOf apiServices.CaseWorks
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/caseWorks/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseWorks#prototype$updateAttributes
         * @methodOf apiServices.CaseWorks
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseWorks` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/caseWorks/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.CaseWorks#createChangeStream
         * @methodOf apiServices.CaseWorks
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/caseWorks/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.CaseWorks#updateOrCreate
         * @methodOf apiServices.CaseWorks
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseWorks` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.CaseWorks#update
         * @methodOf apiServices.CaseWorks
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.CaseWorks#destroyById
         * @methodOf apiServices.CaseWorks
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseWorks` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.CaseWorks#removeById
         * @methodOf apiServices.CaseWorks
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CaseWorks` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.CaseWorks#modelName
    * @propertyOf apiServices.CaseWorks
    * @description
    * The name of the model represented by this $resource,
    * i.e. `CaseWorks`.
    */
    R.modelName = "CaseWorks";


        /**
         * @ngdoc method
         * @name apiServices.CaseWorks#case
         * @methodOf apiServices.CaseWorks
         *
         * @description
         *
         * Fetches belongsTo relation case.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.case = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::get::caseWorks::case"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.CaseWorks#workReferedTo
         * @methodOf apiServices.CaseWorks
         *
         * @description
         *
         * Fetches belongsTo relation workReferedTo.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Work` object.)
         * </em>
         */
        R.workReferedTo = function() {
          var TargetResource = $injector.get("Work");
          var action = TargetResource["::get::caseWorks::workReferedTo"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.CitationDescriptions
 * @header apiServices.CitationDescriptions
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `CitationDescriptions` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "CitationDescriptions",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/citationDescriptions/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name apiServices.CitationDescriptions#create
         * @methodOf apiServices.CitationDescriptions
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CitationDescriptions` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/citationDescriptions",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.CitationDescriptions#createMany
         * @methodOf apiServices.CitationDescriptions
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CitationDescriptions` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/citationDescriptions",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.CitationDescriptions#upsert
         * @methodOf apiServices.CitationDescriptions
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CitationDescriptions` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/citationDescriptions",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.CitationDescriptions#exists
         * @methodOf apiServices.CitationDescriptions
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/citationDescriptions/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CitationDescriptions#findById
         * @methodOf apiServices.CitationDescriptions
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CitationDescriptions` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/citationDescriptions/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CitationDescriptions#find
         * @methodOf apiServices.CitationDescriptions
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CitationDescriptions` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/citationDescriptions",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CitationDescriptions#findOne
         * @methodOf apiServices.CitationDescriptions
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CitationDescriptions` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/citationDescriptions/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CitationDescriptions#updateAll
         * @methodOf apiServices.CitationDescriptions
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/citationDescriptions/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.CitationDescriptions#deleteById
         * @methodOf apiServices.CitationDescriptions
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CitationDescriptions` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/citationDescriptions/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.CitationDescriptions#count
         * @methodOf apiServices.CitationDescriptions
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/citationDescriptions/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CitationDescriptions#prototype$updateAttributes
         * @methodOf apiServices.CitationDescriptions
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CitationDescriptions` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/citationDescriptions/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.CitationDescriptions#createChangeStream
         * @methodOf apiServices.CitationDescriptions
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/citationDescriptions/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.CitationDescriptions#updateOrCreate
         * @methodOf apiServices.CitationDescriptions
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CitationDescriptions` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.CitationDescriptions#update
         * @methodOf apiServices.CitationDescriptions
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.CitationDescriptions#destroyById
         * @methodOf apiServices.CitationDescriptions
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CitationDescriptions` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.CitationDescriptions#removeById
         * @methodOf apiServices.CitationDescriptions
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CitationDescriptions` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.CitationDescriptions#modelName
    * @propertyOf apiServices.CitationDescriptions
    * @description
    * The name of the model represented by this $resource,
    * i.e. `CitationDescriptions`.
    */
    R.modelName = "CitationDescriptions";


    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.Citation
 * @header apiServices.Citation
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Citation` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Citation",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/citations/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use Citation.case() instead.
        "prototype$__get__case": {
          url: urlBase + "/citations/:id/case",
          method: "GET"
        },

        // INTERNAL. Use Citation.case.create() instead.
        "prototype$__create__case": {
          url: urlBase + "/citations/:id/case",
          method: "POST"
        },

        // INTERNAL. Use Citation.case.update() instead.
        "prototype$__update__case": {
          url: urlBase + "/citations/:id/case",
          method: "PUT"
        },

        // INTERNAL. Use Citation.case.destroy() instead.
        "prototype$__destroy__case": {
          url: urlBase + "/citations/:id/case",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.Citation#create
         * @methodOf apiServices.Citation
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Citation` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/citations",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Citation#createMany
         * @methodOf apiServices.Citation
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Citation` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/citations",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Citation#upsert
         * @methodOf apiServices.Citation
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Citation` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/citations",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Citation#exists
         * @methodOf apiServices.Citation
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/citations/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Citation#findById
         * @methodOf apiServices.Citation
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Citation` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/citations/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Citation#find
         * @methodOf apiServices.Citation
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Citation` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/citations",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Citation#findOne
         * @methodOf apiServices.Citation
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Citation` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/citations/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Citation#updateAll
         * @methodOf apiServices.Citation
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/citations/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Citation#deleteById
         * @methodOf apiServices.Citation
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Citation` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/citations/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.Citation#count
         * @methodOf apiServices.Citation
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/citations/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Citation#prototype$updateAttributes
         * @methodOf apiServices.Citation
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Citation` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/citations/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Citation#createChangeStream
         * @methodOf apiServices.Citation
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/citations/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.Citation#updateOrCreate
         * @methodOf apiServices.Citation
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Citation` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.Citation#update
         * @methodOf apiServices.Citation
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.Citation#destroyById
         * @methodOf apiServices.Citation
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Citation` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.Citation#removeById
         * @methodOf apiServices.Citation
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Citation` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.Citation#modelName
    * @propertyOf apiServices.Citation
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Citation`.
    */
    R.modelName = "Citation";

    /**
     * @ngdoc object
     * @name apiServices.Citation.case
     * @header apiServices.Citation.case
     * @object
     * @description
     *
     * The object `Citation.case` groups methods
     * manipulating `Case` instances related to `Citation`.
     *
     * Call {@link apiServices.Citation#case Citation.case()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name apiServices.Citation#case
         * @methodOf apiServices.Citation
         *
         * @description
         *
         * Fetches hasOne relation case.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.case = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::get::citation::case"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Citation.case#create
         * @methodOf apiServices.Citation.case
         *
         * @description
         *
         * Creates a new instance in case of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.case.create = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::create::citation::case"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Citation.case#createMany
         * @methodOf apiServices.Citation.case
         *
         * @description
         *
         * Creates a new instance in case of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.case.createMany = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::createMany::citation::case"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Citation.case#destroy
         * @methodOf apiServices.Citation.case
         *
         * @description
         *
         * Deletes case of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.case.destroy = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::destroy::citation::case"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Citation.case#update
         * @methodOf apiServices.Citation.case
         *
         * @description
         *
         * Update case of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.case.update = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::update::citation::case"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.Court
 * @header apiServices.Court
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Court` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Court",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/courts/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use Court.divisions.findById() instead.
        "prototype$__findById__divisions": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/courts/:id/divisions/:fk",
          method: "GET"
        },

        // INTERNAL. Use Court.divisions.destroyById() instead.
        "prototype$__destroyById__divisions": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/courts/:id/divisions/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Court.divisions.updateById() instead.
        "prototype$__updateById__divisions": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/courts/:id/divisions/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Court.divisions() instead.
        "prototype$__get__divisions": {
          isArray: true,
          url: urlBase + "/courts/:id/divisions",
          method: "GET"
        },

        // INTERNAL. Use Court.divisions.create() instead.
        "prototype$__create__divisions": {
          url: urlBase + "/courts/:id/divisions",
          method: "POST"
        },

        // INTERNAL. Use Court.divisions.destroyAll() instead.
        "prototype$__delete__divisions": {
          url: urlBase + "/courts/:id/divisions",
          method: "DELETE"
        },

        // INTERNAL. Use Court.divisions.count() instead.
        "prototype$__count__divisions": {
          url: urlBase + "/courts/:id/divisions/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Court#create
         * @methodOf apiServices.Court
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Court` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/courts",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Court#createMany
         * @methodOf apiServices.Court
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Court` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/courts",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Court#upsert
         * @methodOf apiServices.Court
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Court` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/courts",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Court#exists
         * @methodOf apiServices.Court
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/courts/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Court#findById
         * @methodOf apiServices.Court
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Court` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/courts/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Court#find
         * @methodOf apiServices.Court
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Court` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/courts",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Court#findOne
         * @methodOf apiServices.Court
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Court` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/courts/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Court#updateAll
         * @methodOf apiServices.Court
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/courts/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Court#deleteById
         * @methodOf apiServices.Court
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Court` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/courts/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.Court#count
         * @methodOf apiServices.Court
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/courts/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Court#prototype$updateAttributes
         * @methodOf apiServices.Court
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Court` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/courts/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Court#createChangeStream
         * @methodOf apiServices.Court
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/courts/change-stream",
          method: "POST"
        },

        // INTERNAL. Use Case.court() instead.
        "::get::case::court": {
          url: urlBase + "/cases/:id/court",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.Court#updateOrCreate
         * @methodOf apiServices.Court
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Court` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.Court#update
         * @methodOf apiServices.Court
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.Court#destroyById
         * @methodOf apiServices.Court
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Court` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.Court#removeById
         * @methodOf apiServices.Court
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Court` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.Court#modelName
    * @propertyOf apiServices.Court
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Court`.
    */
    R.modelName = "Court";

    /**
     * @ngdoc object
     * @name apiServices.Court.divisions
     * @header apiServices.Court.divisions
     * @object
     * @description
     *
     * The object `Court.divisions` groups methods
     * manipulating `CourtDivision` instances related to `Court`.
     *
     * Call {@link apiServices.Court#divisions Court.divisions()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name apiServices.Court#divisions
         * @methodOf apiServices.Court
         *
         * @description
         *
         * Queries divisions of court.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CourtDivision` object.)
         * </em>
         */
        R.divisions = function() {
          var TargetResource = $injector.get("CourtDivision");
          var action = TargetResource["::get::court::divisions"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Court.divisions#count
         * @methodOf apiServices.Court.divisions
         *
         * @description
         *
         * Counts divisions of court.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        R.divisions.count = function() {
          var TargetResource = $injector.get("CourtDivision");
          var action = TargetResource["::count::court::divisions"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Court.divisions#create
         * @methodOf apiServices.Court.divisions
         *
         * @description
         *
         * Creates a new instance in divisions of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CourtDivision` object.)
         * </em>
         */
        R.divisions.create = function() {
          var TargetResource = $injector.get("CourtDivision");
          var action = TargetResource["::create::court::divisions"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Court.divisions#createMany
         * @methodOf apiServices.Court.divisions
         *
         * @description
         *
         * Creates a new instance in divisions of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CourtDivision` object.)
         * </em>
         */
        R.divisions.createMany = function() {
          var TargetResource = $injector.get("CourtDivision");
          var action = TargetResource["::createMany::court::divisions"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Court.divisions#destroyAll
         * @methodOf apiServices.Court.divisions
         *
         * @description
         *
         * Deletes all divisions of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.divisions.destroyAll = function() {
          var TargetResource = $injector.get("CourtDivision");
          var action = TargetResource["::delete::court::divisions"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Court.divisions#destroyById
         * @methodOf apiServices.Court.divisions
         *
         * @description
         *
         * Delete a related item by id for divisions.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for divisions
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.divisions.destroyById = function() {
          var TargetResource = $injector.get("CourtDivision");
          var action = TargetResource["::destroyById::court::divisions"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Court.divisions#findById
         * @methodOf apiServices.Court.divisions
         *
         * @description
         *
         * Find a related item by id for divisions.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for divisions
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CourtDivision` object.)
         * </em>
         */
        R.divisions.findById = function() {
          var TargetResource = $injector.get("CourtDivision");
          var action = TargetResource["::findById::court::divisions"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Court.divisions#updateById
         * @methodOf apiServices.Court.divisions
         *
         * @description
         *
         * Update a related item by id for divisions.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for divisions
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CourtDivision` object.)
         * </em>
         */
        R.divisions.updateById = function() {
          var TargetResource = $injector.get("CourtDivision");
          var action = TargetResource["::updateById::court::divisions"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.Enactment
 * @header apiServices.Enactment
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Enactment` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Enactment",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/enactments/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name apiServices.Enactment#create
         * @methodOf apiServices.Enactment
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Enactment` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/enactments",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Enactment#createMany
         * @methodOf apiServices.Enactment
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Enactment` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/enactments",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Enactment#upsert
         * @methodOf apiServices.Enactment
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Enactment` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/enactments",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Enactment#exists
         * @methodOf apiServices.Enactment
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/enactments/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Enactment#findById
         * @methodOf apiServices.Enactment
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Enactment` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/enactments/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Enactment#find
         * @methodOf apiServices.Enactment
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Enactment` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/enactments",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Enactment#findOne
         * @methodOf apiServices.Enactment
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Enactment` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/enactments/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Enactment#updateAll
         * @methodOf apiServices.Enactment
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/enactments/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Enactment#deleteById
         * @methodOf apiServices.Enactment
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Enactment` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/enactments/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.Enactment#count
         * @methodOf apiServices.Enactment
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/enactments/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Enactment#prototype$updateAttributes
         * @methodOf apiServices.Enactment
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Enactment` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/enactments/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Enactment#createChangeStream
         * @methodOf apiServices.Enactment
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/enactments/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.Enactment#updateOrCreate
         * @methodOf apiServices.Enactment
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Enactment` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.Enactment#update
         * @methodOf apiServices.Enactment
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.Enactment#destroyById
         * @methodOf apiServices.Enactment
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Enactment` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.Enactment#removeById
         * @methodOf apiServices.Enactment
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Enactment` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.Enactment#modelName
    * @propertyOf apiServices.Enactment
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Enactment`.
    */
    R.modelName = "Enactment";


    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.LawFirm
 * @header apiServices.LawFirm
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `LawFirm` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "LawFirm",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/lawFirms/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use LawFirm.advocates.findById() instead.
        "prototype$__findById__advocates": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/lawFirms/:id/advocates/:fk",
          method: "GET"
        },

        // INTERNAL. Use LawFirm.advocates.destroyById() instead.
        "prototype$__destroyById__advocates": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/lawFirms/:id/advocates/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use LawFirm.advocates.updateById() instead.
        "prototype$__updateById__advocates": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/lawFirms/:id/advocates/:fk",
          method: "PUT"
        },

        // INTERNAL. Use LawFirm.advocates() instead.
        "prototype$__get__advocates": {
          isArray: true,
          url: urlBase + "/lawFirms/:id/advocates",
          method: "GET"
        },

        // INTERNAL. Use LawFirm.advocates.create() instead.
        "prototype$__create__advocates": {
          url: urlBase + "/lawFirms/:id/advocates",
          method: "POST"
        },

        // INTERNAL. Use LawFirm.advocates.destroyAll() instead.
        "prototype$__delete__advocates": {
          url: urlBase + "/lawFirms/:id/advocates",
          method: "DELETE"
        },

        // INTERNAL. Use LawFirm.advocates.count() instead.
        "prototype$__count__advocates": {
          url: urlBase + "/lawFirms/:id/advocates/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.LawFirm#create
         * @methodOf apiServices.LawFirm
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LawFirm` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/lawFirms",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.LawFirm#createMany
         * @methodOf apiServices.LawFirm
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LawFirm` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/lawFirms",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.LawFirm#upsert
         * @methodOf apiServices.LawFirm
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LawFirm` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/lawFirms",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.LawFirm#exists
         * @methodOf apiServices.LawFirm
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/lawFirms/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.LawFirm#findById
         * @methodOf apiServices.LawFirm
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LawFirm` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/lawFirms/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.LawFirm#find
         * @methodOf apiServices.LawFirm
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LawFirm` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/lawFirms",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.LawFirm#findOne
         * @methodOf apiServices.LawFirm
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LawFirm` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/lawFirms/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.LawFirm#updateAll
         * @methodOf apiServices.LawFirm
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/lawFirms/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.LawFirm#deleteById
         * @methodOf apiServices.LawFirm
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LawFirm` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/lawFirms/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.LawFirm#count
         * @methodOf apiServices.LawFirm
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/lawFirms/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.LawFirm#prototype$updateAttributes
         * @methodOf apiServices.LawFirm
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LawFirm` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/lawFirms/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.LawFirm#createChangeStream
         * @methodOf apiServices.LawFirm
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/lawFirms/change-stream",
          method: "POST"
        },

        // INTERNAL. Use Advocate.lawFirm() instead.
        "::get::advocate::lawFirm": {
          url: urlBase + "/advocates/:id/lawFirm",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.LawFirm#updateOrCreate
         * @methodOf apiServices.LawFirm
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LawFirm` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.LawFirm#update
         * @methodOf apiServices.LawFirm
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.LawFirm#destroyById
         * @methodOf apiServices.LawFirm
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LawFirm` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.LawFirm#removeById
         * @methodOf apiServices.LawFirm
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LawFirm` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.LawFirm#modelName
    * @propertyOf apiServices.LawFirm
    * @description
    * The name of the model represented by this $resource,
    * i.e. `LawFirm`.
    */
    R.modelName = "LawFirm";

    /**
     * @ngdoc object
     * @name apiServices.LawFirm.advocates
     * @header apiServices.LawFirm.advocates
     * @object
     * @description
     *
     * The object `LawFirm.advocates` groups methods
     * manipulating `Advocate` instances related to `LawFirm`.
     *
     * Call {@link apiServices.LawFirm#advocates LawFirm.advocates()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name apiServices.LawFirm#advocates
         * @methodOf apiServices.LawFirm
         *
         * @description
         *
         * Queries advocates of lawFirm.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Advocate` object.)
         * </em>
         */
        R.advocates = function() {
          var TargetResource = $injector.get("Advocate");
          var action = TargetResource["::get::lawFirm::advocates"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.LawFirm.advocates#count
         * @methodOf apiServices.LawFirm.advocates
         *
         * @description
         *
         * Counts advocates of lawFirm.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        R.advocates.count = function() {
          var TargetResource = $injector.get("Advocate");
          var action = TargetResource["::count::lawFirm::advocates"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.LawFirm.advocates#create
         * @methodOf apiServices.LawFirm.advocates
         *
         * @description
         *
         * Creates a new instance in advocates of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Advocate` object.)
         * </em>
         */
        R.advocates.create = function() {
          var TargetResource = $injector.get("Advocate");
          var action = TargetResource["::create::lawFirm::advocates"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.LawFirm.advocates#createMany
         * @methodOf apiServices.LawFirm.advocates
         *
         * @description
         *
         * Creates a new instance in advocates of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Advocate` object.)
         * </em>
         */
        R.advocates.createMany = function() {
          var TargetResource = $injector.get("Advocate");
          var action = TargetResource["::createMany::lawFirm::advocates"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.LawFirm.advocates#destroyAll
         * @methodOf apiServices.LawFirm.advocates
         *
         * @description
         *
         * Deletes all advocates of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.advocates.destroyAll = function() {
          var TargetResource = $injector.get("Advocate");
          var action = TargetResource["::delete::lawFirm::advocates"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.LawFirm.advocates#destroyById
         * @methodOf apiServices.LawFirm.advocates
         *
         * @description
         *
         * Delete a related item by id for advocates.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for advocates
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.advocates.destroyById = function() {
          var TargetResource = $injector.get("Advocate");
          var action = TargetResource["::destroyById::lawFirm::advocates"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.LawFirm.advocates#findById
         * @methodOf apiServices.LawFirm.advocates
         *
         * @description
         *
         * Find a related item by id for advocates.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for advocates
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Advocate` object.)
         * </em>
         */
        R.advocates.findById = function() {
          var TargetResource = $injector.get("Advocate");
          var action = TargetResource["::findById::lawFirm::advocates"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.LawFirm.advocates#updateById
         * @methodOf apiServices.LawFirm.advocates
         *
         * @description
         *
         * Update a related item by id for advocates.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for advocates
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Advocate` object.)
         * </em>
         */
        R.advocates.updateById = function() {
          var TargetResource = $injector.get("Advocate");
          var action = TargetResource["::updateById::lawFirm::advocates"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.LegislationPart
 * @header apiServices.LegislationPart
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `LegislationPart` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "LegislationPart",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/legislationParts/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use LegislationPart.partType() instead.
        "prototype$__get__partType": {
          url: urlBase + "/legislationParts/:id/partType",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationPart#create
         * @methodOf apiServices.LegislationPart
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationPart` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/legislationParts",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationPart#createMany
         * @methodOf apiServices.LegislationPart
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationPart` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/legislationParts",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationPart#upsert
         * @methodOf apiServices.LegislationPart
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationPart` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/legislationParts",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationPart#exists
         * @methodOf apiServices.LegislationPart
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/legislationParts/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationPart#findById
         * @methodOf apiServices.LegislationPart
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationPart` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/legislationParts/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationPart#find
         * @methodOf apiServices.LegislationPart
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationPart` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/legislationParts",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationPart#findOne
         * @methodOf apiServices.LegislationPart
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationPart` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/legislationParts/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationPart#updateAll
         * @methodOf apiServices.LegislationPart
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/legislationParts/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationPart#deleteById
         * @methodOf apiServices.LegislationPart
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationPart` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/legislationParts/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationPart#count
         * @methodOf apiServices.LegislationPart
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/legislationParts/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationPart#prototype$updateAttributes
         * @methodOf apiServices.LegislationPart
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationPart` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/legislationParts/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationPart#createChangeStream
         * @methodOf apiServices.LegislationPart
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/legislationParts/change-stream",
          method: "POST"
        },

        // INTERNAL. Use PartType.legislationParts.findById() instead.
        "::findById::partType::legislationParts": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/partTypes/:id/legislationParts/:fk",
          method: "GET"
        },

        // INTERNAL. Use PartType.legislationParts.destroyById() instead.
        "::destroyById::partType::legislationParts": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/partTypes/:id/legislationParts/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use PartType.legislationParts.updateById() instead.
        "::updateById::partType::legislationParts": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/partTypes/:id/legislationParts/:fk",
          method: "PUT"
        },

        // INTERNAL. Use PartType.legislationParts() instead.
        "::get::partType::legislationParts": {
          isArray: true,
          url: urlBase + "/partTypes/:id/legislationParts",
          method: "GET"
        },

        // INTERNAL. Use PartType.legislationParts.create() instead.
        "::create::partType::legislationParts": {
          url: urlBase + "/partTypes/:id/legislationParts",
          method: "POST"
        },

        // INTERNAL. Use PartType.legislationParts.createMany() instead.
        "::createMany::partType::legislationParts": {
          isArray: true,
          url: urlBase + "/partTypes/:id/legislationParts",
          method: "POST"
        },

        // INTERNAL. Use PartType.legislationParts.destroyAll() instead.
        "::delete::partType::legislationParts": {
          url: urlBase + "/partTypes/:id/legislationParts",
          method: "DELETE"
        },

        // INTERNAL. Use PartType.legislationParts.count() instead.
        "::count::partType::legislationParts": {
          url: urlBase + "/partTypes/:id/legislationParts/count",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.LegislationPart#updateOrCreate
         * @methodOf apiServices.LegislationPart
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationPart` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.LegislationPart#update
         * @methodOf apiServices.LegislationPart
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.LegislationPart#destroyById
         * @methodOf apiServices.LegislationPart
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationPart` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.LegislationPart#removeById
         * @methodOf apiServices.LegislationPart
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationPart` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.LegislationPart#modelName
    * @propertyOf apiServices.LegislationPart
    * @description
    * The name of the model represented by this $resource,
    * i.e. `LegislationPart`.
    */
    R.modelName = "LegislationPart";


        /**
         * @ngdoc method
         * @name apiServices.LegislationPart#partType
         * @methodOf apiServices.LegislationPart
         *
         * @description
         *
         * Fetches belongsTo relation partType.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PartType` object.)
         * </em>
         */
        R.partType = function() {
          var TargetResource = $injector.get("PartType");
          var action = TargetResource["::get::legislationPart::partType"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.PartType
 * @header apiServices.PartType
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `PartType` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "PartType",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/partTypes/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use PartType.legislationParts.findById() instead.
        "prototype$__findById__legislationParts": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/partTypes/:id/legislationParts/:fk",
          method: "GET"
        },

        // INTERNAL. Use PartType.legislationParts.destroyById() instead.
        "prototype$__destroyById__legislationParts": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/partTypes/:id/legislationParts/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use PartType.legislationParts.updateById() instead.
        "prototype$__updateById__legislationParts": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/partTypes/:id/legislationParts/:fk",
          method: "PUT"
        },

        // INTERNAL. Use PartType.legislationParts() instead.
        "prototype$__get__legislationParts": {
          isArray: true,
          url: urlBase + "/partTypes/:id/legislationParts",
          method: "GET"
        },

        // INTERNAL. Use PartType.legislationParts.create() instead.
        "prototype$__create__legislationParts": {
          url: urlBase + "/partTypes/:id/legislationParts",
          method: "POST"
        },

        // INTERNAL. Use PartType.legislationParts.destroyAll() instead.
        "prototype$__delete__legislationParts": {
          url: urlBase + "/partTypes/:id/legislationParts",
          method: "DELETE"
        },

        // INTERNAL. Use PartType.legislationParts.count() instead.
        "prototype$__count__legislationParts": {
          url: urlBase + "/partTypes/:id/legislationParts/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.PartType#create
         * @methodOf apiServices.PartType
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PartType` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/partTypes",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.PartType#createMany
         * @methodOf apiServices.PartType
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PartType` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/partTypes",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.PartType#upsert
         * @methodOf apiServices.PartType
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PartType` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/partTypes",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.PartType#exists
         * @methodOf apiServices.PartType
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/partTypes/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.PartType#findById
         * @methodOf apiServices.PartType
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PartType` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/partTypes/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.PartType#find
         * @methodOf apiServices.PartType
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PartType` object.)
         * </em>
         */
        "find": {
          url: urlBase + "/partTypes",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.PartType#findOne
         * @methodOf apiServices.PartType
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PartType` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/partTypes/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.PartType#updateAll
         * @methodOf apiServices.PartType
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/partTypes/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.PartType#deleteById
         * @methodOf apiServices.PartType
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PartType` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/partTypes/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.PartType#count
         * @methodOf apiServices.PartType
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/partTypes/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.PartType#prototype$updateAttributes
         * @methodOf apiServices.PartType
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PartType` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/partTypes/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.PartType#createChangeStream
         * @methodOf apiServices.PartType
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/partTypes/change-stream",
          method: "POST"
        },

        // INTERNAL. Use LegislationPart.partType() instead.
        "::get::legislationPart::partType": {
          url: urlBase + "/legislationParts/:id/partType",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.PartType#updateOrCreate
         * @methodOf apiServices.PartType
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PartType` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.PartType#update
         * @methodOf apiServices.PartType
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.PartType#destroyById
         * @methodOf apiServices.PartType
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PartType` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.PartType#removeById
         * @methodOf apiServices.PartType
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PartType` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.PartType#modelName
    * @propertyOf apiServices.PartType
    * @description
    * The name of the model represented by this $resource,
    * i.e. `PartType`.
    */
    R.modelName = "PartType";

    /**
     * @ngdoc object
     * @name apiServices.PartType.legislationParts
     * @header apiServices.PartType.legislationParts
     * @object
     * @description
     *
     * The object `PartType.legislationParts` groups methods
     * manipulating `LegislationPart` instances related to `PartType`.
     *
     * Call {@link apiServices.PartType#legislationParts PartType.legislationParts()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name apiServices.PartType#legislationParts
         * @methodOf apiServices.PartType
         *
         * @description
         *
         * Queries legislationParts of partType.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationPart` object.)
         * </em>
         */
        R.legislationParts = function() {
          var TargetResource = $injector.get("LegislationPart");
          var action = TargetResource["::get::partType::legislationParts"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.PartType.legislationParts#count
         * @methodOf apiServices.PartType.legislationParts
         *
         * @description
         *
         * Counts legislationParts of partType.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        R.legislationParts.count = function() {
          var TargetResource = $injector.get("LegislationPart");
          var action = TargetResource["::count::partType::legislationParts"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.PartType.legislationParts#create
         * @methodOf apiServices.PartType.legislationParts
         *
         * @description
         *
         * Creates a new instance in legislationParts of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationPart` object.)
         * </em>
         */
        R.legislationParts.create = function() {
          var TargetResource = $injector.get("LegislationPart");
          var action = TargetResource["::create::partType::legislationParts"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.PartType.legislationParts#createMany
         * @methodOf apiServices.PartType.legislationParts
         *
         * @description
         *
         * Creates a new instance in legislationParts of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationPart` object.)
         * </em>
         */
        R.legislationParts.createMany = function() {
          var TargetResource = $injector.get("LegislationPart");
          var action = TargetResource["::createMany::partType::legislationParts"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.PartType.legislationParts#destroyAll
         * @methodOf apiServices.PartType.legislationParts
         *
         * @description
         *
         * Deletes all legislationParts of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.legislationParts.destroyAll = function() {
          var TargetResource = $injector.get("LegislationPart");
          var action = TargetResource["::delete::partType::legislationParts"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.PartType.legislationParts#destroyById
         * @methodOf apiServices.PartType.legislationParts
         *
         * @description
         *
         * Delete a related item by id for legislationParts.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for legislationParts
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.legislationParts.destroyById = function() {
          var TargetResource = $injector.get("LegislationPart");
          var action = TargetResource["::destroyById::partType::legislationParts"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.PartType.legislationParts#findById
         * @methodOf apiServices.PartType.legislationParts
         *
         * @description
         *
         * Find a related item by id for legislationParts.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for legislationParts
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationPart` object.)
         * </em>
         */
        R.legislationParts.findById = function() {
          var TargetResource = $injector.get("LegislationPart");
          var action = TargetResource["::findById::partType::legislationParts"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.PartType.legislationParts#updateById
         * @methodOf apiServices.PartType.legislationParts
         *
         * @description
         *
         * Update a related item by id for legislationParts.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for legislationParts
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationPart` object.)
         * </em>
         */
        R.legislationParts.updateById = function() {
          var TargetResource = $injector.get("LegislationPart");
          var action = TargetResource["::updateById::partType::legislationParts"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.Legislation
 * @header apiServices.Legislation
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Legislation` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Legislation",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/legislations/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use Legislation.cases.findById() instead.
        "prototype$__findById__cases": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/legislations/:id/cases/:fk",
          method: "GET"
        },

        // INTERNAL. Use Legislation.cases.destroyById() instead.
        "prototype$__destroyById__cases": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/legislations/:id/cases/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Legislation.cases.updateById() instead.
        "prototype$__updateById__cases": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/legislations/:id/cases/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Legislation.capturedBy() instead.
        "prototype$__get__capturedBy": {
          url: urlBase + "/legislations/:id/capturedBy",
          method: "GET"
        },

        // INTERNAL. Use Legislation.cases() instead.
        "prototype$__get__cases": {
          isArray: true,
          url: urlBase + "/legislations/:id/cases",
          method: "GET"
        },

        // INTERNAL. Use Legislation.cases.create() instead.
        "prototype$__create__cases": {
          url: urlBase + "/legislations/:id/cases",
          method: "POST"
        },

        // INTERNAL. Use Legislation.cases.destroyAll() instead.
        "prototype$__delete__cases": {
          url: urlBase + "/legislations/:id/cases",
          method: "DELETE"
        },

        // INTERNAL. Use Legislation.cases.count() instead.
        "prototype$__count__cases": {
          url: urlBase + "/legislations/:id/cases/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Legislation#create
         * @methodOf apiServices.Legislation
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/legislations",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Legislation#createMany
         * @methodOf apiServices.Legislation
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/legislations",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Legislation#upsert
         * @methodOf apiServices.Legislation
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/legislations",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Legislation#exists
         * @methodOf apiServices.Legislation
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/legislations/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Legislation#findById
         * @methodOf apiServices.Legislation
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/legislations/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Legislation#find
         * @methodOf apiServices.Legislation
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        "find": {
          url: urlBase + "/legislations",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Legislation#findOne
         * @methodOf apiServices.Legislation
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/legislations/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Legislation#updateAll
         * @methodOf apiServices.Legislation
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/legislations/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Legislation#deleteById
         * @methodOf apiServices.Legislation
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/legislations/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.Legislation#count
         * @methodOf apiServices.Legislation
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/legislations/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Legislation#prototype$updateAttributes
         * @methodOf apiServices.Legislation
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/legislations/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Legislation#createChangeStream
         * @methodOf apiServices.Legislation
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/legislations/change-stream",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Legislation#summary
         * @methodOf apiServices.Legislation
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `summary` – `{Object=}` -
         */
        "summary": {
          url: urlBase + "/legislations/summary",
          method: "GET"
        },

        // INTERNAL. Use CaseLegislations.legislation() instead.
        "::get::caseLegislations::legislation": {
          url: urlBase + "/caseLegislations/:id/legislation",
          method: "GET"
        },

        // INTERNAL. Use Case.legislationsReferedTo.findById() instead.
        "::findById::case::legislationsReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/legislationsReferedTo/:fk",
          method: "GET"
        },

        // INTERNAL. Use Case.legislationsReferedTo.destroyById() instead.
        "::destroyById::case::legislationsReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/legislationsReferedTo/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Case.legislationsReferedTo.updateById() instead.
        "::updateById::case::legislationsReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/legislationsReferedTo/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Case.legislationsReferedTo.link() instead.
        "::link::case::legislationsReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/legislationsReferedTo/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Case.legislationsReferedTo.unlink() instead.
        "::unlink::case::legislationsReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/legislationsReferedTo/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Case.legislationsReferedTo.exists() instead.
        "::exists::case::legislationsReferedTo": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/cases/:id/legislationsReferedTo/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use Case.legislationsReferedTo() instead.
        "::get::case::legislationsReferedTo": {
          isArray: true,
          url: urlBase + "/cases/:id/legislationsReferedTo",
          method: "GET"
        },

        // INTERNAL. Use Case.legislationsReferedTo.create() instead.
        "::create::case::legislationsReferedTo": {
          url: urlBase + "/cases/:id/legislationsReferedTo",
          method: "POST"
        },

        // INTERNAL. Use Case.legislationsReferedTo.createMany() instead.
        "::createMany::case::legislationsReferedTo": {
          isArray: true,
          url: urlBase + "/cases/:id/legislationsReferedTo",
          method: "POST"
        },

        // INTERNAL. Use Case.legislationsReferedTo.destroyAll() instead.
        "::delete::case::legislationsReferedTo": {
          url: urlBase + "/cases/:id/legislationsReferedTo",
          method: "DELETE"
        },

        // INTERNAL. Use Case.legislationsReferedTo.count() instead.
        "::count::case::legislationsReferedTo": {
          url: urlBase + "/cases/:id/legislationsReferedTo/count",
          method: "GET"
        },

        // INTERNAL. Use Appuser.legislations.findById() instead.
        "::findById::appuser::legislations": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/appusers/:id/legislations/:fk",
          method: "GET"
        },

        // INTERNAL. Use Appuser.legislations.destroyById() instead.
        "::destroyById::appuser::legislations": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/appusers/:id/legislations/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Appuser.legislations.updateById() instead.
        "::updateById::appuser::legislations": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/appusers/:id/legislations/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Appuser.legislations() instead.
        "::get::appuser::legislations": {
          isArray: true,
          url: urlBase + "/appusers/:id/legislations",
          method: "GET"
        },

        // INTERNAL. Use Appuser.legislations.create() instead.
        "::create::appuser::legislations": {
          url: urlBase + "/appusers/:id/legislations",
          method: "POST"
        },

        // INTERNAL. Use Appuser.legislations.createMany() instead.
        "::createMany::appuser::legislations": {
          isArray: true,
          url: urlBase + "/appusers/:id/legislations",
          method: "POST"
        },

        // INTERNAL. Use Appuser.legislations.destroyAll() instead.
        "::delete::appuser::legislations": {
          url: urlBase + "/appusers/:id/legislations",
          method: "DELETE"
        },

        // INTERNAL. Use Appuser.legislations.count() instead.
        "::count::appuser::legislations": {
          url: urlBase + "/appusers/:id/legislations/count",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.Legislation#updateOrCreate
         * @methodOf apiServices.Legislation
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.Legislation#update
         * @methodOf apiServices.Legislation
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.Legislation#destroyById
         * @methodOf apiServices.Legislation
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.Legislation#removeById
         * @methodOf apiServices.Legislation
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.Legislation#modelName
    * @propertyOf apiServices.Legislation
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Legislation`.
    */
    R.modelName = "Legislation";

    /**
     * @ngdoc object
     * @name apiServices.Legislation.cases
     * @header apiServices.Legislation.cases
     * @object
     * @description
     *
     * The object `Legislation.cases` groups methods
     * manipulating `Case` instances related to `Legislation`.
     *
     * Call {@link apiServices.Legislation#cases Legislation.cases()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name apiServices.Legislation#cases
         * @methodOf apiServices.Legislation
         *
         * @description
         *
         * Queries cases of legislation.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.cases = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::get::legislation::cases"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Legislation.cases#count
         * @methodOf apiServices.Legislation.cases
         *
         * @description
         *
         * Counts cases of legislation.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        R.cases.count = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::count::legislation::cases"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Legislation.cases#create
         * @methodOf apiServices.Legislation.cases
         *
         * @description
         *
         * Creates a new instance in cases of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.cases.create = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::create::legislation::cases"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Legislation.cases#createMany
         * @methodOf apiServices.Legislation.cases
         *
         * @description
         *
         * Creates a new instance in cases of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.cases.createMany = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::createMany::legislation::cases"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Legislation.cases#destroyAll
         * @methodOf apiServices.Legislation.cases
         *
         * @description
         *
         * Deletes all cases of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.cases.destroyAll = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::delete::legislation::cases"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Legislation.cases#destroyById
         * @methodOf apiServices.Legislation.cases
         *
         * @description
         *
         * Delete a related item by id for cases.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cases
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.cases.destroyById = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::destroyById::legislation::cases"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Legislation.cases#findById
         * @methodOf apiServices.Legislation.cases
         *
         * @description
         *
         * Find a related item by id for cases.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cases
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.cases.findById = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::findById::legislation::cases"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Legislation.cases#updateById
         * @methodOf apiServices.Legislation.cases
         *
         * @description
         *
         * Update a related item by id for cases.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cases
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.cases.updateById = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::updateById::legislation::cases"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Legislation#capturedBy
         * @methodOf apiServices.Legislation
         *
         * @description
         *
         * Fetches belongsTo relation capturedBy.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appuser` object.)
         * </em>
         */
        R.capturedBy = function() {
          var TargetResource = $injector.get("Appuser");
          var action = TargetResource["::get::legislation::capturedBy"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.LegislationType
 * @header apiServices.LegislationType
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `LegislationType` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "LegislationType",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/legislationTypes/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name apiServices.LegislationType#create
         * @methodOf apiServices.LegislationType
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationType` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/legislationTypes",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationType#createMany
         * @methodOf apiServices.LegislationType
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationType` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/legislationTypes",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationType#upsert
         * @methodOf apiServices.LegislationType
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationType` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/legislationTypes",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationType#exists
         * @methodOf apiServices.LegislationType
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/legislationTypes/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationType#findById
         * @methodOf apiServices.LegislationType
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationType` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/legislationTypes/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationType#find
         * @methodOf apiServices.LegislationType
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationType` object.)
         * </em>
         */
        "find": {
          url: urlBase + "/legislationTypes",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationType#findOne
         * @methodOf apiServices.LegislationType
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationType` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/legislationTypes/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationType#updateAll
         * @methodOf apiServices.LegislationType
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/legislationTypes/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationType#deleteById
         * @methodOf apiServices.LegislationType
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationType` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/legislationTypes/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationType#count
         * @methodOf apiServices.LegislationType
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/legislationTypes/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationType#prototype$updateAttributes
         * @methodOf apiServices.LegislationType
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationType` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/legislationTypes/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.LegislationType#createChangeStream
         * @methodOf apiServices.LegislationType
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/legislationTypes/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.LegislationType#updateOrCreate
         * @methodOf apiServices.LegislationType
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationType` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.LegislationType#update
         * @methodOf apiServices.LegislationType
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.LegislationType#destroyById
         * @methodOf apiServices.LegislationType
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationType` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.LegislationType#removeById
         * @methodOf apiServices.LegislationType
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `LegislationType` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.LegislationType#modelName
    * @propertyOf apiServices.LegislationType
    * @description
    * The name of the model represented by this $resource,
    * i.e. `LegislationType`.
    */
    R.modelName = "LegislationType";


    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.Work
 * @header apiServices.Work
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Work` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Work",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/works/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name apiServices.Work#create
         * @methodOf apiServices.Work
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Work` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/works",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Work#createMany
         * @methodOf apiServices.Work
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Work` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/works",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Work#upsert
         * @methodOf apiServices.Work
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Work` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/works",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Work#exists
         * @methodOf apiServices.Work
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/works/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Work#findById
         * @methodOf apiServices.Work
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Work` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/works/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Work#find
         * @methodOf apiServices.Work
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Work` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/works",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Work#findOne
         * @methodOf apiServices.Work
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Work` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/works/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Work#updateAll
         * @methodOf apiServices.Work
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/works/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Work#deleteById
         * @methodOf apiServices.Work
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Work` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/works/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.Work#count
         * @methodOf apiServices.Work
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/works/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Work#prototype$updateAttributes
         * @methodOf apiServices.Work
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Work` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/works/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Work#createChangeStream
         * @methodOf apiServices.Work
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/works/change-stream",
          method: "POST"
        },

        // INTERNAL. Use CaseWorks.workReferedTo() instead.
        "::get::caseWorks::workReferedTo": {
          url: urlBase + "/caseWorks/:id/workReferedTo",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.Work#updateOrCreate
         * @methodOf apiServices.Work
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Work` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.Work#update
         * @methodOf apiServices.Work
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.Work#destroyById
         * @methodOf apiServices.Work
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Work` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.Work#removeById
         * @methodOf apiServices.Work
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Work` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.Work#modelName
    * @propertyOf apiServices.Work
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Work`.
    */
    R.modelName = "Work";


    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.Appearance
 * @header apiServices.Appearance
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Appearance` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Appearance",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/appearances/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name apiServices.Appearance#create
         * @methodOf apiServices.Appearance
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appearance` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/appearances",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appearance#createMany
         * @methodOf apiServices.Appearance
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appearance` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/appearances",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appearance#upsert
         * @methodOf apiServices.Appearance
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appearance` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/appearances",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appearance#exists
         * @methodOf apiServices.Appearance
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/appearances/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appearance#findById
         * @methodOf apiServices.Appearance
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appearance` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/appearances/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appearance#find
         * @methodOf apiServices.Appearance
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appearance` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/appearances",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appearance#findOne
         * @methodOf apiServices.Appearance
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appearance` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/appearances/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appearance#updateAll
         * @methodOf apiServices.Appearance
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/appearances/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appearance#deleteById
         * @methodOf apiServices.Appearance
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appearance` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/appearances/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appearance#count
         * @methodOf apiServices.Appearance
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/appearances/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appearance#prototype$updateAttributes
         * @methodOf apiServices.Appearance
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appearance` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/appearances/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appearance#createChangeStream
         * @methodOf apiServices.Appearance
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/appearances/change-stream",
          method: "POST"
        },

        // INTERNAL. Use Advocate.appearance.findById() instead.
        "::findById::advocate::appearance": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/advocates/:id/appearance/:fk",
          method: "GET"
        },

        // INTERNAL. Use Advocate.appearance.destroyById() instead.
        "::destroyById::advocate::appearance": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/advocates/:id/appearance/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Advocate.appearance.updateById() instead.
        "::updateById::advocate::appearance": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/advocates/:id/appearance/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Advocate.appearance.link() instead.
        "::link::advocate::appearance": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/advocates/:id/appearance/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Advocate.appearance.unlink() instead.
        "::unlink::advocate::appearance": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/advocates/:id/appearance/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Advocate.appearance.exists() instead.
        "::exists::advocate::appearance": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/advocates/:id/appearance/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use Advocate.appearance() instead.
        "::get::advocate::appearance": {
          isArray: true,
          url: urlBase + "/advocates/:id/appearance",
          method: "GET"
        },

        // INTERNAL. Use Advocate.appearance.create() instead.
        "::create::advocate::appearance": {
          url: urlBase + "/advocates/:id/appearance",
          method: "POST"
        },

        // INTERNAL. Use Advocate.appearance.createMany() instead.
        "::createMany::advocate::appearance": {
          isArray: true,
          url: urlBase + "/advocates/:id/appearance",
          method: "POST"
        },

        // INTERNAL. Use Advocate.appearance.destroyAll() instead.
        "::delete::advocate::appearance": {
          url: urlBase + "/advocates/:id/appearance",
          method: "DELETE"
        },

        // INTERNAL. Use Advocate.appearance.count() instead.
        "::count::advocate::appearance": {
          url: urlBase + "/advocates/:id/appearance/count",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.Appearance#updateOrCreate
         * @methodOf apiServices.Appearance
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appearance` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.Appearance#update
         * @methodOf apiServices.Appearance
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.Appearance#destroyById
         * @methodOf apiServices.Appearance
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appearance` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.Appearance#removeById
         * @methodOf apiServices.Appearance
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appearance` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.Appearance#modelName
    * @propertyOf apiServices.Appearance
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Appearance`.
    */
    R.modelName = "Appearance";


    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.PlaintiffSynonyms
 * @header apiServices.PlaintiffSynonyms
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `PlaintiffSynonyms` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "PlaintiffSynonyms",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/plaintiffSynonyms/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name apiServices.PlaintiffSynonyms#create
         * @methodOf apiServices.PlaintiffSynonyms
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PlaintiffSynonyms` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/plaintiffSynonyms",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.PlaintiffSynonyms#createMany
         * @methodOf apiServices.PlaintiffSynonyms
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PlaintiffSynonyms` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/plaintiffSynonyms",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.PlaintiffSynonyms#upsert
         * @methodOf apiServices.PlaintiffSynonyms
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PlaintiffSynonyms` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/plaintiffSynonyms",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.PlaintiffSynonyms#exists
         * @methodOf apiServices.PlaintiffSynonyms
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/plaintiffSynonyms/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.PlaintiffSynonyms#findById
         * @methodOf apiServices.PlaintiffSynonyms
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PlaintiffSynonyms` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/plaintiffSynonyms/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.PlaintiffSynonyms#find
         * @methodOf apiServices.PlaintiffSynonyms
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PlaintiffSynonyms` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/plaintiffSynonyms",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.PlaintiffSynonyms#findOne
         * @methodOf apiServices.PlaintiffSynonyms
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PlaintiffSynonyms` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/plaintiffSynonyms/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.PlaintiffSynonyms#updateAll
         * @methodOf apiServices.PlaintiffSynonyms
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/plaintiffSynonyms/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.PlaintiffSynonyms#deleteById
         * @methodOf apiServices.PlaintiffSynonyms
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PlaintiffSynonyms` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/plaintiffSynonyms/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.PlaintiffSynonyms#count
         * @methodOf apiServices.PlaintiffSynonyms
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/plaintiffSynonyms/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.PlaintiffSynonyms#prototype$updateAttributes
         * @methodOf apiServices.PlaintiffSynonyms
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PlaintiffSynonyms` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/plaintiffSynonyms/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.PlaintiffSynonyms#createChangeStream
         * @methodOf apiServices.PlaintiffSynonyms
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/plaintiffSynonyms/change-stream",
          method: "POST"
        },

        // INTERNAL. Use Case.plaintiffSynonym() instead.
        "::get::case::plaintiffSynonym": {
          url: urlBase + "/cases/:id/plaintiffSynonym",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.PlaintiffSynonyms#updateOrCreate
         * @methodOf apiServices.PlaintiffSynonyms
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PlaintiffSynonyms` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.PlaintiffSynonyms#update
         * @methodOf apiServices.PlaintiffSynonyms
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.PlaintiffSynonyms#destroyById
         * @methodOf apiServices.PlaintiffSynonyms
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PlaintiffSynonyms` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.PlaintiffSynonyms#removeById
         * @methodOf apiServices.PlaintiffSynonyms
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PlaintiffSynonyms` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.PlaintiffSynonyms#modelName
    * @propertyOf apiServices.PlaintiffSynonyms
    * @description
    * The name of the model represented by this $resource,
    * i.e. `PlaintiffSynonyms`.
    */
    R.modelName = "PlaintiffSynonyms";


    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.DefendantSynonyms
 * @header apiServices.DefendantSynonyms
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `DefendantSynonyms` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "DefendantSynonyms",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/defendantSynonyms/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name apiServices.DefendantSynonyms#create
         * @methodOf apiServices.DefendantSynonyms
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DefendantSynonyms` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/defendantSynonyms",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.DefendantSynonyms#createMany
         * @methodOf apiServices.DefendantSynonyms
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DefendantSynonyms` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/defendantSynonyms",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.DefendantSynonyms#upsert
         * @methodOf apiServices.DefendantSynonyms
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DefendantSynonyms` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/defendantSynonyms",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.DefendantSynonyms#exists
         * @methodOf apiServices.DefendantSynonyms
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/defendantSynonyms/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.DefendantSynonyms#findById
         * @methodOf apiServices.DefendantSynonyms
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DefendantSynonyms` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/defendantSynonyms/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.DefendantSynonyms#find
         * @methodOf apiServices.DefendantSynonyms
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DefendantSynonyms` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/defendantSynonyms",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.DefendantSynonyms#findOne
         * @methodOf apiServices.DefendantSynonyms
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DefendantSynonyms` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/defendantSynonyms/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.DefendantSynonyms#updateAll
         * @methodOf apiServices.DefendantSynonyms
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/defendantSynonyms/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.DefendantSynonyms#deleteById
         * @methodOf apiServices.DefendantSynonyms
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DefendantSynonyms` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/defendantSynonyms/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.DefendantSynonyms#count
         * @methodOf apiServices.DefendantSynonyms
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/defendantSynonyms/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.DefendantSynonyms#prototype$updateAttributes
         * @methodOf apiServices.DefendantSynonyms
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DefendantSynonyms` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/defendantSynonyms/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.DefendantSynonyms#createChangeStream
         * @methodOf apiServices.DefendantSynonyms
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/defendantSynonyms/change-stream",
          method: "POST"
        },

        // INTERNAL. Use Case.defendantSynonym() instead.
        "::get::case::defendantSynonym": {
          url: urlBase + "/cases/:id/defendantSynonym",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.DefendantSynonyms#updateOrCreate
         * @methodOf apiServices.DefendantSynonyms
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DefendantSynonyms` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.DefendantSynonyms#update
         * @methodOf apiServices.DefendantSynonyms
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.DefendantSynonyms#destroyById
         * @methodOf apiServices.DefendantSynonyms
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DefendantSynonyms` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.DefendantSynonyms#removeById
         * @methodOf apiServices.DefendantSynonyms
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DefendantSynonyms` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.DefendantSynonyms#modelName
    * @propertyOf apiServices.DefendantSynonyms
    * @description
    * The name of the model represented by this $resource,
    * i.e. `DefendantSynonyms`.
    */
    R.modelName = "DefendantSynonyms";


    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.Jurisdiction
 * @header apiServices.Jurisdiction
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Jurisdiction` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Jurisdiction",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/jurisdictions/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name apiServices.Jurisdiction#create
         * @methodOf apiServices.Jurisdiction
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Jurisdiction` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/jurisdictions",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Jurisdiction#createMany
         * @methodOf apiServices.Jurisdiction
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Jurisdiction` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/jurisdictions",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Jurisdiction#upsert
         * @methodOf apiServices.Jurisdiction
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Jurisdiction` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/jurisdictions",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Jurisdiction#exists
         * @methodOf apiServices.Jurisdiction
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/jurisdictions/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Jurisdiction#findById
         * @methodOf apiServices.Jurisdiction
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Jurisdiction` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/jurisdictions/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Jurisdiction#find
         * @methodOf apiServices.Jurisdiction
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Jurisdiction` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/jurisdictions",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Jurisdiction#findOne
         * @methodOf apiServices.Jurisdiction
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Jurisdiction` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/jurisdictions/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Jurisdiction#updateAll
         * @methodOf apiServices.Jurisdiction
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/jurisdictions/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Jurisdiction#deleteById
         * @methodOf apiServices.Jurisdiction
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Jurisdiction` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/jurisdictions/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.Jurisdiction#count
         * @methodOf apiServices.Jurisdiction
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/jurisdictions/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Jurisdiction#prototype$updateAttributes
         * @methodOf apiServices.Jurisdiction
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Jurisdiction` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/jurisdictions/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Jurisdiction#createChangeStream
         * @methodOf apiServices.Jurisdiction
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/jurisdictions/change-stream",
          method: "POST"
        },

        // INTERNAL. Use Case.jurisdiction() instead.
        "::get::case::jurisdiction": {
          url: urlBase + "/cases/:id/jurisdiction",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.Jurisdiction#updateOrCreate
         * @methodOf apiServices.Jurisdiction
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Jurisdiction` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.Jurisdiction#update
         * @methodOf apiServices.Jurisdiction
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.Jurisdiction#destroyById
         * @methodOf apiServices.Jurisdiction
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Jurisdiction` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.Jurisdiction#removeById
         * @methodOf apiServices.Jurisdiction
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Jurisdiction` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.Jurisdiction#modelName
    * @propertyOf apiServices.Jurisdiction
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Jurisdiction`.
    */
    R.modelName = "Jurisdiction";


    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.Location
 * @header apiServices.Location
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Location` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Location",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/locations/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name apiServices.Location#create
         * @methodOf apiServices.Location
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Location` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/locations",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Location#createMany
         * @methodOf apiServices.Location
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Location` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/locations",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Location#upsert
         * @methodOf apiServices.Location
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Location` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/locations",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Location#exists
         * @methodOf apiServices.Location
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/locations/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Location#findById
         * @methodOf apiServices.Location
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Location` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/locations/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Location#find
         * @methodOf apiServices.Location
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Location` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/locations",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Location#findOne
         * @methodOf apiServices.Location
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Location` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/locations/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Location#updateAll
         * @methodOf apiServices.Location
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/locations/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Location#deleteById
         * @methodOf apiServices.Location
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Location` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/locations/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.Location#count
         * @methodOf apiServices.Location
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/locations/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Location#prototype$updateAttributes
         * @methodOf apiServices.Location
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Location` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/locations/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Location#createChangeStream
         * @methodOf apiServices.Location
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/locations/change-stream",
          method: "POST"
        },

        // INTERNAL. Use Case.location() instead.
        "::get::case::location": {
          url: urlBase + "/cases/:id/location",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.Location#updateOrCreate
         * @methodOf apiServices.Location
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Location` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.Location#update
         * @methodOf apiServices.Location
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.Location#destroyById
         * @methodOf apiServices.Location
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Location` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.Location#removeById
         * @methodOf apiServices.Location
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Location` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.Location#modelName
    * @propertyOf apiServices.Location
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Location`.
    */
    R.modelName = "Location";


    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.CourtDivision
 * @header apiServices.CourtDivision
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `CourtDivision` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "CourtDivision",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/courtDivisions/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name apiServices.CourtDivision#create
         * @methodOf apiServices.CourtDivision
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CourtDivision` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/courtDivisions",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.CourtDivision#createMany
         * @methodOf apiServices.CourtDivision
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CourtDivision` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/courtDivisions",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.CourtDivision#upsert
         * @methodOf apiServices.CourtDivision
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CourtDivision` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/courtDivisions",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.CourtDivision#exists
         * @methodOf apiServices.CourtDivision
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/courtDivisions/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CourtDivision#findById
         * @methodOf apiServices.CourtDivision
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CourtDivision` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/courtDivisions/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CourtDivision#find
         * @methodOf apiServices.CourtDivision
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CourtDivision` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/courtDivisions",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CourtDivision#findOne
         * @methodOf apiServices.CourtDivision
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CourtDivision` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/courtDivisions/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CourtDivision#updateAll
         * @methodOf apiServices.CourtDivision
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/courtDivisions/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.CourtDivision#deleteById
         * @methodOf apiServices.CourtDivision
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CourtDivision` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/courtDivisions/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.CourtDivision#count
         * @methodOf apiServices.CourtDivision
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/courtDivisions/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.CourtDivision#prototype$updateAttributes
         * @methodOf apiServices.CourtDivision
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CourtDivision` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/courtDivisions/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.CourtDivision#createChangeStream
         * @methodOf apiServices.CourtDivision
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/courtDivisions/change-stream",
          method: "POST"
        },

        // INTERNAL. Use Case.courtDivision() instead.
        "::get::case::courtDivision": {
          url: urlBase + "/cases/:id/courtDivision",
          method: "GET"
        },

        // INTERNAL. Use Court.divisions.findById() instead.
        "::findById::court::divisions": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/courts/:id/divisions/:fk",
          method: "GET"
        },

        // INTERNAL. Use Court.divisions.destroyById() instead.
        "::destroyById::court::divisions": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/courts/:id/divisions/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Court.divisions.updateById() instead.
        "::updateById::court::divisions": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/courts/:id/divisions/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Court.divisions() instead.
        "::get::court::divisions": {
          isArray: true,
          url: urlBase + "/courts/:id/divisions",
          method: "GET"
        },

        // INTERNAL. Use Court.divisions.create() instead.
        "::create::court::divisions": {
          url: urlBase + "/courts/:id/divisions",
          method: "POST"
        },

        // INTERNAL. Use Court.divisions.createMany() instead.
        "::createMany::court::divisions": {
          isArray: true,
          url: urlBase + "/courts/:id/divisions",
          method: "POST"
        },

        // INTERNAL. Use Court.divisions.destroyAll() instead.
        "::delete::court::divisions": {
          url: urlBase + "/courts/:id/divisions",
          method: "DELETE"
        },

        // INTERNAL. Use Court.divisions.count() instead.
        "::count::court::divisions": {
          url: urlBase + "/courts/:id/divisions/count",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.CourtDivision#updateOrCreate
         * @methodOf apiServices.CourtDivision
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CourtDivision` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.CourtDivision#update
         * @methodOf apiServices.CourtDivision
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.CourtDivision#destroyById
         * @methodOf apiServices.CourtDivision
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CourtDivision` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.CourtDivision#removeById
         * @methodOf apiServices.CourtDivision
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CourtDivision` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.CourtDivision#modelName
    * @propertyOf apiServices.CourtDivision
    * @description
    * The name of the model represented by this $resource,
    * i.e. `CourtDivision`.
    */
    R.modelName = "CourtDivision";


    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.Appuser
 * @header apiServices.Appuser
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Appuser` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Appuser",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/appusers/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name apiServices.Appuser#prototype$__findById__accessTokens
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Find a related item by id for accessTokens.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appuser` object.)
         * </em>
         */
        "prototype$__findById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/appusers/:id/accessTokens/:fk",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#prototype$__destroyById__accessTokens
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Delete a related item by id for accessTokens.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__destroyById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/appusers/:id/accessTokens/:fk",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#prototype$__updateById__accessTokens
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Update a related item by id for accessTokens.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appuser` object.)
         * </em>
         */
        "prototype$__updateById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/appusers/:id/accessTokens/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Appuser.cases.findById() instead.
        "prototype$__findById__cases": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/appusers/:id/cases/:fk",
          method: "GET"
        },

        // INTERNAL. Use Appuser.cases.destroyById() instead.
        "prototype$__destroyById__cases": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/appusers/:id/cases/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Appuser.cases.updateById() instead.
        "prototype$__updateById__cases": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/appusers/:id/cases/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Appuser.legislations.findById() instead.
        "prototype$__findById__legislations": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/appusers/:id/legislations/:fk",
          method: "GET"
        },

        // INTERNAL. Use Appuser.legislations.destroyById() instead.
        "prototype$__destroyById__legislations": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/appusers/:id/legislations/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Appuser.legislations.updateById() instead.
        "prototype$__updateById__legislations": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/appusers/:id/legislations/:fk",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#prototype$__get__accessTokens
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Queries accessTokens of appuser.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appuser` object.)
         * </em>
         */
        "prototype$__get__accessTokens": {
          isArray: true,
          url: urlBase + "/appusers/:id/accessTokens",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#prototype$__create__accessTokens
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Creates a new instance in accessTokens of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appuser` object.)
         * </em>
         */
        "prototype$__create__accessTokens": {
          url: urlBase + "/appusers/:id/accessTokens",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#prototype$__delete__accessTokens
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Deletes all accessTokens of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__delete__accessTokens": {
          url: urlBase + "/appusers/:id/accessTokens",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#prototype$__count__accessTokens
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Counts accessTokens of appuser.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "prototype$__count__accessTokens": {
          url: urlBase + "/appusers/:id/accessTokens/count",
          method: "GET"
        },

        // INTERNAL. Use Appuser.cases() instead.
        "prototype$__get__cases": {
          isArray: true,
          url: urlBase + "/appusers/:id/cases",
          method: "GET"
        },

        // INTERNAL. Use Appuser.cases.create() instead.
        "prototype$__create__cases": {
          url: urlBase + "/appusers/:id/cases",
          method: "POST"
        },

        // INTERNAL. Use Appuser.cases.destroyAll() instead.
        "prototype$__delete__cases": {
          url: urlBase + "/appusers/:id/cases",
          method: "DELETE"
        },

        // INTERNAL. Use Appuser.cases.count() instead.
        "prototype$__count__cases": {
          url: urlBase + "/appusers/:id/cases/count",
          method: "GET"
        },

        // INTERNAL. Use Appuser.legislations() instead.
        "prototype$__get__legislations": {
          isArray: true,
          url: urlBase + "/appusers/:id/legislations",
          method: "GET"
        },

        // INTERNAL. Use Appuser.legislations.create() instead.
        "prototype$__create__legislations": {
          url: urlBase + "/appusers/:id/legislations",
          method: "POST"
        },

        // INTERNAL. Use Appuser.legislations.destroyAll() instead.
        "prototype$__delete__legislations": {
          url: urlBase + "/appusers/:id/legislations",
          method: "DELETE"
        },

        // INTERNAL. Use Appuser.legislations.count() instead.
        "prototype$__count__legislations": {
          url: urlBase + "/appusers/:id/legislations/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#create
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appuser` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/appusers",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#createMany
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appuser` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/appusers",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#upsert
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appuser` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/appusers",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#exists
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/appusers/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#findById
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appuser` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/appusers/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#find
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appuser` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/appusers",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#findOne
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appuser` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/appusers/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#updateAll
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/appusers/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#deleteById
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appuser` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/appusers/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#count
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/appusers/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#prototype$updateAttributes
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appuser` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/appusers/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#createChangeStream
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/appusers/change-stream",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#login
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Login a user with username/email and password.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `include` – `{string=}` - Related objects to include in the response. See the description of return value for more details.
         *   Default value: `user`.
         *
         *  - `rememberMe` - `boolean` - Whether the authentication credentials
         *     should be remembered in localStorage across app/browser restarts.
         *     Default: `true`.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The response body contains properties of the AccessToken created on login.
         * Depending on the value of `include` parameter, the body may contain additional properties:
         *
         *   - `user` - `{User}` - Data of the currently logged in user. (`include=user`)
         *
         *
         */
        "login": {
          params: {
            include: "user"
          },
          interceptor: {
            response: function(response) {
              var accessToken = response.data;
              LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
              LoopBackAuth.rememberMe = response.config.params.rememberMe !== false;
              LoopBackAuth.save();
              return response.resource;
            }
          },
          url: urlBase + "/appusers/login",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#logout
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Logout a user with access token.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `access_token` – `{string}` - Do not supply this argument, it is automatically extracted from request headers.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "logout": {
          interceptor: {
            response: function(response) {
              LoopBackAuth.clearUser();
              LoopBackAuth.clearStorage();
              return response.resource;
            }
          },
          url: urlBase + "/appusers/logout",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#confirm
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Confirm a user registration with email verification token.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `uid` – `{string}` -
         *
         *  - `token` – `{string}` -
         *
         *  - `redirect` – `{string=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "confirm": {
          url: urlBase + "/appusers/confirm",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#resetPassword
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Reset password for a user with email.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "resetPassword": {
          url: urlBase + "/appusers/reset",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#performance
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `performance` – `{[{}]=}` -
         */
        "performance": {
          url: urlBase + "/appusers/performance",
          method: "GET"
        },

        // INTERNAL. Use Legislation.capturedBy() instead.
        "::get::legislation::capturedBy": {
          url: urlBase + "/legislations/:id/capturedBy",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Appuser#getCurrent
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Get data of the currently logged user. Fail with HTTP result 401
         * when there is no user logged in.
         *
         * @param {function(Object,Object)=} successCb
         *    Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *    `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         */
        "getCurrent": {
           url: urlBase + "/appusers" + "/:id",
           method: "GET",
           params: {
             id: function() {
              var id = LoopBackAuth.currentUserId;
              if (id == null) id = '__anonymous__';
              return id;
            },
          },
          interceptor: {
            response: function(response) {
              LoopBackAuth.currentUserData = response.data;
              return response.resource;
            }
          },
          __isGetCurrentUser__ : true
        }
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.Appuser#updateOrCreate
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appuser` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.Appuser#update
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.Appuser#destroyById
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appuser` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.Appuser#removeById
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Appuser` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.Appuser#getCachedCurrent
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Get data of the currently logged user that was returned by the last
         * call to {@link apiServices.Appuser#login} or
         * {@link apiServices.Appuser#getCurrent}. Return null when there
         * is no user logged in or the data of the current user were not fetched
         * yet.
         *
         * @returns {Object} A Appuser instance.
         */
        R.getCachedCurrent = function() {
          var data = LoopBackAuth.currentUserData;
          return data ? new R(data) : null;
        };

        /**
         * @ngdoc method
         * @name apiServices.Appuser#isAuthenticated
         * @methodOf apiServices.Appuser
         *
         * @returns {boolean} True if the current user is authenticated (logged in).
         */
        R.isAuthenticated = function() {
          return this.getCurrentId() != null;
        };

        /**
         * @ngdoc method
         * @name apiServices.Appuser#getCurrentId
         * @methodOf apiServices.Appuser
         *
         * @returns {Object} Id of the currently logged-in user or null.
         */
        R.getCurrentId = function() {
          return LoopBackAuth.currentUserId;
        };

    /**
    * @ngdoc property
    * @name apiServices.Appuser#modelName
    * @propertyOf apiServices.Appuser
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Appuser`.
    */
    R.modelName = "Appuser";

    /**
     * @ngdoc object
     * @name apiServices.Appuser.cases
     * @header apiServices.Appuser.cases
     * @object
     * @description
     *
     * The object `Appuser.cases` groups methods
     * manipulating `Case` instances related to `Appuser`.
     *
     * Call {@link apiServices.Appuser#cases Appuser.cases()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name apiServices.Appuser#cases
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Queries cases of appuser.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.cases = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::get::appuser::cases"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Appuser.cases#count
         * @methodOf apiServices.Appuser.cases
         *
         * @description
         *
         * Counts cases of appuser.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        R.cases.count = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::count::appuser::cases"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Appuser.cases#create
         * @methodOf apiServices.Appuser.cases
         *
         * @description
         *
         * Creates a new instance in cases of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.cases.create = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::create::appuser::cases"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Appuser.cases#createMany
         * @methodOf apiServices.Appuser.cases
         *
         * @description
         *
         * Creates a new instance in cases of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.cases.createMany = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::createMany::appuser::cases"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Appuser.cases#destroyAll
         * @methodOf apiServices.Appuser.cases
         *
         * @description
         *
         * Deletes all cases of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.cases.destroyAll = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::delete::appuser::cases"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Appuser.cases#destroyById
         * @methodOf apiServices.Appuser.cases
         *
         * @description
         *
         * Delete a related item by id for cases.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for cases
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.cases.destroyById = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::destroyById::appuser::cases"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Appuser.cases#findById
         * @methodOf apiServices.Appuser.cases
         *
         * @description
         *
         * Find a related item by id for cases.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for cases
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.cases.findById = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::findById::appuser::cases"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Appuser.cases#updateById
         * @methodOf apiServices.Appuser.cases
         *
         * @description
         *
         * Update a related item by id for cases.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for cases
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Case` object.)
         * </em>
         */
        R.cases.updateById = function() {
          var TargetResource = $injector.get("Case");
          var action = TargetResource["::updateById::appuser::cases"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name apiServices.Appuser.legislations
     * @header apiServices.Appuser.legislations
     * @object
     * @description
     *
     * The object `Appuser.legislations` groups methods
     * manipulating `Legislation` instances related to `Appuser`.
     *
     * Call {@link apiServices.Appuser#legislations Appuser.legislations()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name apiServices.Appuser#legislations
         * @methodOf apiServices.Appuser
         *
         * @description
         *
         * Queries legislations of appuser.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `filter` – `{object=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        R.legislations = function() {
          var TargetResource = $injector.get("Legislation");
          var action = TargetResource["::get::appuser::legislations"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Appuser.legislations#count
         * @methodOf apiServices.Appuser.legislations
         *
         * @description
         *
         * Counts legislations of appuser.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        R.legislations.count = function() {
          var TargetResource = $injector.get("Legislation");
          var action = TargetResource["::count::appuser::legislations"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Appuser.legislations#create
         * @methodOf apiServices.Appuser.legislations
         *
         * @description
         *
         * Creates a new instance in legislations of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        R.legislations.create = function() {
          var TargetResource = $injector.get("Legislation");
          var action = TargetResource["::create::appuser::legislations"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Appuser.legislations#createMany
         * @methodOf apiServices.Appuser.legislations
         *
         * @description
         *
         * Creates a new instance in legislations of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        R.legislations.createMany = function() {
          var TargetResource = $injector.get("Legislation");
          var action = TargetResource["::createMany::appuser::legislations"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Appuser.legislations#destroyAll
         * @methodOf apiServices.Appuser.legislations
         *
         * @description
         *
         * Deletes all legislations of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.legislations.destroyAll = function() {
          var TargetResource = $injector.get("Legislation");
          var action = TargetResource["::delete::appuser::legislations"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Appuser.legislations#destroyById
         * @methodOf apiServices.Appuser.legislations
         *
         * @description
         *
         * Delete a related item by id for legislations.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for legislations
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.legislations.destroyById = function() {
          var TargetResource = $injector.get("Legislation");
          var action = TargetResource["::destroyById::appuser::legislations"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Appuser.legislations#findById
         * @methodOf apiServices.Appuser.legislations
         *
         * @description
         *
         * Find a related item by id for legislations.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for legislations
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        R.legislations.findById = function() {
          var TargetResource = $injector.get("Legislation");
          var action = TargetResource["::findById::appuser::legislations"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name apiServices.Appuser.legislations#updateById
         * @methodOf apiServices.Appuser.legislations
         *
         * @description
         *
         * Update a related item by id for legislations.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for legislations
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Legislation` object.)
         * </em>
         */
        R.legislations.updateById = function() {
          var TargetResource = $injector.get("Legislation");
          var action = TargetResource["::updateById::appuser::legislations"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.Table
 * @header apiServices.Table
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Table` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Table",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/tables/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name apiServices.Table#create
         * @methodOf apiServices.Table
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Table` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/tables",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Table#createMany
         * @methodOf apiServices.Table
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Table` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/tables",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Table#upsert
         * @methodOf apiServices.Table
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Table` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/tables",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Table#exists
         * @methodOf apiServices.Table
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` -
         */
        "exists": {
          url: urlBase + "/tables/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Table#findById
         * @methodOf apiServices.Table
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Table` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/tables/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Table#find
         * @methodOf apiServices.Table
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Table` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/tables",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Table#findOne
         * @methodOf apiServices.Table
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Table` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/tables/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Table#updateAll
         * @methodOf apiServices.Table
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/tables/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Table#deleteById
         * @methodOf apiServices.Table
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Table` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/tables/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.Table#count
         * @methodOf apiServices.Table
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` -
         */
        "count": {
          url: urlBase + "/tables/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Table#prototype$updateAttributes
         * @methodOf apiServices.Table
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Table` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/tables/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name apiServices.Table#createChangeStream
         * @methodOf apiServices.Table
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` -
         */
        "createChangeStream": {
          url: urlBase + "/tables/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name apiServices.Table#updateOrCreate
         * @methodOf apiServices.Table
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Table` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name apiServices.Table#update
         * @methodOf apiServices.Table
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name apiServices.Table#destroyById
         * @methodOf apiServices.Table
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Table` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name apiServices.Table#removeById
         * @methodOf apiServices.Table
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Table` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name apiServices.Table#modelName
    * @propertyOf apiServices.Table
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Table`.
    */
    R.modelName = "Table";


    return R;
  }]);

/**
 * @ngdoc object
 * @name apiServices.Container
 * @header apiServices.Container
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Container` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Container",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/containers/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name apiServices.Container#getContainers
         * @methodOf apiServices.Container
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Container` object.)
         * </em>
         */
        "getContainers": {
          isArray: true,
          url: urlBase + "/containers",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Container#createContainer
         * @methodOf apiServices.Container
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Container` object.)
         * </em>
         */
        "createContainer": {
          url: urlBase + "/containers",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Container#destroyContainer
         * @methodOf apiServices.Container
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `container` – `{string=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `` – `{undefined=}` -
         */
        "destroyContainer": {
          url: urlBase + "/containers/:container",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.Container#getContainer
         * @methodOf apiServices.Container
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `container` – `{string=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Container` object.)
         * </em>
         */
        "getContainer": {
          url: urlBase + "/containers/:container",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Container#getFiles
         * @methodOf apiServices.Container
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `container` – `{string=}` -
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Container` object.)
         * </em>
         */
        "getFiles": {
          isArray: true,
          url: urlBase + "/containers/:container/files",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Container#getFile
         * @methodOf apiServices.Container
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `container` – `{string=}` -
         *
         *  - `file` – `{string=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Container` object.)
         * </em>
         */
        "getFile": {
          url: urlBase + "/containers/:container/files/:file",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name apiServices.Container#removeFile
         * @methodOf apiServices.Container
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `container` – `{string=}` -
         *
         *  - `file` – `{string=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `` – `{undefined=}` -
         */
        "removeFile": {
          url: urlBase + "/containers/:container/files/:file",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name apiServices.Container#upload
         * @methodOf apiServices.Container
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `req` – `{object=}` -
         *
         *  - `res` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `result` – `{object=}` -
         */
        "upload": {
          url: urlBase + "/containers/:container/upload",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name apiServices.Container#download
         * @methodOf apiServices.Container
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `container` – `{string=}` -
         *
         *  - `file` – `{string=}` -
         *
         *  - `req` – `{object=}` -
         *
         *  - `res` – `{object=}` -
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "download": {
          url: urlBase + "/containers/:container/download/:file",
          method: "GET"
        },
      }
    );




    /**
    * @ngdoc property
    * @name apiServices.Container#modelName
    * @propertyOf apiServices.Container
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Container`.
    */
    R.modelName = "Container";


    return R;
  }]);


module
  .factory('LoopBackAuth', function() {
    var props = ['accessTokenId', 'currentUserId', 'rememberMe'];
    var propsPrefix = '$LoopBack$';

    function LoopBackAuth() {
      var self = this;
      props.forEach(function(name) {
        self[name] = load(name);
      });
      this.currentUserData = null;
    }

    LoopBackAuth.prototype.save = function() {
      var self = this;
      var storage = this.rememberMe ? localStorage : sessionStorage;
      props.forEach(function(name) {
        save(storage, name, self[name]);
      });
    };

    LoopBackAuth.prototype.setUser = function(accessTokenId, userId, userData) {
      this.accessTokenId = accessTokenId;
      this.currentUserId = userId;
      this.currentUserData = userData;
    }

    LoopBackAuth.prototype.clearUser = function() {
      this.accessTokenId = null;
      this.currentUserId = null;
      this.currentUserData = null;
    }

    LoopBackAuth.prototype.clearStorage = function() {
      props.forEach(function(name) {
        save(sessionStorage, name, null);
        save(localStorage, name, null);
      });
    };

    return new LoopBackAuth();

    // Note: LocalStorage converts the value to string
    // We are using empty string as a marker for null/undefined values.
    function save(storage, name, value) {
      try {
        var key = propsPrefix + name;
        if (value == null) value = '';
        storage[key] = value;
      } catch(err) {
        console.log('Cannot access local/session storage:', err);
      }
    }

    function load(name) {
      var key = propsPrefix + name;
      return localStorage[key] || sessionStorage[key] || null;
    }
  })
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('LoopBackAuthRequestInterceptor');
  }])
  .factory('LoopBackAuthRequestInterceptor', [ '$q', 'LoopBackAuth',
    function($q, LoopBackAuth) {
      return {
        'request': function(config) {

          // filter out external requests
          var host = getHost(config.url);
          if (host && host !== urlBaseHost) {
            return config;
          }

          if (LoopBackAuth.accessTokenId) {
            config.headers[authHeader] = LoopBackAuth.accessTokenId;
          } else if (config.__isGetCurrentUser__) {
            // Return a stub 401 error for User.getCurrent() when
            // there is no user logged in
            var res = {
              body: { error: { status: 401 } },
              status: 401,
              config: config,
              headers: function() { return undefined; }
            };
            return $q.reject(res);
          }
          return config || $q.when(config);
        }
      }
    }])

  /**
   * @ngdoc object
   * @name apiServices.LoopBackResourceProvider
   * @header apiServices.LoopBackResourceProvider
   * @description
   * Use `LoopBackResourceProvider` to change the global configuration
   * settings used by all models. Note that the provider is available
   * to Configuration Blocks only, see
   * {@link https://docs.angularjs.org/guide/module#module-loading-dependencies Module Loading & Dependencies}
   * for more details.
   *
   * ## Example
   *
   * ```js
   * angular.module('app')
   *  .config(function(LoopBackResourceProvider) {
   *     LoopBackResourceProvider.setAuthHeader('X-Access-Token');
   *  });
   * ```
   */
  .provider('LoopBackResource', function LoopBackResourceProvider() {
    /**
     * @ngdoc method
     * @name apiServices.LoopBackResourceProvider#setAuthHeader
     * @methodOf apiServices.LoopBackResourceProvider
     * @param {string} header The header name to use, e.g. `X-Access-Token`
     * @description
     * Configure the REST transport to use a different header for sending
     * the authentication token. It is sent in the `Authorization` header
     * by default.
     */
    this.setAuthHeader = function(header) {
      authHeader = header;
    };

    /**
     * @ngdoc method
     * @name apiServices.LoopBackResourceProvider#setUrlBase
     * @methodOf apiServices.LoopBackResourceProvider
     * @param {string} url The URL to use, e.g. `/api` or `//example.com/api`.
     * @description
     * Change the URL of the REST API server. By default, the URL provided
     * to the code generator (`lb-ng` or `grunt-loopback-sdk-angular`) is used.
     */
    this.setUrlBase = function(url) {
      urlBase = url;
      urlBaseHost = getHost(urlBase) || location.host;
    };

    /**
     * @ngdoc method
     * @name apiServices.LoopBackResourceProvider#getUrlBase
     * @methodOf apiServices.LoopBackResourceProvider
     * @description
     * Get the URL of the REST API server. The URL provided
     * to the code generator (`lb-ng` or `grunt-loopback-sdk-angular`) is used.
     */
    this.getUrlBase = function() {
      return urlBase;
    };

    this.$get = ['$resource', function($resource) {
      return function(url, params, actions) {
        var resource = $resource(url, params, actions);

        // Angular always calls POST on $save()
        // This hack is based on
        // http://kirkbushell.me/angular-js-using-ng-resource-in-a-more-restful-manner/
        resource.prototype.$save = function(success, error) {
          // Fortunately, LoopBack provides a convenient `upsert` method
          // that exactly fits our needs.
          var result = resource.upsert.call(this, {}, this, success, error);
          return result.$promise || result;
        };
        return resource;
      };
    }];
  });

})(window, window.angular);
