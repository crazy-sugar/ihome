var cur_page = 1; // 当前页
var next_page = 1; // 下一页
var total_page = 1;  // 总页数
var house_data_querying = true;   // 是否正在向后台获取数据

// 解析url中的查询字符串
function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

// 更新用户点选的筛选条件
function updateFilterDateDisplay() {
    var startDate = $("#start-date").val();
    var endDate = $("#end-date").val();
    var $filterDateTitle = $(".filter-title-bar>.filter-title").eq(0).children("span").eq(0);
    if (startDate) {
        var text = startDate.substr(5) + "/" + endDate.substr(5);
        $filterDateTitle.html(text);
    } else {
        $filterDateTitle.html("入住日期");
    }
}


// 更新房源列表信息
// action表示从后端请求的数据在前端的展示方式
// 默认采用追加方式
// action=renew 代表页面数据清空从新展示
function updateHouseData(action) {
    var areaId = $(".filter-area>li.active").attr("area-id");
    if (undefined == areaId) areaId = "";
    var startDate = $("#start-date").val();
    var endDate = $("#end-date").val();
    var sortKey = $(".filter-sort>li.active").attr("sort-key");
    var params = {
        aid:areaId,
        sd:startDate,
        ed:endDate,
        sk:sortKey,
        p:next_page
    };
    //发起ajax请求，获取数据，并显示在模板中
    $.ajax({
       url:'/house/index_search/',
       dataType:'json',
       data:params,
       type:'GET',
       success: function(data){
           if(data.code.code=='200'){
            for(i in data.house_info){
                var search_text_info = '<li class="house-item">'
                search_text_info += '<a href="/house/detail/?house_id='+data.house_info[i].id+'">'
                search_text_info += '<img src="/static/media/upload/'+data.house_info[i].images[0]+'"></a>'
                search_text_info += '<div class="house-desc"><div class="landlord-pic">'
                search_text_info += '<img src="/static/media/'+data.house_info[i].user_avatar+'"></div>'
                search_text_info += '<div class="house-price">￥<span>'+data.house_info[i].price+'</span>/晚</div>'
                search_text_info += '<div class="house-intro">'
                search_text_info += '<span class="house-title">'+data.house_info[i].title+'</span>'
                search_text_info += '<em>出租'+data.house_info[i].room_count+'间 - '+data.house_info[i].order_count+'次入住 - '+data.house_info[i].address +'</em>'
                search_text_info += ' </div></div> </li>'
                $('.house-list').append(search_text_info)
            }
        }
       }

    });
}

$(document).ready(function(){
    var queryData = decodeQuery();
    var startDate = queryData["sd"];
    var endDate = queryData["ed"];
    $("#start-date").val(startDate);
    $("#end-date").val(endDate);
    updateFilterDateDisplay();
    var areaName = queryData["aname"];
    if (!areaName) areaName = "位置区域";
    $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html(areaName);

    $(".input-daterange").datepicker({
        format: "yyyy-mm-dd",
        startDate: "today",
        language: "zh-CN",
        autoclose: true
    });
    var $filterItem = $(".filter-item-bar>.filter-item");
    $(".filter-title-bar").on("click", ".filter-title", function(e){
        var index = $(this).index();
        if (!$filterItem.eq(index).hasClass("active")) {
            $(this).children("span").children("i").removeClass("fa-angle-down").addClass("fa-angle-up");
            $(this).siblings(".filter-title").children("span").children("i").removeClass("fa-angle-up").addClass("fa-angle-down");
            $filterItem.eq(index).addClass("active").siblings(".filter-item").removeClass("active");
            $(".display-mask").show();
        } else {
            $(this).children("span").children("i").removeClass("fa-angle-up").addClass("fa-angle-down");
            $filterItem.eq(index).removeClass('active');
            $(".display-mask").hide();
            updateFilterDateDisplay();
        }
    });
    $(".display-mask").on("click", function(e) {
        $(this).hide();
        $filterItem.removeClass('active');
        updateFilterDateDisplay();
        cur_page = 1;
        next_page = 1;
        total_page = 1;
        updateHouseData("renew");
//
//        var search_path = location.search
//        $.get('/house/index_search/'+ search_path, function(data){
//            if(data.code.code=='200'){
//                for(i in data.house_info){
//                    var search_text_info = '<li class="house-item">'
//                    search_text_info += '<a href="/house/detail/?house_id='+data.house_info[i].id+'">'
//                    search_text_info += '<img src="/static/media/upload/'+data.house_info[i].images[0]+'"></a>'
//                    search_text_info += '<div class="house-desc"><div class="landlord-pic">'
//                    search_text_info += '<img src="/static/media/'+data.house_info[i].user_avatar+'"></div>'
//                    search_text_info += '<div class="house-price">￥<span>'+data.house_info[i].price+'</span>/晚</div>'
//                    search_text_info += '<div class="house-intro">'
//                    search_text_info += '<span class="house-title">'+data.house_info[i].title+'</span>'
//                    search_text_info += '<em>出租'+data.house_info[i].room_count+'间 - '+data.house_info[i].order_count+'次入住 - '+data.house_info[i].address +'</em>'
//                    search_text_info += ' </div></div> </li>'
//                    $('.house-list').append(search_text_info)
//                }
//            }
//        });

    });
    $(".filter-item-bar>.filter-area").on("click", "li", function(e) {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
            $(this).siblings("li").removeClass("active");
            $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html($(this).html());

        } else {
            $(this).removeClass("active");
            $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html("位置区域");
        }

    });
    $(".filter-item-bar>.filter-sort").on("click", "li", function(e) {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
            $(this).siblings("li").removeClass("active");
            $(".filter-title-bar>.filter-title").eq(2).children("span").eq(0).html($(this).html());
        }
    });
    $.get('/house/house_area/',function(data){
        if(data.code.code=='200'){
            for(i in data.area_info){
                var area_list = '<li area-id="'+data.area_info[i].id+'">'+data.area_info[i].name+'</li>'
                $('.filter-area').append(area_list)

                }
            }
    });


})