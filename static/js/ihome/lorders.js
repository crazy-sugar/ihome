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

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);
    $(".order-accept").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-accept").attr("order-id", orderId);
    });
    $(".order-reject").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-reject").attr("order-id", orderId);
    });
    $.ajax({
        url: '/order/lorders_info/',
        dataType:'json',
        type:'GET',
        success: function(data){
            if(data.code.code=='200'){
                for(i in data.lorder_info){
                    var lorder_text_info = '<li order-id='+data.lorder_info[i].order_id+'><div class="order-title">'
                    lorder_text_info += '<h3>订单编号：'+data.lorder_info[i].order_id+'</h3>'
                    lorder_text_info += '<div class="fr order-operate">'
                    lorder_text_info += '<button type="button" class="btn btn-success order-accept" data-toggle="modal" data-target="#accept-modal">接单</button>'
                    lorder_text_info += '<button type="button" class="btn btn-danger order-reject" data-toggle="modal" data-target="#reject-modal">拒单</button>'
                    lorder_text_info += '</div></div><div class="order-content">'
                    lorder_text_info += '<img src="/static/media/upload/'+data.lorder_info[i].image+'">'
                    lorder_text_info += '<div class="order-text"><h3>'+data.lorder_info[i].house_title+'</h3>'
                    lorder_text_info += '<ul><li>创建时间：'+data.lorder_info[i].create_date+'</li>'
                    lorder_text_info += '<li>入住日期：'+data.lorder_info[i].begin_date+'</li>'
                    lorder_text_info += '<li>离开日期：'+data.lorder_info[i].end_date+'</li>'
                    lorder_text_info += '<li>合计金额：￥'+data.lorder_info[i].amount+'(共'+data.lorder_info[i].days+'晚)</li>'
                    lorder_text_info += '<li>订单状态：<span>'+data.lorder_info[i].status+'</span>'
                    lorder_text_info += '</li><li>客户评价： '+data.lorder_info[i].comment+'</li>'
                    lorder_text_info += '</ul> </div></div></li>'
                    $('.orders-list').append(lorder_text_info)
                }
            }
        }
    })
});