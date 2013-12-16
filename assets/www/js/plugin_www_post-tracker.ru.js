var plugin_www_post_tracker_ru = {
		wwwref: false,
		postdata: new Array(),
		dataReady: false,
		authOk: false,
		default_folder: null,
		default_path: "cn|ru",
		auth: function (force) {
			if (!window.localStorage.getItem("plugin_www_post_tracker_ru_PHPSESSID") || force) {
				var authURL="http://post-tracker.ru/login.php";
				this.wwwref = window.open(encodeURI(authURL), '_blank', 'location=no');
				this.wwwref.addEventListener('loadstop', this.auth_jsinjection);
			} else {
				plugin_www_post_tracker_ru.authOk=true;
				plugin_www_post_tracker_ru.get_content(true);
			}
		},
		
		auth_event_url: function (url) {
			var tmp=url_parser.get_args_cookie(url);
			if (tmp['PHPSESSID'] && tmp['userid'] && tmp['securehash']) {
				plugin_www_post_tracker_ru.wwwref.close();
				window.localStorage.setItem("plugin_www_post_tracker_ru_PHPSESSID", tmp['PHPSESSID']);
				window.localStorage.setItem("plugin_www_post_tracker_ru_userid", tmp['userid']);
				window.localStorage.setItem("plugin_www_post_tracker_ru_securehash", tmp['securehash']);
				plugin_www_post_tracker_ru.authOk=true;
				plugin_www_post_tracker_ru.get_content(true);
			}
		},
		
		auth_cssinjection: function(){
			plugin_www_post_tracker_ru.wwwref.insertCSS({code:".topline {display:none} .top {display:none} .logo {display:none} .menu {display:none} .counters {display:none} .bottom {display:none} .links {display:none} @-viewport {width: device-width; zoom: 1;"},function(){});
		},
		
		auth_jsinjection: function () {
			plugin_www_post_tracker_ru.auth_cssinjection();
			plugin_www_post_tracker_ru.wwwref.executeScript({
	            code: "document.cookie;"
	        }, function(arg) {
	        	plugin_www_post_tracker_ru.auth_event_url(arg);
	        });
		},
		
		get_content: function (async) {
			if (plugin_www_post_tracker_ru.authOk){
				var cookies="PHPSESSID="+window.localStorage.getItem("plugin_www_post_tracker_ru_PHPSESSID")+"; userid="+window.localStorage.getItem("plugin_www_post_tracker_ru_userid")+"; securehash="+window.localStorage.getItem("plugin_www_post_tracker_ru_securehash");
				dataReady=false;
				ajax.send("http://post-tracker.ru/my/",'GET',null,cookies,async,this._parse_content);
				//ajax.send("http://sovgvd.info/test.txt",'GET',null,cookies,async,this._parse_content);
			} else {
				return false;
			}
		},
		
		_parse_content: function (data) {
			//console.log(data);
			var wrapper=document.createElement('div');
				wrapper.innerHTML=data;
			plugin_www_post_tracker_ru._get_inside_data(wrapper,'trackcode,date,status,comment');
		},
		
		_get_inside_data: function (wrapper,types) {
			var tmp=wrapper.getElementsByClassName('login')[0].innerHTML;
			if (tmp=='<a href="/login.php">Войдите</a> или <a href="/register.php">Зарегистрируйтесь</a>') {
				plugin_www_post_tracker_ru.auth(true);
			} else {
				plugin_www_post_tracker_ru.default_folder=wrapper.getElementsByTagName('input')[0].value;
				var types=types.split(",");
				for (var typeid in types) {
					var tmp=wrapper.getElementsByClassName(types[typeid]);
					var id=0;
					for (var i in tmp) {
						if (tmp[i].innerHTML) {
							if (!plugin_www_post_tracker_ru.postdata[id]) plugin_www_post_tracker_ru.postdata[id]=new Array();
							plugin_www_post_tracker_ru.postdata[id][(types[typeid])]=tmp[i].innerHTML.replace(/(\r\n|\n|\r)/gm,"").replace(/<\/?[^>]+>/gmi,"").replace(/^\s+|\s+$/gm,"");
							id++;
						}
					}
				}
				dataReady=true;
				show_list();
			}
		},
		
		get_list: function () {
			if (plugin_www_post_tracker_ru.authOk){
				var tmp=new Array();
				for (var i in plugin_www_post_tracker_ru.postdata) {
					tmp[i]="<b>"+plugin_www_post_tracker_ru.postdata[i]['trackcode']+"</b> "+plugin_www_post_tracker_ru.postdata[i]['comment']+"<br/>"+plugin_www_post_tracker_ru.postdata[i]['date']+" "+plugin_www_post_tracker_ru.postdata[i]['status'];
				}
				return tmp;
			} else{
				return false;
			}
		},
		
		
		put_trackCode: function(){
			var trackCode = prompt("Введите трек код");
			if (trackCode) {
				this._put_trackCode_getPath(trackCode);
				if (plugin_www_post_tracker_ru.default_path) {
					var comment = prompt("комментарий");
					if (comment) {
						this._put_trackCode(trackCode,comment);
					}
				} else {
					alert("Не правильный трек код");
				}
			} else {
				menuButtonHide();
			}
		},
		_put_trackCode_getPath: function (trackCode) {
			var cookies="PHPSESSID="+window.localStorage.getItem("plugin_www_post_tracker_ru_PHPSESSID")+"; userid="+window.localStorage.getItem("plugin_www_post_tracker_ru_userid")+"; securehash="+window.localStorage.getItem("plugin_www_post_tracker_ru_securehash");
			var data="act=getPathForm&trackcode="+encodeURIComponent(trackCode);
			ajax.send("http://post-tracker.ru/ajax/userTrackcodes.php",'POST',data,cookies,false,this._put_trackCode_getPath_result);			
		},
		_put_trackCode_getPath_result: function (data){
			var wrapper=document.createElement('div');
			wrapper.innerHTML=data;
			var tmp=wrapper.getElementsByTagName('input');
			if (tmp.length>0) {
				plugin_www_post_tracker_ru.default_path=tmp[0].value;
			}else{
				plugin_www_post_tracker_ru.default_path=false;
			}
		},
		_put_trackCode: function (trackCode,comment){
			var cookies="PHPSESSID="+window.localStorage.getItem("plugin_www_post_tracker_ru_PHPSESSID")+"; userid="+window.localStorage.getItem("plugin_www_post_tracker_ru_userid")+"; securehash="+window.localStorage.getItem("plugin_www_post_tracker_ru_securehash");
			var data="act=addTrackcodeAction&folderid="+plugin_www_post_tracker_ru.default_folder+"&trackcode="+encodeURIComponent(trackCode)+"&path="+plugin_www_post_tracker_ru.default_path+"&comment="+encodeURIComponent(comment);
			ajax.send("http://post-tracker.ru/ajax/userTrackcodes.php",'POST',data,cookies,false,this._put_trackCode_result);
		},
		_put_trackCode_result:function(data){
			//console.log(data);
			//alert(data);
			menuButtonHide();
			plugin_www_post_tracker_ru.get_content(true);
		}
}