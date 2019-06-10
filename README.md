# pi-deck
**Version 0.2.0**

## Installation

1. Install the dependencies (see below)
2. Download the *PiHost* folder to the Host (raspberry)
3. Download the *PcClient.py* file to the computer you want to control (Client)



## Dependencies

#### Python 3.6 (or higher) with the following modules:

##### Host (raspberry):

- Django
- PyQt5

Commands to install:

> pip install PyQt5
>
> pip install django

##### Client (raspberry):

- webbrowser
- pyautogui

Commands to install:

> pip install webbrowser
>
> pip install pyautogui



## Usage

##### Basics

1. Open the *PiHos*t folder and execute *run.sh*
2. Execute the *PcClient.py* file on your other Computer (a command line window should pop up)
3. Type the IPv4-Address of your Host (raspberry) into the command line (visible in terminal of Host and should look like this: *192.168.XXX.XXX* the X's represent numbers)
4. A GUI should now be visible on your Host. You can now open websites and type texts by pressing one of the 12 buttons in it.

##### Customization

- To customize the buttons open your Webbrowser (on any Computer), open this page and log in:

  `192.168.XXX.XXX:8000`

  The numbers you need to replace the X's with is the same you put into the command window before

- To now customize one of the buttons do this:

  1. Select the button you want to change by clicking on it.
2. Click on one of the 4 blue command buttons *(Type, Press, Open in web, Open File)*
  3. Type the command you want to execute into the input field. (For example: *"www.google.com")*
4. (Optional) Use the *"choose file"* button to upload an image to the button.
  5. Press the *"Save Button"* Button to save your changes.



## Limitations/Known Issues

- Typing and pressing buttons needs root permission on linux

- To open a website in anything but Internet Explorer you need to type www in front of the url

- (Linux only) The Off button doesn't kill the webserver. To do that you need to type:

   `pkill -f runserver`

- If the connection between the two computers times out or one crashes you need to kill the GUI with alt+f4

  

## Contributors

Niklas Ziermann

## Copyright & License

**© Niklas Ziermann** 

**GNU GPLv3**

