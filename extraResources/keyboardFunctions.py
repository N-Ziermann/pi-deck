import sys
from pynput.keyboard import Key, Controller

keyboard = Controller()
commandType = sys.argv[1]
commandContent = sys.argv[2:]

if commandType == "type":
    keyboard.type(commandContent[0])

if commandType == "press":
    for key in commandContent:
        if key in Key._member_names_:
            key = Key[key]
        keyboard.press(key);
    for key in reversed(commandContent):
        if key in Key._member_names_:
            key = Key[key]
        keyboard.release(key);


#     List of special Keys:
#
#     "alt",
#     "alt_gr",
#     "alt_l",
#     "alt_r",
#     "backspace",
#     "caps_lock",
#     "cmd",
#     "cmd_l",
#     "cmd_r",
#     "ctrl",
#     "ctrl_l",
#     "ctrl_r",
#     "delete",
#     "down",
#     "end",
#     "enter",
#     "esc",
#     "f1",
#     "home",
#     "insert",
#     "left",
#     "media_next",
#     "media_play_pause",
#     "media_previous",
#     "media_volume_down",
#     "media_volume_mute",
#     "media_volume_up",
#     "menu",
#     "num_lock",
#     "page_down",
#     "page_up",
#     "pause",
#     "print_screen",
#     "right",
#     "scroll_lock",
#     "shift",
#     "shift_l",
#     "shift_r",
#     "space",
#     "tab",
#     "up"
