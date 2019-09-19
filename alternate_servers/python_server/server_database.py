import urllib.parse as up
from sqlalchemy import create_engine, Column, Integer, String, text, exc
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

DATABASE_URL = "postgres://cochltcv:w90CheA-A1dPIMNYqtqZ56b0xUEi3Df4@salt.db.elephantsql.com:5432/cochltcv"
up.uses_netloc.append("postgres")
url = up.urlparse(DATABASE_URL)

engine = create_engine(DATABASE_URL)
Base = declarative_base(engine)


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    email = Column(String)
    password = Column(String)

    def __init__(self, email, password):
        self.email = email
        self.password = password


def loadSession():
    metadata = Base.metadata
    Session = sessionmaker(bind=engine)
    session = Session()
    return session


class ServerDatabase():

    def __init__(self):
        self.session = loadSession()
        self.connection = engine.connect()

    def check_if_user_exist(self,user:User):
        select_user = text("select * from users where email = :email and password = crypt(:password1,password)"
                           )
        registered_user = self.connection.execute(select_user, email=user.email, password1=user.password).fetchone()
        return registered_user
    def login_user(self, user: User):
        print("running log in")
        registered_user = self.check_if_user_exist(user)
        if registered_user is None:
            print("user not registered")
            return (False,None)
        print("user registered")
        return (True,registered_user)

    def register_user(self, user: User):
        user_exist = False

        for registered_user in self.list_all_user():
            if user.email == registered_user.email:
                user_exist = True

                break
        if user_exist:
            return (False,"User already exist")
        else:
            try:
                add_user = text("insert into users(email,password) values(:email,crypt(:password ,gen_salt(:bf)))"
                                )

                self.connection.execute(add_user, email=user.email, password=user.password, bf="bf")
                return (True,self.check_if_user_exist(user))
            except:
                return (False,"Server Error")



    def list_all_user(self):
        res = self.session.query(User).all()

        return res

    def close(self):
        global engine
        self.session.close()
        engine= create_engine(DATABASE_URL,poolclass = NullPool)
