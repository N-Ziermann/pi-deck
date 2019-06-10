import socket, os, re, pyautogui, multiprocessing
import webbrowser as wb


def open(content): # opens a file or program
    #check if need to use windows or linux command
    if os.name == "nt":
        os.startfile(content)
    else:
        #check if trying to open file or program
        if "/" in content:
            os.system("xdg-open " + content)
        else:
            os.system(content)


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
        pyautogui.typewrite(content)
    elif re.match("^press ", data):
        content = re.sub("^press ", "", data)
        keys = re.sub(" ", "", content).split("+")  # split content up into single keys
        for key in keys:    # hold down all keys
            pyautogui.keyDown(key)
        for key in keys:    # let go of all keys
            pyautogui.keyUp(key)
    elif re.match("^open ", data):
        content = re.sub("^open ", "", data)
        # open new process to prevent python from waiting for program to close
        p = multiprocessing.Process(target=open, args=(content,))
        p.start()

    #wait for next instruction:
    data = s.recv(1024).decode()

s.close()
quit()
