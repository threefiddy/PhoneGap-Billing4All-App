/*function checkbox(){
	var checkboxChecked = document.getElementById("checkAutopay").checked;
	 if(checkboxChecked)
	 {
	 	document.getElementById("autopay").style.cssText += 'background-color: #00beed; color: white; border-color: #00BEED #008FAC #008FAC #008FAC;';
	 	console.log("checked");
	 }
	else if(!checkboxChecked)
	{
		document.getElementById("autopay").style.cssText += 'background-color: #fff; color: black; border-color: black;';
	}
}*/
var userId = JSON.parse(sessionStorage.getItem('user')).Id;
var transId = location.search.substring(1).split("transId=")[1]
if (sessionStorage.getItem('auto_payment')=="false") {
	console.log("bjarne");
	$('#autopay').css('display','block');
};

function checkCheckbox(){
	var checkboxChecked = document.getElementById("checkAutopay").checked;

	if(checkboxChecked){
		document.getElementById("checkAutopay").checked = false;
		document.getElementById("autopay").style.cssText += 'background-color: #fff; color: black; border-color: #B8B8B8;';
	}
	else{
		document.getElementById("autopay").style.cssText += 'background-color: #515D69; color: white; border-color: #515D69 #364452 #364452 #364452;';
		document.getElementById("checkAutopay").checked = true;
	}
	
}
function AcceptPay(){
	$.ajax({
		url: 'http://mobil.billing4all.com/JSon/PaymentDone',
		data: JSON.stringify({id: transId, tid:new Date().getTime(), status:sessionStorage.getItem('trans_status'), uid:userId}),
		contentType: 'application/json',
		method: 'POST',	
		success: function(data)
		{
			if (document.getElementById("checkAutopay").checked) {
			    $.ajax({
				    url: 'http://mobil.billing4all.com/JSon/PaymentAuto',
				    data: JSON.stringify({id: transId, uid:userId}),
					contentType: 'application/json',
				    method: 'POST',	
				    success: function(data)
				    {
				    	/*window.location = "index.html";*/
				    },
				    error: function(data)
				    {
				    	/*window.alert("Error. Plan is not set to autopayment");*/
				    }
			    })
			}	
			window.location = "index.html";
		},
		error: function(data)
		{
			window.alert("Error. Transaction cannot be paid. Maybe you havent entered the right payment information.");
		}
	})	
}

$('document').ready(function() {
	
	$('#checkout input').click(function(){
		setTimeout(
            function() {

				window.scrollBy(0,70);
            },
            150);

	})
})

// $("#back").click(function(){
// 	window.history.back();
// })

