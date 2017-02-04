angular.module('wechat.service', [])
.factory('messageSrv',['$http','localStorageService',	function($http,localStorageService){
		return {	
			get:function(scope){
				scope.items=localStorageService.get('items');					
			},
			remove:function(scope){				
				scope.items=scope.items.filter(function(item){return item.beSelect!==true}); 								
			}
		}
	}]
)
.factory('localStorageService',function(){
	return{
		init:function(items){			
			var date;				
 			items.sort(function(a,b){
				return (new Date(a.time))>(new Date(b.time))?-1:1;
			}); 
			for(var i=0;i<items.length;i++){				
				date=new Date(items[i].time);				
				date=date.toLocaleString();				
				items[i].localTime=date;
			}			
			localStorage.setItem('items',JSON.stringify(items));
			//console.log(this.get('items').length);			
		},
		update:function(items){
			localStorage.setItem('items',JSON.stringify(items));
		},
 		sort:function(scope){
			scope.$parent.items=sort(scope.$parent.items);
			//console.log(scope.items);
 			scope.items.sort(function(a,b){
				if(a.beTop && !b.beTop){
					return -1;
				}else if(a.beTop && b.beTop){
					return 0;					
				}else if(!a.beTop && b.beTop){
					return 1;
				}
			});
			
			localStorage.setItem('items',JSON.stringify(scope.items)); 
		}, 				
 		get:function(key){
			//console.log('111',JSON.parse(localStorage.getItem(key)));
			return JSON.parse(localStorage.getItem(key));
		}, 
		setItems:function(id,value){
			var items=this.get('items');
				items[id]=value;
				this.init(items);
		},
 		unshift:function(key,value){
			var items=this.get(key);
			items.unshift(value);
			this.init(items);		
		},
 		clear:function(){
			localStorage.clear();
		},
		isEmpty:function(items){
			return localStorage[items].length == 0?true:false;
		}
	}
})