var ajax = {
	init: function(){
		return new XMLHttpRequest();
		},
	send: function(url,method,args,cookies,async,_callback){
		var q=ajax.init();
		q.open(method,url,async);
		q.onreadystatechange=function(){
			//console.log(this.readyState+"|"+this.status);
				if(this.readyState==4 && this.status==200) {
					_callback(this.responseText);
				}
			};
		if (cookies) {
			q.setRequestHeader('Cookie',cookies);
		}
		if(method=='POST') {
			q.setRequestHeader('Content-type','application/x-www-form-urlencoded');
			q.send(args);
		} else {
			q.send(null);
		}
	}
}