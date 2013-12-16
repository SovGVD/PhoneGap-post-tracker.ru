var url_parser={
		get_args: function (s) {
			var tmp=new Array();
			s=(s.toString()).split('&');
			for (var i in s) {
				i=s[i].split("=");
				tmp[(i[0])]=i[1];
			}
			return tmp;
		},
		get_args_cookie: function (s) {
			var tmp=new Array();
			s=(s.toString()).split('; ');
			for (var i in s) {
				i=s[i].split("=");
				tmp[(i[0])]=i[1];
			}
			return tmp;		
		}
};