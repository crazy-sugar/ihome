$(document).ready(function(){
    $('.auth-warn').show();
    $('#houses-list').hide();
    $.ajax({
        url:'/user/my_auth_info/',
        dataType:'json',
        type:'GET',
        success: function(data){
            if(data.code.code=='200'){
              if(data.user_info.id_name){
                $('.auth-warn').hide()
                $('#houses-list').show()
              }

            }
        },
    });
    $.get('/house/house_info/',function(data){
        if(data.code.code=='200'){
            for(var i=0;i<data.house_info.length;i++){
                var house = '<li>'
                house += '<a href="/house/detail/?house_id='+data.house_info[i].id+'">'
                house += '<div class="/house-title">'
                house += '<h3>房屋ID:'+data.house_info[i].id+'——'+data.house_info[i].title+'</h3>'
                house += '</div><div class="house-content">'
                house += '<img alt="" src="/static/media/upload/'+data.house_info[i].image+'">'
                house += '<div class="house-text"><ul>'
                house += '<li>位于：'+data.house_info[i].area+'</li>'
                house += '<li>价格：￥'+data.house_info[i].price+'/晚</li>'
                house += '<li>发布时间：'+data.house_info[i].create_time+'</li>'
                house += '</ul></div></div></a></li>'
                $('#houses-list').append(house)
            }
        }

    })
})