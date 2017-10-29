angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    

      .state('tabsController.dashboard', {
    url: '/dashboard',
    views: {
      'tab2': {
        templateUrl: 'templates/dashboard.html',
        controller: 'dashboardCtrl'
      }
    }
  })

  .state('tabsController.addParty', {
    url: '/addparty',
    views: {
      'tab3': {
        templateUrl: 'templates/addParty.html',
        controller: 'addPartyCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/tabsController',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.transaction', {
    url: '/transaction',
    views: {
      'tab4': {
        templateUrl: 'templates/transaction.html',
        controller: 'transactionCtrl'
      }
    }
  })

  .state('items', {
    url: '/items',
    templateUrl: 'templates/items.html',
    controller: 'itemsCtrl'
  })

  .state('taxList', {
    url: '/taxlist',
    templateUrl: 'templates/taxList.html',
    controller: 'taxListCtrl'
  })

  .state('allParties', {
    url: '/allparties',
    templateUrl: 'templates/allParties.html',
    controller: 'allPartiesCtrl'
  })

  .state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html',
    controller: 'settingsCtrl'
  })

  .state('addItem', {
    url: '/additem',
    templateUrl: 'templates/addItem.html',
    controller: 'addItemCtrl'
  })

  .state('profile', {
    url: '/profile',
    templateUrl: 'templates/profile.html',
    controller: 'profileCtrl'
  })

$urlRouterProvider.otherwise('/tabsController/dashboard')


});