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

    $.ajax({
        url:'/order/my_orders/',
        dataType:'json',
        type:'GET',
        success: function(data){
            if(data.code.code=='200'){
                for(i in data.order_info){
                    var order_text_info = '<li order-id='+data.order_info[i].order_id+'>'
                    order_text_info += '<div class="order-title"><h3>订单编号：'+data.order_info[i].order_id+'</h3>'
                    order_text_info += '<div class="fr order-operate">'
                    order_text_info += '<button type="button" id="order-comment'+data.order_info[i].order_id+'" class="btn btn-success order-comment" data-toggle="modal" data-target="#comment-modal">发表评价</button>'
                    order_text_info += ' </div></div><div class="order-content">'
                    order_text_info += '<img src="/static/media/upload/'+data.order_info[i].image+'">'
                    order_text_info += '<div class="order-text">'
                    order_text_info +='<h3>'+data.order_info[i].house_title+'</h3><ul><li>创建时间：'+data.order_info[i].create_date+'</li>'
                    order_text_info += '<li>入住日期：'+data.order_info[i].begin_date+'</li>'
                    order_text_info += '<li>离开日期：'+data.order_info[i].end_date+'</li>'
                    order_text_info += '<li>合计金额：'+data.order_info[i].amount+'元(共1晚)</li>'
                    order_text_info += '<li>订单状态：<span>'+data.order_info[i].status+'</span>'
                    order_text_info += '</li><li>我的评价：'+data.order_info[i].comment+'</li>'
                    order_text_info += '<li>拒单原因：</li></ul>'
                    $('.orders-list').append(order_text_info)
                }
                $('#order-comment'+data.order_info[i].order_id).on("click", function(){
                    var orderId = $(this).parents("li").attr("order-id");
                    $('.modal-comment').attr("order-id", orderId);
                    console.log(orderId)
                    var order_Id = $('.modal-comment').attr('order-id')

                    $('.modal-comment').on('click',function(){
                     var comment = $('#comment').val()
                        if(comment){
                            comment = $('#comment').val()
                            $.ajax({
                                url: '/order/my_orders/',
                                data: {'comment': comment,'order_id':order_Id},
                                dataType: 'json',
                                type: 'POST',
                                success: function(data){
                                    if(data.code.code=='200'){
                                        alert('ok')
                                        $('#comment-modal').hide()
                                        location.reload
                                    }
                                }
                            })
                        }
                    })

                });

            }
        }
    })






});