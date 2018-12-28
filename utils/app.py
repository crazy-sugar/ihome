from flask import Flask

from app.house_view import blue_house
from app.models import db
from app.order_views import blue_order
from app.user_views import blue
from utils.configs import Conf
from utils.settings import STATIC_PATH, TEMPLATE_PATH


def create_app():
    app = Flask(__name__,static_folder= STATIC_PATH, template_folder= TEMPLATE_PATH)
    app.config.from_object(Conf)
    app.register_blueprint(blueprint=blue,url_prefix='/user')
    app.register_blueprint(blueprint=blue_house,url_prefix='/house')
    app.register_blueprint(blueprint=blue_order,url_prefix='/order')
    db.init_app(app)
    return app
