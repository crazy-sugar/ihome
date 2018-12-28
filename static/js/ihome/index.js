//模态框居中的控制
function centerModals(){
    $('.modal').each(function(i){   //遍历每一个模态框
        var $clone = $(this).clone().css('display', 'block').appendTo('body');    
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top-30);  //修正原先已经有的30个像素
    });
}

function setStartDate() {
    var startDate = $("#start-date-input").val();
    if (startDate) {
        $(".search-btn").attr("start-date", startDate);
        $("#start-date-btn").html(startDate);
        $("#end-date").datepicker("destroy");
        $("#end-date-btn").html("离开日期");
        $("#end-date-input").val("");
        $(".search-btn").attr("end-date", "");
        $("#end-date").datepicker({
            language: "zh-CN",
            keyboardNavigation: false,
            startDate: startDate,
            format: "yyyy-mm-dd"
        });
        $("#end-date").on("changeDate", function() {
            $("#end-date-input").val(
                $(this).datepicker("getFormattedDate")
            );
        });
        $(".end-date").show();
    }
    $("#start-date-modal").modal("hide");
}

function setEndDate() {
    var endDate = $("#end-date-input").val();
    if (endDate) {
        $(".search-btn").attr("end-date", endDate);
        $("#end-date-btn").html(endDate);
    }
    $("#end-date-modal").modal("hide");
}

function goToSearchPage(th) {
    var url = "/house/search/?";
    url += ("aid=" + $(th).attr("area-id"));
    url += "&";
    var areaName = $(th).attr("area-name");
    if (undefined == areaName) areaName="";
    url += ("aname=" + areaName);
    url += "&";
    url += ("sd=" + $(th).attr("start-date"));
    url += "&";
    url += ("ed=" + $(th).attr("end-date"));
    location.href = url;
}

$(document).ready(function(){
//    $(".top-bar>.register-login").show();

    $(".area-list a").click(function(e){
        $("#area-btn").html($(this).html());
        $(".search-btn").attr("area-id", $(this).attr("area-id"));
        $(".search-btn").attr("area-name", $(this).html());
        $("#area-modal").modal("hide");
    });
    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);               //当窗口大小变化的时候
    $("#start-date").datepicker({
        language: "zh-CN",
        keyboardNavigation: false,
        startDate: "today",
        format: "yyyy-mm-dd"
    });
    $("#start-date").on("changeDate", function() {
        var date = $(this).datepicker("getFormattedDate");
        $("#start-date-input").val(date);
    });
    $.ajax({
        url:'/house/my_index/',
        dataType:'json',
        type:'GET',
        success: function(data){
            if(data.code.code=='200'){
                if(data.username){
                    $('.user-info').show()
                    $('.user-name').html(data.username)
                    $('.register-login').hide()
                }else{
                    $('.register-login').show()
                    $('.user-info').hide()
                }
            for(i in data.house_info){
                var banner = '<div class="swiper-slide">'
                // banner += '<a href="'+{{ url_for('house.detail') }}+'?id='+ data.house_info[i].id +'">'
                banner += '<img src="/static/media/upload/'+ data.house_info[i].image +'" ></a>'
                banner += '<div class="slide-title">'+ data.house_info[i].title +'</div></div>'
                $('.swiper-wrapper').append(banner)
            }


            var mySwiper = new Swiper ('.swiper-container', {
                loop: true,
                autoplay: 2000,
                autoplayDisableOnInteraction: false,
                pagination: '.swiper-pagination',
                paginationClickable: true
            });
            }
        }
    });
    $.get('/house/house_area/',function(data){
        if(data.code.code=='200'){
            for(i in data.area_info){
                var area_list = '<a href="#" area-id="'+data.area_info[i].id+'">'+ data.area_info[i].name +'</a>'
                $('.area-list').append(area_list)
                $(".area-list a").click(function(e){
                    $("#area-btn").html($(this).html());
                    $(".search-btn").attr("area-id", $(this).attr("area-id"));
                    $(".search-btn").attr("area-name", $(this).html());
                    $("#area-modal").modal("hide");
                });
            }
        }
    });

})