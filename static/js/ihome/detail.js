function hrefBack() {
    history.go(-1);
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

$(document).ready(function(){
    $('.book-house').show()
    var search_url = location.search
    house_id = search_url.split('=')[1]
    $.get('/house/detail/'+ house_id +'/', function(data){
        if(data.code.code=='200'){
            for(i in data.house.images){
                var swiper_li = '<li class="swiper-slide">'
                swiper_li += '<img src="/static/media/upload/'+data.house.images[i]+'"></li>'
                $('.swiper-wrapper').append(swiper_li)
            }
            var mySwiper = new Swiper ('.swiper-container', {
                loop: true,
                autoplay: 2000,
                autoplayDisableOnInteraction: false,
                pagination: '.swiper-pagination',
                paginationType: 'fraction'
            })
            $('.house-price').html('￥<span>'+data.house.price+'</span>/晚')
            $('.house-info-address').html(data.house.address)
            $('.house-title').html(data.house.title)
            $('.landlord-pic').html('<img src="/static/media/'+data.house.user_avatar+'">')
            $('.landlord-name').html('房东： <span>'+data.house.user_name+'</span>')
            $('.house-info-list').html(data.house.address)
            $('.house-type-detail').html('<h3>出租'+data.house.room_count+'间</h3><p>房屋面积:'+data.house.acreage+'平米</p><p>房屋户型:'+data.house.unit+'</p>')
            $('.house-capacity').html('<h3>宜住'+data.house.capacity+'人</h3>')
            $('.house-bed').html('<h3>卧床配置</h3><p>'+data.house.beds+'</p>')
            $('.house-info-days').html('<li>收取押金<span>'+data.house.deposit+'</span></li><li>最少入住天数<span>'+data.house.min_days+'</span></li><li>最多入住天数<span>'+data.house.max_days+'</span></li>')

            var house_facility_list=''
            for(var i=0; i<data.facility_list.length; i++){
                house_facility_list += '<li><span class="'+data.facility_list[i].css+'"></span>'+data.facility_list[i].name+'</li>'
            }
            $('.house-facility-list').html(house_facility_list)
            $('.book-house').attr('href','/order/booking/?id='+data.house.id)

            if(data.booking==1){
                $('.book-house').show()
            }else{
                $('.book-house').hide()
            }
        }
    })
})