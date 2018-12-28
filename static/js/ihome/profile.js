//function showSuccessMsg() {
//    $('.popup_con').fadeIn('slow', function() {
//        setTimeout(function(){
//            $('.popup_con').fadeOut('slow',function(){});
//        },10000)
//    });
//}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$('#form-avatar').submit(function(e){
    e.preventDefault();
    avatar = $('#avatar').val()
    $(this).ajaxSubmit({
        url: '/user/profile/',
        dataType: 'json',
        type: 'PATCH',
        success: function(data){
            if (data.code.code=='200'){
                alert('success')
                avapic = '/static/media/'+ data.user_info.avatar
                $('#user-avatar').attr('src',avapic)

            }
        },
        error: function(data){
            alert('failed')
        }
    })
})


$('#form-name').submit(function(e){
    var user_name = $('#user-name').val()
    $.ajax({
        url:'/user/profile/',
        dataType:'json',
        data:{'username':user_name},
        type:'post',
        success: function(data){
            if (data.code.code=='200'){
                $('.popup_con').show()
                $('#user-name').val(data.user_info.name)
            }

        },

    })
})