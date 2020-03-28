import sqlite3 as sql
import sys, socket, os
from PyQt5.QtGui import QIcon, QFont
from PyQt5.QtWidgets import QApplication, QWidget, QPushButton, QLabel
from PyQt5.QtCore import QSize


class Window(QWidget):

    def __init__(self):
        self.activeFolder = commands
        super(Window, self).__init__()
        self.images = []
        self.initUI()


    def initUI(self):
        screen = app.primaryScreen()
        size = screen.size()
        sWidth = size.width()
        sHeight = size.height()
        self.menuHeight = sHeight/10
        self.buttonWidth = sWidth/4
        self.buttonHeight = (sHeight-self.menuHeight)/3  # subtraction to make place for top menu bar

        self.setGeometry(50, 50, sWidth, sHeight)

        # draw buttons
        self.buttons = []
        x = 0
        y = self.menuHeight
        for i in range(0, 12):
            self.buttons.append(QPushButton('', self))
            self.buttons[i].resize(self.buttonWidth, self.buttonHeight)
            self.buttons[i].move(x, y)
            x += sWidth/4
            if x >= sWidth:
                x = 0
                y += self.buttonHeight

        #draw topMenu Buttons
        self.killSwitch = QPushButton('', self)
        self.killSwitch.resize(self.menuHeight, self.menuHeight)
        self.killSwitch.setIconSize(QSize(self.menuHeight, self.menuHeight))

        self.downloadButton = QPushButton('', self)
        self.downloadButton.resize(self.menuHeight, self.menuHeight)
        self.downloadButton.move(self.menuHeight, 0)
        self.downloadButton.setIconSize(QSize(self.menuHeight, self.menuHeight))

        # tell each button what to do
        self.buttons[0].clicked.connect(self.onB0)
        self.buttons[1].clicked.connect(self.onB1)
        self.buttons[2].clicked.connect(self.onB2)
        self.buttons[3].clicked.connect(self.onB3)
        self.buttons[4].clicked.connect(self.onB4)
        self.buttons[5].clicked.connect(self.onB5)
        self.buttons[6].clicked.connect(self.onB6)
        self.buttons[7].clicked.connect(self.onB7)
        self.buttons[8].clicked.connect(self.onB8)
        self.buttons[9].clicked.connect(self.onB9)
        self.buttons[10].clicked.connect(self.onB10)
        self.buttons[11].clicked.connect(self.onB11)
        self.killSwitch.clicked.connect(self.kill)
        self.downloadButton.clicked.connect(self.download)

        # prepare buttons for displaying images
        for i in range(0, 12):
            self.buttons[i].setIconSize(QSize(self.buttonWidth - 20, self.buttonHeight - 20))# -20 prevents overlaps with button

        # set button icons
        self.download()
        self.killSwitch.setIcon(QIcon(file_dir + "baseImgs/Off.png"))
        self.downloadButton.setIcon(QIcon(file_dir + "baseImgs/Download.png"))

        #show gui on screen
        self.showFullScreen()

    #command of every button
    def onB0(self):
        print(commands[0])
        c.send(commands[0].encode())

    def onB1(self):
        print(commands[1])
        c.send(commands[1].encode())

    def onB2(self):
        print(commands[2])
        c.send(commands[2].encode())

    def onB3(self):
        print(commands[3])
        c.send(commands[3].encode())

    def onB4(self):
        print(commands[4])
        c.send(commands[4].encode())

    def onB5(self):
        print(commands[5])
        c.send(commands[5].encode())

    def onB6(self):
        print(commands[6])
        c.send(commands[6].encode())

    def onB7(self):
        print(commands[7])
        c.send(commands[7].encode())

    def onB8(self):
        print(commands[8])
        c.send(commands[8].encode())

    def onB9(self):
        print(commands[9])
        c.send(commands[9].encode())

    def onB10(self):
        print(commands[10])
        c.send(commands[10].encode())

    def onB11(self):
        print(commands[11])
        c.send(commands[11].encode())

    def kill(self):
        c.send("quit".encode())
        s.close()
        if os.name != "nt":
            os.system("pkill -f runserver")
        quit()

    def download(self):
        #get data from db table
        conn = sql.connect(file_dir + "db.sqlite3")
        c = conn.cursor()
        c.execute("SELECT * FROM " + appName + "_" + className)
        data = c.fetchall() #index,cmd,img
        conn.close()

        #split db collumns into individual info
        for i in range(len(data)):
            commands[i] = data[i][1]
            imgs[i] = data[i][2]

        # make buttons display images
        for i in range(len(imgs)):
            if imgs[i] != "":
                self.buttons[i].setIcon(QIcon(imgDir + imgs[i]))
            else:
                self.buttons[i].setIcon(QIcon())


if __name__ == "__main__":
    file_dir = os.path.dirname(os.path.abspath(__file__)) + "/"
    imgDir = file_dir + 'main/media/'
    appName = 'main'
    className = 'button'
    commands = [""] * 12
    imgs = [""] * 12

    # Connect to googles DNS to get my IP(one can assume it won't change for now)
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    myIp = s.getsockname()[0]
    print("Stream Deck IP: " + myIp)

    # Open socket for PC to connect to
    s = socket.socket()
    host = '0.0.0.0'
    port = 12345
    s.bind((host, port))
    s.listen(5)
    c, addr = s.accept()
    print(c)
    print('Got connection from', addr)

    #open GUI
    app = QApplication(sys.argv)
    w = Window()
    sys.exit(app.exec_())
