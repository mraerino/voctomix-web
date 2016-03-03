'use strict';

/**
 * @ngdoc overview
 * @name voctomixWebApp
 * @description
 * # voctomixWebApp
 *
 * Main module of the application.
 */
angular
    .module('voctomixWebApp', [
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngMaterial',
        'noVNC.util'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                controllerAs: 'about'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('light-blue')
            .accentPalette('orange');
    });
