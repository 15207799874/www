angular.module('wechat.directives', [])
.directive('ckClick',function(){
	return{
		scope: false,
		restrict: 'A',
		replace: false,
		link:function(scope, iElm, iAttrs, controller){	
			scope.$on('selectAll',function(){					
				iElm[0].checked=true;                				
				scope.$parent.items[scope.$index].beSelect=iElm[0].checked?true:false;
				console.log(iElm[0].checked);
			});	
			scope.$on('cancelAll',function(){	
				iElm[0].checked=false; 				
				scope.$parent.items[scope.$index].beSelect=iElm[0].checked?true:false;	
				console.log(iElm[0].checked);
			});
  			iElm.on('click',function(e){					
				e.stopPropagation();				
				scope.$parent.items[scope.$index].beSelect=iElm[0].checked?true:false;					
				scope.$emit('refreshck'); 
				scope.$parent.$apply();
			});  
		}
	}
})
.directive('liClick',function(){
	return{
		scope: false,
		restrict: 'A',
		replace: false,
		link:function(scope, iElm, iAttrs, controller){	
			iElm.on('click',function(){
				if(!scope.$parent.hold){
					scope.goDetail();
				}				
			});				
		},
		controller:function($scope, $state) {
			$scope.goDetail = function(){
				$state.go('detail',{index:$scope.$index});
			}
		}
	}
}) 
.directive('myWidth',function(){
	return{
		scope: false,
		restrict: 'A',
		replace: false,
		link:function(scope, iElm, iAttrs, controller){	
			iElm.css('height',window.innerHeight-88+'px');
			//console.log(window.innerHeight-88,iElm.css('height'),iElm.css('width'));
		}
	}
})
.directive('upDownPane',function(){
		return{
		scope: false,
		restrict: 'A',
		replace: true,
		templateUrl:'templates/upDownPane.tml.html',
/*		compile: function(tEle, tAttrs, transcludeFn) {			
			tEle.after('<div tran-Sparent></div>');
		},*/
/*		link:function(scope, iElm, iAttrs, controller){	
			iElm.after('<div tran-Sparent></div>');
			//console.log(window.innerHeight-88,iElm.css('height'),iElm.css('width'));
		}*/
	}
})
.directive('tranSparent',function(){
		return{
		scope: false,
		restrict: 'A',
		replace: true,
		templateUrl:'templates/tranSparent.tml.html'
/*		link:function(scope, iElm, iAttrs, controller){	
			iElm.css('height',window.innerHeight-88+'px');
			//console.log(window.innerHeight-88,iElm.css('height'),iElm.css('width'));
		}*/
	}
})
.directive('bottomPane',function(){
		return{
		scope: false,
		restrict: 'A',
		replace: true,
		templateUrl:'templates/tranSparent.tml.html'
/*		link:function(scope, iElm, iAttrs, controller){	
			iElm.css('height',window.innerHeight-88+'px');
			//console.log(window.innerHeight-88,iElm.css('height'),iElm.css('width'));
		}*/
	}
})
