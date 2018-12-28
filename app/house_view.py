import os

from flask import Blueprint, render_template, request, session, jsonify

from app.models import User, House, HouseImage, Area, Facility, Order
from utils import status_code
from utils.functions import is_login
from utils.settings import UPLOAD_PATH

blue_house = Blueprint('house', __name__)


@blue_house.route('/myhouse/', methods=['GET'])
def myhouse():
    return render_template('myhouse.html')


@blue_house.route('/newhouse/', methods=['GET'])
def newhouse():
    return render_template('newhouse.html')


@blue_house.route('/newhouse/', methods=['PATCH'])
@is_login
def newhouse_info():
    title = request.form.get('title')
    price = request.form.get('price')
    area_id = request.form.get('area_id')
    address = request.form.get('address')
    room_count = request.form.get('room_count')
    acreage = request.form.get('acreage')
    unit = request.form.get('unit')
    capacity = request.form.get('capacity')
    beds = request.form.get('beds')
    deposit = request.form.get('deposit')
    min_days = request.form.get('min_days')
    max_days = request.form.get('max_days')
    facilitys = request.form.getlist('facility')
    fcl = [title, price, area_id, address, room_count, acreage, unit, capacity, beds, deposit, min_days, max_days,facilitys]
    if not all(fcl):
        return jsonify(status_code.INFORMATION_UNCOMPLETED)
    user_id = session.get('user_id')
    house = House()
    house.user_id = user_id
    house.title = title
    house.price = price
    house.area_id = area_id
    house.address = address
    house.room_count = room_count
    house.acreage = acreage
    house.unit = unit
    house.capacity = capacity
    house.beds = beds
    house.deposit = deposit
    house.min_days = min_days
    house.max_days = max_days
    # 中间表添加数据
    for f in facilitys:
        fac = Facility.query.get(int(f))
        house.facilities.append(fac)
    house.add_update()

    return jsonify(code=status_code.SUCCESS,house_info = house.to_dict())


@blue_house.route('/newhouse_image/', methods=['POST'])
@is_login
def newhouse_image():
    house_image = request.files.get('house_image')
    house_id = request.form.get('house_id')
    if not house_image:
        return jsonify(status_code.IMAGE_UPLOAD_FAILED)
    if not house_id:
        return jsonify(status_code.USER_Unauthorized)
    path = os.path.join(UPLOAD_PATH, house_image.filename)
    house_image.save(path)
    house = House.query.get(house_id)
    if not house.index_image_url:
        house.index_image_url = house_image.filename
        house.add_update()
    h_img = HouseImage()
    h_img.house_id = house_id
    h_img.url = house_image.filename
    h_img.add_update()
    imgs = HouseImage.query.filter(HouseImage.house_id == house_id).all()
    imgs_list = []
    for i in imgs:
        imgs_list.append(i.url)
    return jsonify(code=status_code.SUCCESS, imgs=imgs_list)






@blue_house.route('/house_area/',methods=['GET'])
def house_area():
    areas = Area.query.all()
    area_info = [area.to_dict() for area in areas]
    facilitys = Facility.query.all()
    facility_list = [facility.to_dict() for facility in facilitys]
    return jsonify(code=status_code.SUCCESS, area_info=area_info,facility_list=facility_list)


@blue_house.route('/house_info/',methods=['GET'])
@is_login
def house_info():
    user_id = session.get('user_id')
    houses = House.query.filter(House.user_id == user_id)
    house_info = [house.to_dict() for house in houses]
    return jsonify(code=status_code.SUCCESS,house_info=house_info)


@blue_house.route('/detail/',methods=['GET'])
def detail():
    return render_template('detail.html')


@blue_house.route('/detail/<int:id>/',methods=['GET'])
def house_detail(id):
    house = House.query.get(id)
    facilities = house.facilities
    facility_list = [facility.to_dict() for facility in facilities]
    booking=1
    if 'user_id' in session:
        if house.user_id == session['user_id']:
            booking=0
    return jsonify(code= status_code.SUCCESS, house=house.to_full_dict(), facility_list=facility_list,booking=booking)


@blue_house.route('/index/',methods=['GET'])
def index():
    return render_template('index.html')


@blue_house.route('/my_index/',methods=['GET'])
def my_index():
    # 获取登陆用户信息
    username= ''
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        username = user.name
    #  获取轮播图
    houses = House.query.filter(House.index_image_url !='').order_by('-id')[:3]
    house_info = [house.to_dict() for house in houses]
    return jsonify(code=status_code.SUCCESS, username=username, house_info=house_info)


@blue_house.route('/search/',methods=['GET'])
def search():
    return render_template('search.html')


@blue_house.route('/index_search/',methods=['GET'])
def index_search():
    aid = request.args.get('aid')
    sd = request.args.get('sd')
    ed = request.args.get('ed')
    sk = request.args.get('sk')
    # 获取指定区域内房屋信息
    houses = House.query.filter(House.area_id == aid)
    # 获取正在进行中的订单,剔除与时间冲突的订单
    order_list = Order.query.filter(Order.status.in_(['WAIT_ACCEPT', 'WAIT_PAYMENT', 'PAID']))
    order_1 = Order.query.filter(Order.begin_date >= sd,Order.end_date <= ed)
    order_2 = order_list.filter(Order.begin_date < sd,Order.end_date > ed)
    order_3 = order_list.filter(Order.begin_date >= sd, Order.end_date <= ed)
    order_4 = order_list.filter(Order.begin_date >= sd, Order.begin_date <=ed)
    house1 = [order.house_id for order in order_1]
    house2 = [order.house_id for order in order_2]
    house3 = [order.house_id for order in order_3]
    house4 = [order.house_id for order in order_4]
    no_show_house_id = list(set(house1+house2+house3+house4))
    houses = houses.filter(House.id.notin_(no_show_house_id))
    # 排序
    if sk =='new':
        houses = houses.order_by('-id')
    elif sk == 'booking':
        houses = houses.order_by('-order_count')
    elif sk == 'price-inc':
        houses = houses.order_by('price')

    house_info = [house.to_full_dict() for house in houses]
    return jsonify(code=status_code.SUCCESS, house_info=house_info)

