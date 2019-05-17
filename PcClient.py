import socket, os, re
import webbrowser as wb
import keyboard as kb


s = socket.socket()
host = input("Type host's(stream deck) IPv4-Address: ")
port = 12345
s.connect((host, port))

# do what the other device told you to do

data = s.recv(1024).decode() # contains data of button pressed on other device

while data != "quit":
    
    if re.match("^web ", data):
        content = re.sub("^web ", "", data)
        wb.open(content, new=2)
    elif re.match("^type ", data):
        content = re.sub("^type ", "", data)
        kb.write(content)
    elif re.match("^press ", data):
        content = re.sub("^press ", "", data)
        kb.press_and_release(content)
    elif re.match("^open ", data):
        content = re.sub("^open ", "", data)
        os.startfile(content)

    #wait for next instruction:
    data = s.recv(1024).decode()

s.close()
quit()

    
    



    

