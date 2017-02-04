angular.module('wechat.controllers', [])
.controller('navCtrl', ['$scope','response','$rootScope','messageSrv','$state','localStorageService','$filter','$ionicPlatform',
	function($scope,response,$rootScope,messageSrv,$state,localStorageService,$filter,$ionicPlatform) {		
		$scope.selectButtonHtml='全选';	
		$scope.ckCountArray=[];
		$scope.ckCount=0;
		$scope.hold = null;			 
		
		//加载JSON
 		(function(response,localStorageService) {						
			var items=response.data.items;		
 			if(!localStorage.items || JSON.parse(localStorage.items).length == 0){
				localStorageService.init(items);
			}; 				
		}(response,localStorageService));	 
		
		//刷新
		$scope.$on('refreshck',function(){
			$scope.ckCount=0;		
			$rootScope.items.forEach(function(item){
				if(item.beSelect){$scope.ckCount+=1};
			});	
			var selectItems=$rootScope.items.filter(function(item){
				if(item.beSelect){return true};
			});				
			$scope.selectTop = selectItems.every(function(item){return item.beTop});	
			$scope.hasSelect = $rootScope.items.some(function(item){return item.beSelect});
		});		
		
		//设置信息
		$scope.onhold = function(){
			if($scope.hold){
				return;
			};
			back_hold = $ionicPlatform.registerBackButtonAction(function(e){					
				$scope.cancelClick();
				$scope.$apply();
			},101);
			$scope.hold = true;	
			$scope.$broadcast('cancelAll');
			$scope.selectButtonHtml='全选';	
			$scope.$emit('refreshck');	
			//console.log($rootScope.items);   
			
		};		
		//新建
		$scope.newMessage = function(){			
			$state.go('detail',{index:$rootScope.items.length});			
		};
		//取消设置
		$scope.cancelClick = function(){
			$scope.hold = false;			
			messageSrv.get($rootScope);	
			back_hold();
		};		
		//全选/全不选
		$scope.selectToggle = function(){
			if($scope.selectButtonHtml=='全选'){
				$scope.$broadcast('selectAll');			
				$scope.selectButtonHtml='全不选';	
				$scope.$emit('refreshck');			
			}else{
				$scope.$broadcast('cancelAll');
				$scope.selectButtonHtml='全选';	
				$scope.$emit('refreshck');			
			};				
		};
		//删除
		$scope.remove = function(){							
			messageSrv.remove($rootScope);				
			//localStorageService.update($rootScope.items);
			$scope.$emit('refreshck');
		};
		
		//置顶
		$scope.beTop = function(bool){	
			console.log($rootScope.items);
			var itemsFilter;
			if(!bool){					
				itemsFilter=$rootScope.items.filter(function(item){	
 					if(!item.beTop){
						item.beTop=item.beSelect?true:false;
					};	 				
					return item.beSelect?true:false;														
				});
			}else{				
				itemsFilter=$rootScope.items.filter(function(item){					
					return item.beTop?true:false;														
				});						
			}
			
			for(var i=0;i<$rootScope.items.length;i++){
				for(var j=0;j<itemsFilter.length;j++){
					if($rootScope.items[i].time==itemsFilter[j].time){
						$rootScope.items.splice(i,1);
					}
				}
			}			
			for(var j=itemsFilter.length-1;j>=0;j--){
				$rootScope.items.unshift(itemsFilter[j]);
			}				
			$scope.$emit('refreshck');	
			
		};
		//保存
		$scope.save = function(){
			localStorageService.update($rootScope.items);	
			$scope.hold = false;			
			messageSrv.get($rootScope);	
		};
		//取消置顶
		$scope.cancelTop = function(){	
			console.log($rootScope.items);
			$rootScope.items.forEach(function(item,i){				
				if(item.beSelect){
					item.beTop = false;
				}				
			})
			$rootScope.items.sort(function(a,b){
				return (new Date(a.time))>(new Date(b.time))?-1:1;
			}); 
			$scope.beTop(true);
		};	
		//路由前回调
		$scope.$on("$ionicView.beforeEnter", function(){
			messageSrv.get($rootScope);	
			//$scope.hasSelect = $rootScope.items.some(function(item){return item.beSelect});
			//console.log($rootScope.items);
		});		
    }
])
.controller('detailCtrl',function($rootScope,$scope,$stateParams,$state,localStorageService,$ionicPopup,$ionicPopover){
	console.log('detail');

	var ogTxt=$rootScope.items[$stateParams.index]||{txt:''};	
	$scope.item = angular.copy(ogTxt);	
	$scope.now = (new Date).toLocaleString();

	
	
	$scope.goBack = function() {			
		if(!ogTxt.time){
			if($scope.item.txt && $scope.item.txt!=ogTxt.txt){	
				$scope.item.localTime = (new Date).toLocaleString();
				$scope.item.time = (new Date).toString(); 
				$rootScope.items.unshift($scope.item);
				localStorageService.update($rootScope.items);
			}
		}else{
			if(!angular.equals($scope.item, ogTxt)){
				$scope.item.localTime = (new Date).toLocaleString();
				$scope.item.time = (new Date).toString(); 
				$rootScope.items[$stateParams.index] = $scope.item;
				localStorageService.init($rootScope.items);
			}
		};			
		 		
		$state.go('nav');    
    };
    $scope.confirmDel= function() {
		var confirmPopup = $ionicPopup.confirm({
		title: '<h4>删除便签</h4>',
		template: '<p class="dark" style="margin:20px">你确定要删除便签吗？<p>'
        });
        confirmPopup.then(function(res) {
			if(res) {
				$rootScope.items.splice($stateParams.index,1);
				localStorageService.update($rootScope.items);	
				$state.go('nav');    
				console.log('You are sure');
			} else {
				console.log('You are not sure');
			}
		});
	};

	$scope.toggleUpPane = function(){
		$scope.showPane=!$scope.showPane
	}

	$scope.changeClass = function(c){		
		$scope.item.class=c;		
		$scope.showPane = false;
		//localStorageService.update($rootScope.items);	
	}
	$scope.changebClass = function(c){		
		$scope.item.bClass=c;
		$scope.popover.hide();		
		//localStorageService.update($rootScope.items);	
	}
	$scope.$on("$ionicView.beforeEnter", function(){
		$scope.showPane = false;
		$scope.detailClass=$rootScope.items[$stateParams.index].class;
		$scope.bClass=$rootScope.items[$stateParams.index].bClass;
		// console.log('1111111',$rootScope.items[$stateParams.index].bclass,$rootScope.items);
	});	
	//浮动框
	// .fromTemplateUrl() 方法
	$ionicPopover.fromTemplateUrl('templates/my-popover.tml.html', {
	scope: $scope
	}).then(function(popover) {
		$scope.popover = popover;
		console.log('ready');
	});


	$scope.openPopover = function($event) {
		$scope.popover.show($event);
	};
	$scope.closePopover = function() {
		$scope.popover.hide();
	};
	// 清除浮动框
	$scope.$on('$destroy', function() {
		$scope.popover.remove();
	});
	// 在隐藏浮动框后执行
	$scope.$on('popover.hidden', function() {
	// 执行代码
	});
	// 移除浮动框后执行
	$scope.$on('popover.removed', function() {
	// 执行代码
	});
})
	