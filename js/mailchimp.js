$(document).ready( function () {
    var $form = $('form');

    if ( $form.length > 0 ) {
        $('#mc-embedded-subscribe').bind('click', function ( event ) {
            if ( event ) event.preventDefault();
            register($form);
        });
    }
});

function register($form) {
    $.ajax({
        type: $form.attr('method'),
        url: $form.attr('action'),
        data: $form.serialize(),
        cache       : false,
        dataType    : 'json',
        contentType: "application/json; charset=utf-8",
        error       : function(err) { alert("Could not connect to the registration server. Please try again later."); },
        success     : function(data) {
            if (data.result != "success") {
                if(data.msg.includes('already subscribed')) {
                    console.log('already subscribed');
                    success();
                } else {
                    console.log('something went wrong');
                }
            } else {
                console.log('mailchimp success');
                success();
            }
        }
    });
}

function success() {
    $('.success').removeClass('hidden');
    $('.success').addClass('visible');
    $('.success').css('display', 'block');

    $('form').removeClass('visible');
    $('form').addClass('hidden');
    $('form').css('display', 'none');
}