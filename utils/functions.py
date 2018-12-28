import random
from functools import wraps

from flask import session, url_for
from werkzeug.utils import redirect

from utils.settings import DATABASE


def get_alchemy_uri(DATABASE):
    # 格式mysql+pymysql://root:123456@127.0.0.1:3306/flaskhello

    engine = DATABASE['ENGINE']
    driver = DATABASE['DRIVER']
    user = DATABASE['USER']
    password = DATABASE['PASSWORD']
    host = DATABASE['HOST']
    port = DATABASE['PORT']
    name = DATABASE['NAME']

    return '%s+%s://%s:%s@%s:%s/%s' % (engine,driver,user,password,host,port,name)


def generateImgCode():
    seed = 'qwwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKZXCVBNM'
    imgcode = ''
    for i in range(4):
        imgcode += random.choice(seed)
    session['code'] = imgcode
    return imgcode


def is_login(func):
    '''
    外部函数内嵌内部函数，内部函数调用外部函数局部变量，外部函数返回内部函数
    '''
    @wraps(func)
    def check_status(*args,**kargs):
        try:
            session['user_id']
        except:
            return redirect(url_for('user.login'))
        return func(*args,**kargs)
    return check_status

