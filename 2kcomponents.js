$('k-tab').each(function(){
    $(this).click(function(){
        $('k-tab').each(function(){
            $(this).removeClass('active');
        });
        $(this).addClass('active');
    })
});