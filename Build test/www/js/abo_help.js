// $("#back").click(function(){
// 	window.history.back();
// })

var up = 'glyphicon-chevron-up';
var down = 'glyphicon-chevron-down';
var selected = 'selected_help';
    
$(".help_click").click(function(){
	$(this).siblings(".help_hide_section").animate({
		height: 'toggle'
	});
    
    $(this).parent(".help_section").siblings().children(".help_hide_section").slideUp(function(){
        
        if($(this).siblings(".help_click").children().hasClass(up)){
            $(this).siblings(".help_click").children().removeClass(up);
            $(this).siblings(".help_click").children().addClass(down);
            $(this).siblings(".help_click").removeClass(selected);
        }

    });
	
    if ($(this).children().hasClass(up)) {
        $(this).children().removeClass(up);
        $(this).children().addClass(down);
        $(this).removeClass(selected)
    }
    else if ($(this).children().hasClass(down)) {
        $(this).children().removeClass(down);
        $(this).children().addClass(up);
        $(this).addClass(selected);
    }

})

function OpenLink(){
    window.open("http://billing4all.com/P/helpfrontpage/0", "_system");
}