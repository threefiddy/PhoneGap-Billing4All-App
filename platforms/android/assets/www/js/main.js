// var pages=["company","subscribers","subscribtions","transactions"]
// 	var page="company";
var screen_width,screen_height,animating=false;	
function resizemain(){
	
	screen_width = window.innerWidth;
	screen_height = window.innerHeight;

	$(".itembox").each(function(){
		if((screen_height-51)/3<$(this).width()){
			$(this).css({"margin-right":((screen_width/3-$(this).width())/2-2),"margin-left":((screen_width/3-$(this).width())/2-2),"height":$(this).width(), "margin-top":(screen_height-51-2*$(this).width())/3})
			var element_height=$(this).height();
			$(this).children("span").css("margin-top",(element_height-50-20)/2-5);
		}
		else{
			$(this).css({"margin-right":((screen_width/2-$(this).width())/2-2),"margin-left":((screen_width/2-$(this).width())/2-2),"height":$(this).width(), "margin-top":(screen_height-51-3*$(this).width())/4})
			var element_height=$(this).height();
			$(this).children("span").css("margin-top",(element_height-50-20)/2-5);
		}
	});
	$(".pages").each(function(){

			$(this).css({"min-height":(screen_height-19)+"px !important","left":"0px","z-index":0})

	});
	// $(".ui-content").css("height",(screen_height-71-20)+"px !important");
	//StatusBar.overlaysWebView(false);
}
setTimeout(function(){ resizemain(); }, 10);
	
$(window).on("resize",function(){resizemain();})
