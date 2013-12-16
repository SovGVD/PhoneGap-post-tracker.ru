
	var sapp=false;
	var smenu=false;
	var sheader=false;
	var smain=false;
	var appURL="";
	
	function init() {
		sapp=document.getElementById("sapp");
		smain=document.getElementById("smain");
		sheader=document.getElementById("sheader");
		smenu=document.getElementById("smenu");
		document.addEventListener("menubutton", menuButtonShow, false);
		rebuild_interface();
		plugin_www_post_tracker_ru.auth(false);
	}
	
	function menuButtonShow(){
		if (smenu.style.display=="none") {
			smenu.style.display="block";
		} else {
			smenu.style.display="none";
		}
	}
	function menuButtonHide(){
		smenu.style.display="none";
	}
	
	function rebuild_interface() {
		screen_H=window.innerHeight;
		screen_W=window.innerWidth;
			sheader.innerHTML="post-tracker.ru phoneGap demo";
			sapp.style.width=screen_W;
			
			sheader.style.height="50px";
			
			smain.style.height=screen_H-50+"px";
			smain.style.width=screen_W+"px";
			
			smenu.style.top=screen_H-100+"px";
			smenu.style.height="100px";
			smenu.style.width=screen_W+"px";
			
	}
	
	function show_list() {
		var html="";
		var items=plugin_www_post_tracker_ru.get_list();
		for(var i in items){
			html+="<div class='posttrackerdemo_item'>"+items[i]+"</div>";
		}
		smain.innerHTML=html;
	}
	