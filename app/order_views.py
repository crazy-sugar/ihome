from datetime import datetime

from flask import Blueprint, render_template, request, session, jsonify

from app.models import Order, House
from utils import status_code
from utils.functions import is_login

blue_order = Blueprint('order', __name__)


@blue_order.route('/orders/', methods=['GET'])
def orders():
    return render_template('orders.html')


@blue_order.route('/booking/',methods=['GET'])
def booking():
    return render_template('booking.html')


@blue_order.route('/book_info/',methods=['POST'])
def book_info():
    begin_date = datetime.strptime(request.form.get('begin_date'),'%Y-%m-%d')
    end_date = datetime.strptime(request.form.get('end_date'),'%Y-%m-%d')
    # 获取当前用户和房屋id，创建订单对象
    user_id = session['user_id']
    house_id = request.form.get('house_id')
    house = House.query.get(house_id)
    order = Order()
    order.user_id = user_id
    order.house_id = house_id
    order.begin_date = begin_date
    order.end_date = end_date
    order.days = (end_date-begin_date).days
    order.amount = order.days* house.price
    order.house_price =house.price
    order.add_update()
    return jsonify(status_code.SUCCESS)


@blue_order.route('/my_orders/',methods=['GET'])
@is_login
def my_orders():
    # 获取当前用户
    user_id = session['user_id']
    orders = Order.query.filter(Order.user_id==user_id).all()
    order_info = [order.to_dict() for order in orders]
    return jsonify(code=status_code.SUCCESS,order_info=order_info)


@blue_order.route('/my_orders/',methods=['POST'])
def order_comment():
    comment = request.form.get('comment')
    order_id = request.form.get('order_id')
    order = Order.query.get(order_id)
    order.comment = comment
    order.add_update()
    return jsonify(code=status_code.SUCCESS)



@blue_order.route('/lorders/', methods=['GET'])
def lorders():
    return render_template('lorders.html')


@blue_order.route('/lorders_info/',methods=['GET'])
@is_login
def lorders_info():
    houses = House.query.filter(House.user_id==session['user_id'])
    house_ids = [house.id for house in houses]
    orders = Order.query.filter(Order.house_id.in_(house_ids))
    lorder_info = [order.to_dict() for order in orders]
    return jsonify(code=status_code.SUCCESS, lorder_info=lorder_info)