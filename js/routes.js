angular.module('wechat.routes', [])

.config(function($stateProvider,$urlRouterProvider) {
	//$logProvider.debugEnabled(true);

    $stateProvider
        .state("nav", {
            url: "/nav",
            //abstract: true,
            templateUrl: "templates/nav.tml.html",			
 			resolve: {
				response: function($http,messageSrv,localStorageService) {
					return	$http.get("data/json/item.json");
				}
			},			
			controller: "navCtrl",
        })
		.state("detail",{
			url: '/detail/:index',
			templateUrl: "templates/detail.tml.html",
			controller: "detailCtrl"
		})
    $urlRouterProvider.otherwise("nav");
})
