function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    // $('.popup_con').fadeIn('fast');
    // $('.popup_con').fadeOut('fast');
    $.ajax({
        url:'/house/house_area/',
        dataType:'json',
        type:'GET',
        success: function(data){
            for(i in data.area_info){
                var option = $('<option>').attr('value',data.area_info[i].id).text(data.area_info[i].name)
                $('#area-id').append(option)
            }
            for(f in data.facility_list){
                $('#clearfix').append('<li>'+'<div class="checkbox">'+'<label>'
                +'<input type="checkbox" name="facility" value="'+data.facility_list[f].id+'">'
                +data.facility_list[f].name+'</label>'+'</div>'+'</li>')
            }

        },
    });
    $('#form-house-info').submit(function(e){
        e.preventDefault()
//        house-title = $('#house-title').val()
//        house-price = $('#house-price').val()
//        area-id = $('#area-id').val()
//        house-address = $('#house-address').val()
//        house-room-count = $('#house-room-count').val()
//        house-acreage = $('#house-acreage').val()
//        house-unit = $('#house-unit').val()
//        house-capacity = $('#house-capacity').val()
//        house-beds = $('#house-beds').val()
//        house-deposit = $('#house-deposit').val()
//        house-min-days= $('#house-min-days').val()
//        house-max-days = $('#house-max-days').val()
//        var checkid = []
//        $('input[name='facility']:checked').each(function(i){
//            checkid[i] = $(this).val()
//        })
        $(this).ajaxSubmit({
            url:'/house/newhouse/',
            dataType:'json',
            type: 'PATCH',
            success: function(data){
                $('#form-house-image').show()
                $('#house-id').val(data.house_info.id)
                $('#form-house-info').hide()
            },
            error:function(data){
                alert('failed')
                $('.error-msg').show()

            }
        })
    })
    $('#form-house-image').submit(function(e){
        e.preventDefault()

        $(this).ajaxSubmit({
            url:'/house/newhouse_image/',
            dataType:'json',
            type:'POST',
            success: function(data){
                if(data.code.code=='200'){
                    for(i in data.imgs){
                        $('#form-house-image').prepend('<img src="'+'/static/media/upload/'+data.imgs[i]+'">')
                    alert('success')
//                    location.href='/house/myhouse/'
                    }
                }
            },
            error:function(data){
                alert('failed')
            }
        })
    })

})