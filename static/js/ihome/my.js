function logout() {
    $.get("/api/logout", function(data){
        if (0 == data.errno) {
            location.href = "/";
        }
    })
}

$(document).ready(function(){

    $.ajax({
        url:'/user/my_info/',
        dataType: 'json',
        type: 'GET',
//        headers: {'X-CSRFToken':getCookie('csrf_token')},
        success: function(data){
            var avapic = '/static/media/'+ data.avatar
            $('#user-name').text(data.name)
            $('#user-mobile').text(data.phone)
            $('#user-avatar').attr('src',avapic)

        },
        error: function(data){
            alert('load failed')
        }
    })
})