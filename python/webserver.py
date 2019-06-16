import threading
import subprocess
import json
import os
from base64 import decodestring

try: 
	from http.server import HTTPServer, SimpleHTTPRequestHandler # Python 3
except ImportError: 
	from SimpleHTTPServer import BaseHTTPServer
	HTTPServer = BaseHTTPServer.HTTPServer
	from SimpleHTTPServer import SimpleHTTPRequestHandler # Python 2
try: 
	input = raw_input  # Python 2
except NameError: 
	pass

HTTP_IP = '192.168.1.72'
HTTP_PORT_FILES = 2999
HTTP_PORT_APP = 3000
f_target = 'results'

if not os.path.isdir(f_target):
	os.makedirs(f_target)

class Handler(SimpleHTTPRequestHandler):
	
	def json_headers(self):
		self.send_response(200)
		self.send_header("Cache-Control", "no-cache")
		self.send_header("Access-Control-Allow-Origin", "*")
		self.send_header("Access-Control-Allow-Methods", "POST, GET")
		self.send_header("Access-Control-Allow-Headers", " X-Custom-Header")
		self.send_header('Content-type', 'application/json')
		self.end_headers()
		
	def do_GET(self):
		
		# Get parameters in query.
		out = 'back-end for BLOOM, a decentralized Renderfarm by simone niquille &amp; yannick grégoire'
		# Construct a server response.
		self.send_response(200)
		self.send_header('Content-Type', 'text/html')
		self.end_headers()
		self.wfile.write(out.encode("utf-8"))
		return
	
	def do_POST(self):
		
		self.data_string = self.rfile.read(int(self.headers['Content-Length']))
		self.json_headers()
		try:
			
			d = json.loads(self.data_string.decode())
			
			if not ( 'data' in d and 'filename' in d ):
				print('Incorrect content, should contains a field "data" and "filename!"')
				return
			
			print( "Extracting content to " + f_target + d['filename'] )
			
			with open( f_target + d['filename'],"wb") as f:
				f.write(decodestring(d['fdata']))
			
		except Exception as error:
			print( "BOOOM! " + str(error) )
		
		return
	
server_files = HTTPServer((HTTP_IP, HTTP_PORT_FILES), SimpleHTTPRequestHandler)
thread_files = threading.Thread(target = server_files.serve_forever)
thread_files.daemon = True
thread_files.start()

server_app = HTTPServer((HTTP_IP, HTTP_PORT_APP), Handler)
thread_app = threading.Thread(target = server_app.serve_forever)
thread_app.daemon = True
thread_app.start()

def do_shutdown():
	server_files.shutdown()
	server_app.shutdown()

print('file server running on port {}'.format(server_files.server_port))
print('app server running on port {}'.format(server_app.server_port))

input("Press enter to shutdown server: ")

do_shutdown()