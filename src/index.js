/* eslint-disable */
/**
 * AngularJS module for making requests to the SearchSpring API
 * Includes two endpoints:
 * 1) search.json
 * 2) autocomplete.searchspring.net
 */

(function( window, angular, undefined ) {

	var ngModule = angular.module('SSAPI', []);
	ngModule.config(['$httpProvider', '$sceDelegateProvider', function( $httpProvider, $sceDelegateProvider ) {

		$sceDelegateProvider.resourceUrlWhitelist([
			'self',
			'https://**.searchspring.net/**',
			'https://**.searchspring.io/**',
		]);

		if ( angular.version.major == 1 && angular.version.minor > 2 ) {

			$httpProvider.useApplyAsync( true );

		}

	}]);
	ngModule.factory('SSAPI', ['$http', function( $http ) {

		var self = this;

		// ---------------------------------------------------------------------------------------------------- //

		self.Search = {

			options: {
				method: 'GET',
				url: '',
				params: {
					siteId: undefined,
					resultsFormat: 'native'
				},
				headers: {
					'Content-Type': 'application/json'
				},
				cache: true
			},

			go: function( params ) {

				var options = angular.copy( self.Search.options );
				options.params = angular.extend( options.params, params );

				return $http( options ).then(
					function( response ) {
						if ( response && response.data ) {
							return response.data;
						}
					},
					function( httpError ) {
						throw httpError.status + ' : ' + httpError.data;
					}
				);

			}

		};

		self.Autocomplete = {

			options: {
				method: 'jsonp',
				url: '',
				params: {
					siteId: undefined,
					query: ''
				},
				headers: {
					'Content-Type': 'application/json'
				}
			},

			go: function( params ) {

				var options = angular.copy( self.Autocomplete.options );
				options.params = angular.extend( options.params, params );

				return $http( options ).then(
					function( response ) {
						if ( response && response.data ) {
							return response.data;
						}
					},
					function( httpError ) {
						throw httpError.status + ' : ' + httpError.data;
					}
				);

			}

		};

		self.init = function( siteId, userId ) {

			self.Search.options.params.siteId = siteId;
			self.Search.options.params.userId = userId;
			self.Search.options.url = `https://${siteId}.a.searchspring.io/api/search/search.json`;

			self.Autocomplete.options.params.siteId = siteId;
			self.Autocomplete.options.params.userId = userId;
			self.Autocomplete.options.url = `https://${siteId}.a.searchspring.io/api/suggest/legacy`;

			if ( angular.version.major >= 1 && angular.version.minor >= 6 ) {

				self.Autocomplete.options.jsonpCallbackParam = 'callback';

			}
			else {

				self.Autocomplete.options.params.callback = 'JSON_CALLBACK';

			}

		};

		// ---------------------------------------------------------------------------------------------------- //

		return self;

	}]);

})( window, window.angular );