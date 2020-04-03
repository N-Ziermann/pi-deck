import socket, os, re, multiprocessing
import webbrowser as wb
# fix keyboard on linux
if os.name != "nt":
    os.system("xhost +")
import keyboard as kb

def linuxopen(content): # opens a file or program as seperate process
    if "/" in content:
        os.system("xdg-open " + content)
    else:
        os.system(content)


s = socket.socket()
host = input("Type host's(stream deck) IPv4-Address: ")
port = 12345
s.connect((host, port))

# do what the other device told you to do
data = s.recv(1024).decode(encoding='UTF-8') # contains data of button pressed on other device
while data != "quit":

    if re.match("^web ", data):
        content = re.sub("^web ", "", data)
        wb.open(content, new=2)
    elif re.match("^type ", data):
        content = re.sub("^type ", "", data)
        print(bytes(content,"UTF-8"))
        content = bytes(content,"UTF-8").replace(b'\\n',b'\n').replace(b'\\t',b'\t').decode()
        print(content)
        kb.write(content)
    elif re.match("^press ", data):
        content = re.sub("^press ", "", data)
        keys = re.sub(" ", "", content).split("+")  # split content up into single keys
        for key in keys:    # hold down all keys
            kb.press(key)
        for key in keys:    # let go of all keys
            kb.release(key)
    elif re.match("^open ", data):
        content = re.sub("^open ", "", data)
        # check what os' cmd needs to be used
        if os.name == "nt":
            os.startfile(content)
        else:
            # start seperate process as linux's python would otherwise freeze
            p = multiprocessing.Process(target=linuxopen, args=(content,))
            p.start()

    # wait for next instruction:
    data = s.recv(1024).decode()

s.close()
quit()
