from http.server import HTTPServer, BaseHTTPRequestHandler
import re
import os
import json

from alternate_servers.python_server.server_database import ServerDatabase, User

two_up = os.path.abspath(os.path.join(__file__, "../../../"))

PORT = 9000




class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    data = {'authenticated': False, 'user': None}

    def _set_headers(self, success: bool = True, code: int = 200):

        if success:
            assert code == 200 or code == 201

        self.send_response(code)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

    def register(self, user_details):
        server_db = ServerDatabase()
        if user_details["email"] == "" or user_details["password"] == "":
            self.data["error"] = "Input fields can't be empty"
            raise Exception
        user_registered = server_db.register_user(User(user_details["email"], user_details["password"]))
        if user_registered[0] == False:
            self._set_headers(False, 401)
            self.data["error"] = user_registered[1]
        else:
            self._set_headers(True, 201)
            self.data["authenticated"] = True
            self.data["message"] = "Registration successful"
            self.data['user'] = {'id':user_registered[1][0],'email':user_registered[1][1]}

        server_db.close()

    def login(self, user_details):
        server_db = ServerDatabase()
        if user_details["email"] == "" or user_details["password"] == "":
            self.data["error"] = "Input fields can't be empty"
            raise Exception
        user_found = server_db.login_user(User(user_details["email"], user_details["password"]))
        if user_found[0] == False:
            print("user not found")
            self._set_headers(False, 401)
            self.data["error"] = "Invalid Credentials"
        else:
            self._set_headers()
            self.data["authenticated"] = True
            self.data['user'] = {'id':user_found[1][0],'email':user_found[1][1]}
        server_db.close()

    def do_GET(self):
        if re.search('/api/auth/login*', self.path) != None:
            self.data = {'authenticated': False, 'user': None}
            self._set_headers(False, 501)
            self.data["error"] = "Unsupported Method GET"
        else:
            self.data["error"] = "Invalid Endpoints"

        self.wfile.write(json.dumps(self.data).encode(encoding='utf_8'))

    def do_POST(self):
        print("handling POST request")
        self.data = {'authenticated': False, 'user': None}

        try:
            if re.search('/api/auth/login*', self.path) != None:
                if self.headers['Content-Length'] is None:
                    self.data['user'] = None
                    self.data['error'] = ""
                    self._set_headers(False, 400)

                else:
                    content_length = int(self.headers['Content-Length'])
                    content_type = self.headers['Content-Type']
                    request_raw = self.rfile.read(content_length).decode('utf-8')  # <--- received data
                    if content_length is None:
                        self.data["error"] = "Empty Request"
                        raise Exception
                    if content_type == "multipart/form-data":
                        self.data["error"] = "Expects a application/x-www-form-urlencoded or a text/plain"
                        raise Exception
                    else:
                        try:
                            request_data = json.loads(request_raw)
                        except json.decoder.JSONDecodeError:
                            self.data["error"] = "Invalid request"
                        try:
                            self.login(request_data)

                        except Exception as e:
                            raise e
            elif re.search('/api/auth/register*', self.path) != None:
                if self.headers['Content-Length'] is None:
                    self.data['user'] = None
                    self.data['error'] = ""
                    self._set_headers(False, 400)

                else:
                    content_length = int(self.headers['Content-Length'])
                    content_type = self.headers['Content-Type']
                    request_raw = self.rfile.read(content_length).decode('utf-8')  # <--- received data
                    if content_length is None:
                        self.data["error"] = "Empty Request"
                        raise Exception
                    if content_type == "multipart/form-data":
                        self.data["error"] = "Expects a application/x-www-form-urlencoded or a text/plain"
                        raise Exception
                    else:
                        try:
                            request_data = json.loads(request_raw)
                        except json.decoder.JSONDecodeError:
                            self.data["error"] = "Invalid request"
                        try:
                            self.register(request_data)

                        except Exception as e:
                            raise e


        except:
            self._set_headers(False, 401)
        print(self.data)
        self.wfile.write(json.dumps(self.data).encode(encoding='utf_8'))



def run(server_class=HTTPServer, handler_class=SimpleHTTPRequestHandler):
    server_address = ('', PORT)
    httpd = server_class(server_address, handler_class)
    print("Starting server on HOST {} on PORT {}".format(server_address[0], server_address[1]))
    httpd.serve_forever()


run()
