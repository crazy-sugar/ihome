function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

$('#form-auth').submit(function(e){
    e.preventDefault()
    real_name= $('#real-name').val()
    id_card= $('#id-card').val()
    $.ajax({
        url:'/user/auth/',
        dataType:'json',
        data:{'real_name':real_name, 'id_card':id_card},
        type:'POST',
        success: function(data){
            alert('success')
            $('#real-name').val(data.user_info.id_name)
            $('#id-card').val(data.user_info.id_card)
            if(data.user_info.id_name){
                $('.btn-success').hide()
                $('#real-name').attr('disabled',true)
                $('#id-card').attr('disabled',true)
            }


        },
        error: function(data){
            alert('failed')
        }
    });


})

$(document).ready(function(){

    $.ajax({
        url:'/user/my_auth_info/',
        dataType:'json',
        type:'GET',
        success: function(data){
            if(data.code.code=='200'){
                $('#real-name').val(data.user_info.id_name)
                $('#id-card').val(data.user_info.id_card)
                if(data.user_info.id_name){
                    $('.btn-success').hide()
                }
            }
        },

    })
})