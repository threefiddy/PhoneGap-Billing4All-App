$.event.special.tap.emitTapOnTaphold = false;
var customerId = null;
customerId = JSON.parse(sessionStorage.getItem('user')).CustomerId;
var plan_pos = "plan_pos";
var status_yellow="yellow",status_green="green",status_darkgreen="darkgreen",status_red="red";
var status_list={
	0:status_yellow,
	1:status_yellow,
	2:status_yellow
};

var userId = JSON.parse(sessionStorage.getItem('user')).Id;
var userPlanIds = [];
var userPlanIds2 = [];
var all_plans=[];
$.getJSON("http://mobil.billing4all.com/JSon/UserPlanByUserId?id="+userId+"", function(result){
    var json = JSON.stringify(result, null, 2);
    var planIdList=[];
    for (var i = 0; i < result.Data.length; i++) {
    	userPlanIds.push(result.Data[i].Userplanid);
    	planIdList.push(result.Data[i].Planid);
    };
    setTimeout(function(){ 
		$.getJSON("http://mobil.billing4all.com/JSon/PlansAndCustomerByUserId?id="+userId+"", function(result2){
			// console.log(result2);
			var json2 = JSON.stringify(result2, null, 2);
			for(var j = 0; j < result2.Data.length; j++){
				// console.log(planIdList.indexOf(result2.Data[j].plan.Planid));
				// console.log((new Date(parseInt(result.Data[planIdList.indexOf(result2.Data[j].plan.Planid)].Nextpaymentdate.replace("/Date(","").replace(")/",""))).toString().substring(4,15)));
				all_plans.push({text:"<li id='plan"+j+"'><span style='position:relative;top:-10px;' class='status "+status_list[result2.Data[j].plan.Status]+" "+(result.Data[planIdList.indexOf(result2.Data[j].plan.Planid)].Allowautopayment?"auto2 glyphicon glyphicon-repeat":"")+"'></span><div onclick='getpos(this);' data-transition='slide' data-link='abo_plan_detail.html?planId="+result2.Data[j].plan.Planid+"'><p>"+result2.Data[j].plan.Name+"</p><p style='margin: -5px 0 3px;'>"+result2.Data[j].customer.customerName+"</p><p style='display: inline-block;margin: -5px 0 3px;'>Next: "+(new Date(parseInt(result.Data[planIdList.indexOf(result2.Data[j].plan.Planid)].Nextpaymentdate.replace("/Date(","").replace(")/",""))).toString().substring(4,15))+"</p><p style='float:right;display: inline-block;'></p><p class='hidden'> "+ result2.Data[j].plan.IntervalVisual+"</p></div></li>", name:result2.Data[j].plan.Name});
				$("#loader").css("display","none");
			}
			mySort();
			planlink();
			$("#plans_list").append("<li></li>");	

		});
	}, 250);
});



// var im_holdning = false;
// var tapTimer = 0;

function alph_sort(a,b){
	if (a.name<b.name)
		return -1;
	else if(a.name>b.name)
		return 1;
	else
		return 0;
}

function mySort(){
	all_plans.sort(alph_sort);
	for(var i=0; i < all_plans.length; i++){
		$("#plans_list").append(all_plans[i].text);
	}
}

function planlink(){
	var theUnsubbed = JSON.parse(localStorage.getItem('theUnsubbed')==undefined?"[]":localStorage.getItem('theUnsubbed'));
	for(i=0; i < theUnsubbed.length; i++){
		$('#plans_list div[data-link="'+theUnsubbed[i]+'"]').css('color','#b8b8b8');	
	}
	$("#plans_list li div, #plans_list li .status").on("tap",function(){
		if($("#myFilter").is(":focus")){

		}
		else{
			if($(".get_clicked").length>0)
				$(".get_clicked")[0].remove();
			sessionStorage.setItem('planId',$(this).data("link").substring(28));
			$("body").append("<a data-transition='slide' href='"+$(this).data("link")+"' class='get_clicked'></a>");
			$(".get_clicked").click();
		}
	})
	var pos =sessionStorage.getItem(plan_pos);
	if(pos!=undefined){
		$('.ui-content').scrollTop($("#"+pos).offset().top-70);
		sessionStorage.removeItem(plan_pos);
	}
}
function getpos(element){
	return $(element).parent().attr("id");
}
/*$("#back").click(function(){
	window.history.back()
});*/
