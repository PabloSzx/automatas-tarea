import webbrowser
import SimpleHTTPServer
import SocketServer
import os

PORT = 8500
Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
os.chdir("./build")

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
webbrowser.open('http://localhost:' + str(PORT))
httpd.serve_forever()
