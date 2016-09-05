var userPlanIds = [];
var planId = location.search.substring(1).split("planId=")[1];
var userId = JSON.parse(sessionStorage.getItem('user')).Id;
var customerId = null;
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
var plan_name;
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
customerId = JSON.parse(sessionStorage.getItem('user')).CustomerId;
isPending = sessionStorage.getItem('isPending')!=undefined?true:false;
planId = sessionStorage.getItem('planId');
userId = JSON.parse(sessionStorage.getItem('user')).Id;
var trans_id;
var comingPayments = [];
var invoiceIdText = "invoiceId";

$.getJSON("http://mobil.billing4all.com/JSon/UserPlanByUserId?id="+userId+"", function(result){
    var json = JSON.stringify(result, null, 2);
	userPlanIdsResult = result;
    for (var i = 0; i < result.Data.length; i++) {
    	userPlanIds.push(result.Data[i].Userplanid);
    };
    setTimeout(function(){ 
	    $.getJSON("http://mobil.billing4all.com/JSon/SearchTransactions?userplanIds="+userPlanIds+"&planIds="+planId+"&notThisCustomerId="+customerId+"&notTransStatus=90", function(result2){
		    var json2 = result2.Data;
		    plan_name = json2[0].PlanName;
		    trans_id= json2[0].Transactionid;
	    	
		    plan_name==undefined?"":$("#abo_plan_detail_title").text(plan_name); 
		    $("#plan_price").empty().append("<p>Amount: </p>" + result.Data[userPlanIds.indexOf(json2[0].Userplanid)].NextpaymentVisual);
		    var next_payment_date = new Date(parseInt(result.Data[userPlanIds.indexOf(json2[0].Userplanid)].Nextpaymentdate.replace("/Date(","").replace(")/","")))
		   	$("#next_payment").empty().append("<p>Next payment: </p>" +(  (months[next_payment_date.getMonth()]) + ' ' + next_payment_date.getDate() + ' ' +next_payment_date.getFullYear()));
		    $("#auto_payment").empty().append("<p>Auto payment: </p>" + autoPayment(result.Data[userPlanIds.indexOf(json2[0].Userplanid)].AllowautopaymentVisual));

			for(i=0;i<json2.length;i++){
					var _date = new Date(parseInt(json2[i].Paymenttime.replace("/Date(","").replace(")/","")))
					comingPayments.push({"date":_date,"status":status_list[json2[i].Status],text:"<li style='padding-top: 5px;'><a href='invoice.html?transId="+json2[i].Transactionid+"' data-transition='slide' data-link='invoice.html?transId="+json2[i].Transactionid+"'onclick='sessionStorage.setItem(invoiceIdText,"+json2[i].Transactionid+");'><span class='auto_top "+status_list[json2[i].Status]+" "+(result.Data[userPlanIds.indexOf(json2[0].Userplanid)].Allowautopayment?"auto glyphicon glyphicon-repeat auto_top_alt":"")+"'></span><div><p style='display: inline-block;'>"+(  (months[_date.getMonth()]) + ' ' + _date.getDate() + ' ' +_date.getFullYear())+"</p><p style='margin-top: -12px;'>"+json2[i].IntervalVisual+"</p><p style='float:right;display: inline-block; margin-top: -30px;'>"+(json2[i].AmountToPay+" "+json2[i].Currency)+"</p></div></a></li>"});
					/*$("#plan_detail_list").append("<li><a href='invoice.html?transId="+json2[i].Transactionid+"' data-transition='slide' data-link='invoice.html?transId="+json2[i].Transactionid+"'onclick='sessionStorage.setItem(invoiceIdText,"+json2[i].Transactionid+");'><div><p style='display: inline-block;'>"+(  (months[_date.getMonth()]) + ' ' + _date.getDate() + ' ' +_date.getFullYear())+"</p><p >"+json2[i].IntervalVisual+"</p><p style='float:right;display: inline-block; margin-top: -30px;'>"+(json2[i].AmountToPay+" "+json2[i].Currency)+"</p></div><span class='"+status_list[json2[i].Status]+"'></span></a></li>")*/
			}
			mySort();
			if($("#plan_detail_list li").size()<2){
				$("#plan_detail_list").append("<li><div style='height:70px; text-align:center; padding:20px; width:100%;'>No more payments!</div></li>");
			}
			if($("#plan_detail_list li").size()<3){
				$("#plan_detail_list").append("<li><div style='height:70px;'></div></li>");
			}
			
			// console.log(json2[0].Transactionid)
			$("#plan_detail_list").append("<li><a href='abo_transactions.html?planId="+json2[0].Planid+"' data-transition='slide' data-link='abo_transactions.html?planId="+json2[0].Planid+"'><div><p>View all payments</p></div></a></li>")
			$.getJSON("http://mobil.billing4all.com/JSon/GetCustomerToTransaction?transactionIds="+json2[0].Transactionid, function(result3){
		    	var json3 = result3.Data;
		    	// console.log(json3);
		    	$("#company_name").empty().append("<p>Company Name: </p>" + json3[0].customerName);
		    	$("#company_email").empty().append("<p>Email: </p>" + json3[0].Email);
		    	$("#company_phone").empty().append("<p>Phone: </p>" + json3[0].Phone);
		    	$("#loader2").css("display","none");
			});
			if (userPlanIdsResult.Data[userPlanIds.indexOf(json2[0].Userplanid)].Allowautopayment) {
				$('#stop_autopayment_plan').click(function(){
					$(".pages").append("<div class='overlay_modal'></div><div class='plan_dialog'>Are you sure you want to stop automatic payment for plan : " + plan_name + "? " + " <button onclick='unsub_cancel()'>Cancel</button> <button onclick='cancelAutopayment()'>Stop auto</button></div>");
					$("#plan_details_settings_menu").toggle();
				})
			}
			else{
				$('#stop_autopayment_plan').html("Request autopayment");
				$('#stop_autopayment_plan').click(function(){
					$(".pages").append("<div class='overlay_modal'></div><div class='plan_dialog'>Are you sure you want to make plan : " + plan_name + " set to autopayment?" + " <button onclick='unsub_cancel()'>Cancel</button> <button onclick='requestAutopayment()'>Request auto</button></div>");
					$("#plan_details_settings_menu").toggle();
				})
			}		
		});
	}, 250);
});

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

function mySort(){
	var sorted_list = (comingPayments.sort(_status_n_date));
	if (sorted_list.length == 1) {
		for(i=0;i<1;i++){
			$("#plan_detail_list").append(sorted_list[i].text)
		}
	}
	else
	{
		for(i=0;i<2;i++){
			$("#plan_detail_list").append(sorted_list[i].text)
		}
	}
}

function autoPayment(icon){
	/*console.log(icon);*/
	if(icon === "Yes"){
		return "<span class='glyphicon glyphicon-ok' style='color:green'></span>";
	}
	else if( icon === "No"){
		return "<span class='glyphicon glyphicon-remove' style='color:red'></span>";
	}
}

$("#plan_details_settings").click(function(){
	$("#plan_details_settings_menu").toggle();
})
$("#unsubscribe_plan").click(function(){
	$(".pages").append("<div class='overlay_modal'></div><div class='plan_dialog'>Are you sure you want to Unsubscribe from " + plan_name + "? <button onclick='unsub_cancel()'>Cancel</button> <button onclick='unsub_accept()'>Unsubscribe</button></div>");
	$("#plan_details_settings_menu").toggle();
})

function unsub_cancel(){
	setTimeout(function() {
  		$(".plan_dialog").remove();
  		$(".overlay_modal").remove();
	}, 200);
}
function unsub_accept(){
	$(".plan_dialog").remove();
	$("#loader2").css("display", "block");
	setTimeout(function(){ 
		$.getJSON("http://mobil.billing4all.com/JSon/FindUserByPlanid?id="+planId, function(res){
			var json = JSON.stringify(res, null, 2);
			$(".plan_dialog").remove();
	  		$(".overlay_modal").remove();
		    $.ajax({
			    url: 'http://mobil.billing4all.com//JSon/SendUserWantsToUnsubscriberRequestFunc',
			    data: JSON.stringify({userId: userId,planId: planId,NotifyMessage:'Hi, I would like to unsubscribe from this plan.',attachment:null}),
				contentType: 'application/json',
			    method: 'POST',	
			    success: function(data)
			    {
			    	/*console.log("SendUserWantsToUnsubscriberRequestFunc works");*/
			    	$("#loader2").css("display","none");
			    	$("#loader_complete").css("display","block");
			    	$("#loader_complete_bg").css("display","block");
			    	setTimeout(function(){ 
			    		$("#loader_complete").css("display","none");
			    		$("#loader_complete_bg").css("display","none");
			    	}, 2500);
			    },
			    error: function(data)
			    {
			    	$("#loader2").css("display","none");
			    	$(".overlay_modal").remove();
			    	window.alert("Unable to unsubscribe from plan");
			    }
			});
		});
	}, 250);
}

function cancelAutopayment(){
	$(".plan_dialog").remove();	
	$(".overlay_modal").remove();
	$("#loader2").css("display","block");
	setTimeout(function(){ 
		$.ajax({
		    url: 'http://mobil.billing4all.com/JSon/CancelPaymentAuto',
		    data: JSON.stringify({id: trans_id, uid:userId}),
			contentType: 'application/json',
		    method: 'POST',	
		    success: function(data)
		    {
		    	$("#loader2").css("display","none");
		    	$("#loader_complete").css("display","block");
		    	$("#loader_complete_bg").css("display","block");
		    	setTimeout(function(){ 
		    		$("#loader_complete").css("display","none");
		    		$("#loader_complete_bg").css("display","none");
		    	}, 2500);
		    },
		    error: function(data)
		    {
		    	$("#loader2").css("display","none");
		    	$(".overlay_modal").remove();
		    	window.alert("Could not stop autopayment on plan. Contact Billing4all for more information.");
		    }
   	    })
	}, 250);    
}	

function requestAutopayment(){
	$(".plan_dialog").remove();
	$(".overlay_modal").remove();
	$("#loader2").css("display","block");
	setTimeout(function(){ 
		$.ajax({
		    url: 'http://mobil.billing4all.com/JSon/RequestPaymentAuto',
		    data: JSON.stringify({id: trans_id, uid:userId}),
			contentType: 'application/json',
		    method: 'POST',	
		    success: function(data)
		    {
		    	$("#loader2").css("display","none");
		    	$("#loader_complete").css("display","block");
		    	$("#loader_complete_bg").css("display","block");
		    	setTimeout(function(){ 
		    		
		    		$("#loader_complete").css("display","none");
		    		$("#loader_complete_bg").css("display","none");
		    	}, 2500);
		    },
		    error: function(data)
		    {
		    	$("#loader2").css("display","none");
		    	$(".overlay_modal").remove();
		    	window.alert("Could not request autopayment on plan. Contact Billing4all for more information.");
		    }
		})
	}, 250); 	
}	


