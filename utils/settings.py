import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_PATH = os.path.join(BASE_DIR,'static')
TEMPLATE_PATH = os.path.join(BASE_DIR,'templates')
MEDIA_PATH = os.path.join(STATIC_PATH,'media')
UPLOAD_PATH = os.path.join(MEDIA_PATH,'upload')


DATABASE = {
    'NAME': 'ihome',
    'USER': 'root',
    'PORT': 3306,
    'HOST': '127.0.0.1',
    'ENGINE': 'mysql',
    'DRIVER': 'pymysql',
    'PASSWORD': '123456'
}