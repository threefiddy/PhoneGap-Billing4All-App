$.event.special.tap.emitTapOnTaphold = false;
var is_swiping=false;
var trans_pos="'transaction'";
var plan_pos ="'plan'";
var iScrollPos = 0;

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    // StatusBar.hide();
    StatusBar.styleLightContent();
    /*console.log(StatusBar);*/
}
function to_the_right(){

    $( ".pages*" ).on( "swiperight", function( event ) { 

         // $(".pages").css({
         //        "animation-name": "movetoleft"
         //    });
         // setTimeout(function() {}, 1500);
      	 /*  window.history.back();*/
         /*location="index.html";*/
        if(location.href.indexOf("index")+location.href.indexOf("login")>-1||location.href==""){
            navigator.app.exitApp()
        }
        else if($(this).children(".ui-header").children(".back")[0]!=undefined){
            if (location.pathname.indexOf('abo_transactions') > -1)
                clearStorage();
            $("div.ui-header.ui-bar-a[data-role='header']").css({"height": "71px"});
            $(".ui-content").css({"top":"50px","height":screen.height-71});
            $(this).children(".ui-header").children(".back").click();
        }
        else{
            // window.history.back();
/*            navigator.app.backHistory();
            History.go(-1);*/
        }
	   	 
    } )
}

$(document).on('pageinit',function(){
    $(".ui-content").scroll(function(e){
        var iCurScrollPos = $(this).scrollTop();
        if (iCurScrollPos > iScrollPos) {
            //Scrolling Down
            $(".ui-input-search").css({"position":"relative",top:-9,width:"100%"})
        } else {
            $(".ui-input-search").css({"position":"fixed",top:19,width:"100%"})
           //Scrolling Up
           if(iCurScrollPos==0)
            $(".ui-input-search").css({"position":"relative",top:-9,width:"100%"})
           
        }

        iScrollPos = iCurScrollPos;
        var collected_height=-41;
        $(".ui-page-active .ui-content").children().each(function(){
            if(!$(this).hasClass("ui-filterable")&&($(this).attr("style")==undefined||$(this).attr("style").indexOf("display: none")==-1)){
                collected_height+=$(this).height();
                // console.log(collected_height+"="+$(this).height());
                // console.log($(this));
            }
        });
        // console.log(iCurScrollPos+" t "+$(".ui-page-active .ui-content").outerHeight()<=collected_height);
        if(iCurScrollPos!=0&&$(".ui-page-active .ui-content").outerHeight()<=collected_height){
            $("div.ui-header.ui-bar-a[data-role='header']").css({"height": "0px"});
            $(".ui-content").css({"top":"29px","height":screen.height-30});
        }
        else{
            $("div.ui-header.ui-bar-a[data-role='header']").css({"height": "71px"});
            $(".ui-content").css({"top":"50px","height":screen.height-51});

            // $(".back").css("padding-top","41px");

        }
        

    });
    to_the_right();
});
setTimeout(function(){ to_the_right(); }, 100);
$(window).on("resize",function(){
    screen_width = window.innerWidth;
    screen_height = window.innerHeight;

    $(".ui-content").css("max-height",(screen_height-71)+"px !important");

})


function onDeviceReady(){
    document.addEventListener("backbutton", onBackKeyDown, false);
}
function onBackKeyDown(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    console.log("back");
    if($(".pages").children(".ui-header").children(".back")[0]!=undefined)
        $(".pages").children(".ui-header").children(".back").click();
    // angular.element('[ng-controller=NavCtrl]').scope().back();
}
$(document).on('pageinit', function(an_event){
    $(".ui-content").css({"top":"50px","height":screen.height-51});
    /*console.log(an_event)*/
    var pathname = an_event.target.baseURI;
    // pathname= pathname[pathname.length-1];
    var location_list;
    // console.log("path: "+pathname);
    if (pathname.indexOf('index')>-1 || pathname == "/")
        location_list = [];
    else
        location_list = JSON.parse(sessionStorage.getItem('location'))!=null?JSON.parse(sessionStorage.getItem('location')):[];
    console.log(location_list.indexOf(pathname));
    while(location_list.indexOf(pathname)>-1)
        location_list.pop();
    
    if($('.pages').children(".ui-header").children(".back")[0]!=undefined && location_list.length > 0){
        $('.pages').children(".ui-header").children(".back").attr('href',(location_list[location_list.length-1]==an_event.target.baseURI?location_list[location_list.length-2]:location_list[location_list.length-1]));
        
        if (pathname.indexOf('abo_transactions') > -1){
            $('.pages').children(".ui-header").children(".back").attr('onclick','clearStorage('+trans_pos+');go_back();');
        }   
        else if (pathname.indexOf('abo_plans') > -1){
            $('.pages').children(".ui-header").children(".back").attr('onclick','clearStorage('+plan_pos+');go_back();');
        }
        else if (pathname.indexOf('abo_reports') > -1){
            $('.pages').children(".ui-header").children(".back").attr('onclick','clearStorage();go_back();');
        }
        else if (pathname.indexOf('abo_help') > -1){
            $('.pages').children(".ui-header").children(".back").attr('onclick','clearStorage();go_back();');
        }
    }
    location_list.push(pathname);
    // console.log(location_list)
    sessionStorage.setItem('location', JSON.stringify(location_list));
});

function clearStorage(_for){
    if(_for==plan_pos){
        sessionStorage.removeItem('planId');
        sessionStorage.removeItem('plan_pos');
        sessionStorage.removeItem('invoiceId');
    }
    if(_for==trans_pos){
        sessionStorage.removeItem('isPending');
        sessionStorage.removeItem('trnas_pos');
        sessionStorage.removeItem('invoiceId');
    }
}

function go_back(){
    var location_list = JSON.parse(sessionStorage.getItem('location'));
    location_list.pop();
    sessionStorage.setItem('location', JSON.stringify(location_list));
}
    
var gamma,beta,old_orientation=0;
var buttons=".itembox,#payNowButton,#paylikeButton,#autopay";
$(document).on('pageinit',function(){
    $("#loader_icon").css({"top":screen.height/2-160/2,"left":screen.width/2-160/2})
    window.ondeviceorientation = function(event) {
        $("#loader_icon").css({"top":screen.height/2-160/2,"left":screen.width/2-160/2})
        gamma = Math.round(event.gamma/10);    
        beta = Math.round(event.beta/10);

        switch(window.orientation){ //portrait
            case 0:
                $(buttons).css("box-shadow",(gamma) +"px "+Math.abs(beta)+"px 5px #888888");
                break;
            case 180:
                $(buttons).css("box-shadow",-(gamma) +"px "+Math.abs(beta)+"px 5px #888888");
                break;
            case -90:
                $(buttons).css("box-shadow",-(beta) +"px "+Math.abs(gamma)+"px 5px #888888");
                break;
            case 90:
                $(buttons).css("box-shadow",(beta) +"px "+Math.abs(gamma)+"px 5px #888888");
                break;
        }

    }
});