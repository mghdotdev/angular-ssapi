/**
 * AngularJS module for making requests to the SearchSpring API
 * Includes two endpoints:
 * 1) search.json
 * 2) autocomplete.searchspring.net
 */

(function( window, angular, undefined ) {

	var ngModule = angular.module('SSAPI', []);
	ngModule.config(function( $httpProvider, $sceDelegateProvider ) {

		$sceDelegateProvider.resourceUrlWhitelist([
			'self',
			'https://**.searchspring.net/**',
		]);

		$httpProvider.useApplyAsync( true );

	});
	ngModule.factory('SSAPI', ['$http', function( $http ) {

		var self = this;

		// ---------------------------------------------------------------------------------------------------- //

		self.Search = {

			options: {
				method: 'GET',
				url: 'https://api.searchspring.net/api/search/search.json',
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
				url: 'https://autocomplete2.searchspring.net',
				params: {
					pubId: undefined,
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

			self.Autocomplete.options.params.pubId = siteId;
			self.Autocomplete.options.params.userId = userId;

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