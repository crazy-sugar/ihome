import os
import re
from io import BytesIO
from flask import Blueprint, render_template, session, request, jsonify, make_response
from flask_wtf.csrf import generate_csrf
from utils.captcha import Captcha
from app.models import db, User
from utils import status_code
from utils.functions import is_login
from utils.settings import MEDIA_PATH, UPLOAD_PATH

blue = Blueprint('user', __name__)


@blue.route('/create_db/')
def create_db():
    db.create_all()
    return 'ok'


@blue.route('/index/')
def index():
    return render_template('index.html')


@blue.route('/register/',methods=['GET','POST'])
def register():

    if request.method == 'GET':
        return render_template('register.html')

    if request.method == 'POST':
        phone = request.form.get('mobile')
        imagecode = request.form.get('imagecode')
        # phonecode = request.form.get('phonecode')
        password = request.form.get('password')
        password2 = request.form.get('password2')
        # 校验字段完整
        if not all([phone,imagecode,password,password2]):
            return jsonify(status_code.USER_LOGIN_PARAMS_IS_INVALID)
        # 校验字段
        if password != password2:
            return jsonify(status_code.USER_OR_PASSWORD_INCORRECT)
        if imagecode != session.get('text'):
            return jsonify(status_code.THE_VERIFICATION_CODE_IS_INCORRECT)
        result = re.match(r'1[3456789]\d{9}',phone)
        if not result:
            return jsonify(status_code.TELPHONE_INCORRECT)
        user = User.query.filter(User.phone == phone).first()
        if not user:
            # 数据库存储注册
            user = User()
            user.phone = phone
            user.password = password
            user.add_update()
            return jsonify(status_code.SUCCESS)
        else:
            return jsonify(status_code.USER_EXISTS)


@blue.route('/login/', methods=['GET'])
def login():
    return render_template('login.html')


@blue.route('/login/',methods=['POST'])
def my_login():
    phone = request.form.get('mobile')
    password = request.form.get('password')
    # 校验字段
    if not all([phone,password]):
        return jsonify(status_code.USER_LOGIN_PARAMS_IS_INVALID)
    # 校验数据库
    user = User.query.filter(User.phone == phone).first()
    if not user:
        return jsonify(status_code.USER_Unauthorized)
    result = user.check_pwd(password)
    if not result:
        return jsonify(status_code.USER_OR_PASSWORD_INCORRECT)
    session['user_id']= user.id
    return jsonify(status_code.SUCCESS)


@blue.route('/my/',methods=['GET'])
def my():
    return render_template('my.html')


@blue.route('/my_info/',methods=['GET'])
def my_info():
    user_id = session.get('user_id')
    user = User.query.get(user_id)
    return jsonify(user.to_basic_dict())


@blue.route('/captcha/')
def graph_captcha():
   text, image = Captcha.gen_graph_captcha()
   out = BytesIO()
   image.save(out, 'png')
   out.seek(0)
   resp = make_response(out.read())
   resp.content_type = 'image/png'
   session['text']=text
   return resp


# @blue.after_request
# def after_request(response):
#     csrf_token = generate_csrf()
#     response.set_cookie('csrf-token', csrf_token)
#     return response


@blue.route('/profile/', methods=['GET'])
@is_login
def profile():
    return render_template('profile.html')


@blue.route('/profile/', methods=['PATCH'])
@is_login
def my_profile():
    user_id = session.get('user_id')
    avatar = request.files.get('avatar')
    if avatar:
        # 保存图片到media/upload
        path = os.path.join(UPLOAD_PATH, avatar.filename)
        avatar.save(path)
    user = User.query.get(user_id)
    user.avatar = os.path.join('upload', avatar.filename)
    user.add_update()
    return jsonify(code=status_code.SUCCESS, user_info=user.to_basic_dict())


@blue.route('/profile/', methods=['POST'])
@is_login
def profile_name():
    username = request.form.get('username')
    user_id = session.get('user_id')
    user = User.query.get(user_id)
    user.name= username
    user_info = user.add_update()
    return jsonify(code=status_code.SUCCESS,user_info=user.to_basic_dict())


@blue.route('/auth/',methods=['GET'])
def auth():
    return render_template('auth.html')


@blue.route('/auth/',methods=['POST'])
@is_login
def my_auth():
    real_name = request.form.get('real_name')
    id_card = request.form.get('id_card')
    if not all([real_name,id_card]):
        return jsonify(status_code.INFORMATION_UNCOMPLETED)
    result = re.match(r'[\u4e00-\u9fa5]+', real_name)
    if not result:
        return jsonify(status_code.NAME_UNAUTHORIZED)
    cid = re.match(r'^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$', id_card)
    if not cid:
        return jsonify(status_code.ID_UNAUTHORIZED)
    user_id = session.get('user_id')
    user = User.query.get(user_id)
    user.id_name = real_name
    user.id_card = id_card
    user.add_update()
    return jsonify(code=status_code.SUCCESS, user_info=user.to_auth_dict())


@blue.route('/my_auth_info/',methods=['GET'])
@is_login
def my_auth_info():
    user_id = session.get('user_id')
    user = User.query.get(user_id)
    return jsonify(code=status_code.SUCCESS, user_info=user.to_auth_dict())
















