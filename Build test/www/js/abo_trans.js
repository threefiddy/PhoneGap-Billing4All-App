var animating=false,is_in=true,settings_display=false;//is_in is for the side menu	

/*var isPending = location.search.substring(1)=="pending"?true:false;*/
var planId = location.search.substring(1).split("planId=")[1];
var userId = JSON.parse(sessionStorage.getItem('user')).Id;
var customerId = null;
var trans_pos = "trans_pos";
customerId = JSON.parse(sessionStorage.getItem('user')).CustomerId;
var userPlanIds = [];
var months=[
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"Maj",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Okt",
	"Nov",
	"Dec",
]
var status_yellow="yellow",status_green="green",status_darkgreen="darkgreen",status_red="red";
var status_list={
	0:status_yellow,
	1:status_yellow,
	2:status_yellow,
	3:status_yellow,
	4:status_yellow,
	10:status_yellow,
	11:status_yellow,
	15:status_yellow,
	20:status_green,
	25:status_yellow,
	80:status_red,//Error
	90:status_green,//ok
	99:status_red,//Erased
	100:status_darkgreen,//cancelled
	101:status_darkgreen,//Refunded
	102:status_green,//PaidElsewhere
	103:status_red,//to many reminders
	200:status_red
};

/*
Nothing = 0, 
AwaitEmail, 
SendingPaymentEmail, 
Wait, 
SendAutoPaymentAlert, 
AwaitPayment = 10, 
SendPaymentReminder, 
MakeTransaction=15, 
CaptureTrans = 20, 
GetTransInfo =25, 
Error = 80, 
OK = 90, 
Cancelled=100, 
Refunded, 
PaidElsewhere, 
TooManyReminders, 
RequireManualAction=200
*/
var invoiceIdText = "invoiceId";
function make_list(){

	all_transactions=[];
	isPending = sessionStorage.getItem('isPending')!=undefined?true:false;
	planId = sessionStorage.getItem('planId');
	userId = JSON.parse(sessionStorage.getItem('user')).Id;
	/*console.log(JSON.parse(sessionStorage.getItem('user')).CustomerId);*/
	if (planId == undefined)
		$.getJSON("http://mobil.billing4all.com/JSon/UserPlanByUserId?id="+userId+"", function(result){
		    var json = JSON.stringify(result, null, 2);
		    for (var i = 0; i < result.Data.length; i++) {
		    	userPlanIds.push(result.Data[i].Userplanid);
		    };
		    setTimeout(function(){ 
				$.getJSON("http://localhost:59599/JSon/SearchTransactions?userplanIds="+userPlanIds+"&notThisCustomerId="+customerId+"&notTransStatus=90", function(result2){
			    var json2 = result2.Data;
			    console.log(json2);
			    $("#transaction_header").empty().append("Pending")
				for(i=0;i<json2.length;i++){
					var _date = new Date(parseInt(json2[i].Paymenttime.replace("/Date(","").replace(")/","")))
					all_transactions.push({"date":_date,"status":status_list[json2[i].Status],text:"<li id='i"+i+"'><a href='invoice.html?transId="+json2[i].Transactionid+"' data-transition='slide' data-link='invoice.html?transId="+json2[i].Transactionid+"' onclick='sessionStorage.setItem(invoiceIdText,"+json2[i].Transactionid+"); sessionStorage.setItem("+trans_pos+",getpos(this)); ' ><span class='"+status_list[json2[i].Status]+" "+(result.Data[userPlanIds.indexOf(json2[i].Userplanid)].Allowautopayment?"auto glyphicon glyphicon-repeat":"")+"'></span><div><p>"+json2[i].PlanName+"</p><p class='date_name'>"+(  (months[_date.getMonth()]) + ' ' + _date.getDate()+'<sup>' +nth(_date.getDate()) +'</sup> ' + json2[i].CustomerName) +"</p><p style='float:right;display: inline-block;'>"+(json2[i].AmountToPay+" "+json2[i].Currency)+"</p></div></a></li>"})
					
					$("#loader3").css("display","none");
					// $("#transactions_list").append()
				}
				myfunc();
				});
		    }, 250);
		});
	else
		setTimeout(function(){ 
			$.getJSON("http://mobil.billing4all.com/JSon/UserPlanByUserId?id="+userId+"", function(result){
			    var json = JSON.stringify(result, null, 2);
			    for (var i = 0; i < result.Data.length; i++) {
			    	userPlanIds.push(result.Data[i].Userplanid);
			    };
			    $.getJSON("http://mobil.billing4all.com/JSon/SearchTransactions?userplanIds="+userPlanIds+"&planIds="+planId+"&notThisCustomerId="+customerId, function(result2){
				    var json2 = result2.Data;
				    $("#transaction_header").empty().append(json2[0].PlanName)
					for(i=0;i<json2.length;i++){
						var _date = new Date(parseInt(json2[i].Paymenttime.replace("/Date(","").replace(")/","")))
						
						all_transactions.push({"date":_date,"status":status_list[json2[i].Status],text:"<li id='i"+i+"'><a href='invoice.html?transId="+json2[i].Transactionid+"' data-transition='slide' data-link='invoice.html?transId="+json2[i].Transactionid+"'onclick='sessionStorage.setItem(invoiceIdText,"+json2[i].Transactionid+");sessionStorage.setItem("+trans_pos+",getpos(this)); '><span class='"+status_list[json2[i].Status]+" "+(result.Data[userPlanIds.indexOf(json2[0].Userplanid)].Allowautopayment?"auto glyphicon glyphicon-repeat":"")+"'></span><div><p>"+(  (months[_date.getMonth()]) + ' ' + _date.getDate() + ' ' +_date.getFullYear())+"</p><p class='date_name'>"+json2[i].IntervalVisual+"</p><p style='float:right;display: inline-block;'>"+(json2[i].AmountToPay+" "+json2[i].Currency)+"</p></div></a></li>"})
						// $("#transactions_list").append("<li><a  href='' data-transition='fade' data-link='invoice.html?transId="+json2[i].Transactionid+"'><div><p>"+json2[i].PlanName+"</p><p style='display: inline-block;'>"+json2[i].Period+", "+json2[i].IntervalVisual+"</p><p style='float:right;display: inline-block;'>"+(json2[i].TotalAmountVisual)+"</p></div><span class='"+status_list[json2[i].Status]+"'></span></a></li>")
					}
					$.getJSON("http://mobil.billing4all.com/JSon/SearchTransactionLogs?userplanIds="+userPlanIds+"&planIds="+planId+"&notThisCustomerId="+customerId, function(result3){
					    var json3 = result3.Data;
					    /*console.log("up: " +userPlanIds + " - p: " + planId + " - c: " + customerId);*/
						for(j=0;j<json3.length;j++){
							var _date = new Date(parseInt(json3[j].Paymenttime.replace("/Date(","").replace(")/","")))
							
						
							all_transactions.push({"date":_date,"status":status_list[json3[j].Status],text:"<li class='"+status_list[json3[j].Status]+"_status_text' id='j"+j+"'><a  href='invoice.html?transId="+json3[j].Transactionid+"' data-transition='slide' data-link='invoice.html?transId="+json3[j].Transactionid+"'onclick='sessionStorage.setItem(invoiceIdText,"+json3[j].Transactionid+"); sessionStorage.setItem("+trans_pos+",getpos(this)); '><span class='"+status_list[json3[j].Status]+" "+(result.Data[userPlanIds.indexOf(json3[0].Userplanid)].Allowautopayment?"auto glyphicon glyphicon-repeat":"")+"'></span><div><p>"+(  (months[_date.getMonth()]) + ' ' + _date.getDate() + ' ' +_date.getFullYear())+"</p><p class='date_name'>"+json3[j].IntervalVisual+"</p><p style='float:right;display: inline-block;'>"+(json3[j].AmountToPay+" "+json3[j].Currency)+"</p></div></a></li>"});

							$("#loader3").css("display","none");
							// $("#transactions_list").append()
						}
						myfunc();
					});
				});
			});
		}, 250);
}

function _status_n_date(a,b){
	if( (a.status==status_yellow   &&b.status==status_red)||
		(a.status==status_green    &&b.status==status_red)||
		(a.status==status_darkgreen&&b.status==status_red)||
		(a.status==status_green    &&b.status==status_yellow)||
		(a.status==status_darkgreen&&b.status==status_yellow)||
		(a.status==status_darkgreen&&b.status==status_green))
		return 1;
	else if(a.status==b.status)
		return a.date-b.date;
	else
		return -1;
}
function _status_n_date_plan_version(a,b){
	if( (a.status==status_yellow   &&b.status==status_red)||
		(a.status==status_green    &&b.status==status_red)||
		(a.status==status_darkgreen&&b.status==status_red)||
		(a.status==status_green    &&b.status==status_yellow)||
		(a.status==status_darkgreen&&b.status==status_yellow)||
		(a.status==status_darkgreen&&b.status==status_green))
		return 1;
	else if(a.status==b.status)
		return b.date-a.date;
	else
		return -1;
}
function nth(d) {
  if(d>3 && d<21) return 'th'; // thanks kennebec
  switch (d % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
} 
function myfunc(){
	
	$('#transactions_list').html("");
	var sorted_list = [];
	if(planId!=undefined){
		sorted_list = all_transactions.sort(_status_n_date_plan_version);
	}
	else{
		sorted_list = (all_transactions.sort(_status_n_date));
	}
	var year_of_selection = null;
	for(i=0;i<sorted_list.length;i++){
		if (year_of_selection == null) {
			year_of_selection = sorted_list[i].date.getFullYear();	
		}
	else if (year_of_selection != sorted_list[i].date.getFullYear()) {
			year_of_selection = sorted_list[i].date.getFullYear();
			$("#transactions_list").append("<li class='a_year'>"+ year_of_selection +"</li>");
		}
		/*console.log(sorted_list[i].status);*/
		$("#transactions_list").append(sorted_list[i].text)
	}
	var pos =sessionStorage.getItem(trans_pos);
	if(pos!=undefined){
		$('.ui-content').scrollTop($("#"+pos).offset().top-70);
		sessionStorage.removeItem(trans_pos);
	}
	// $("#transactions_list li a").on('tap',function(){
	// 	if($("#transFilter").is(":focus")){

	// 	}
	// 	else
	// 		window.location=$(this).data("link");
	// });


	// $("#transFilter").on("keypress",function(){
	// 	setTimeout(function() {
	// 		var needs_dark_bg =false;
	// 		$("#transactions_list li").each(function(){
	// 			if(!$(this).hasClass("ui-screen-hidden")){
	// 				// console.log($(this).hasClass("ui-screen-hidden"))
	// 				if(needs_dark_bg){
	// 					$(this).css("background","#D2D2D2");
	// 				}else{
	// 					$(this).css("background","#F1F1F1");
	// 				}
	// 				needs_dark_bg=!needs_dark_bg;
	// 			}
	// 		})
	// 		// console.log("ddd");
	// 	}, 400);
	// }).on('keydown', function(e) {
 //   		if (e.keyCode==8)
 //     		$('#transFilter').trigger('keypress');
 // 	});
}

function init(){
	

	setSize();

}
function setSize(){
	$(".ui-content").css("height",(window.innerHeight-51));
}

$(document).on('pageinit', function(){
	init();
	$(window).on("orientationchange",function(){
  		setTimeout(function(){setSize();}, 500);
	});

});
make_list();
function getpos(element){
	return $(element).parent().attr("id");
}
/*$("#back").click(function(){
	var isPayment = location.search.substring(1);
	if (isPayment.indexOf("payment") > -1) 
		window.location="index.html";
})*/