from utils.functions import get_alchemy_uri
from utils.settings import DATABASE


class Conf():
    SQLALCHEMY_DATABASE_URI = get_alchemy_uri(DATABASE)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_CONTENT_ON_EXCEPTION = False
    SECRET_KEY = 'ERTYUIO56789'