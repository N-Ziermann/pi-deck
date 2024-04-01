# pi-deck

A stream deck alternative based on electron and react.

## Installation

Choose one of the builds from the release section that best fits your system and install it on the device you want to control.

You will also need to have python as well as the pynput module installed.

It is highly advised to add the pideck software to your autostart programms to allow your macros to work right when the computer starts.

## Configuration

When you open the pideck desktop app you will see an icon appear in your Tray/Taskbar.

Clicking it will allow you to open the configuration interface in which you can add macros to each of the buttons the pideck provides.

## Known Issues

- Keyboard shortcuts on MacOS will only work, if the programm is ran from the commandline, because of issues with OSX's accessibility API

## Using the pideck

When you're done configuring your pideck you can use your phone to head to the url displayed on the bottom right of the configuration panel.

Here you'll be able to execute the configured commands by pressing the any of your assigned buttons.

## Key Mappings

Defining key combinations requires you to know the shorthands for each non-letter-key you want to use. So here's a mapping of all relevant keys you might want to create macros for:

| Key                      | Shorthand         |
| ------------------------ | ----------------- |
| Alt                      | alt               |
| Alt (Gr)                 | alt_gr            |
| Alt (Left)               | alt_l             |
| Alt (Right)              | alt_r             |
| Backspace                | backspace         |
| CapsLock                 | caps_lock         |
| Command (Windows / Meta) | cmd               |
| Command (Left)           | cmd_l             |
| Command (Right)          | cmd_r             |
| Control                  | ctrl              |
| Control (Left)           | ctrl_l            |
| Control (Right)          | ctrl_r            |
| Delete                   | delete            |
| Down                     | down              |
| End                      | end               |
| Enter                    | enter             |
| Escape                   | esc               |
| F-Keys                   | f1, f2, ...       |
| Home (Pos-1)             | home              |
| Insert                   | insert            |
| Left                     | left              |
| Media Next               | media_next        |
| Media Play/Pause         | media_play_pause  |
| Media Previous           | media_previous    |
| Media Volume Down        | media_volume_down |
| Media Volume Mute        | media_volume_mute |
| Media Volume Up          | media_volume_up   |
| Menu / Application       | menu              |
| NumLock                  | num_lock          |
| Page Down                | page_down         |
| Page Up                  | page_up           |
| Pause                    | pause             |
| Print Screen             | print_screen      |
| Right                    | right             |
| ScrollLock               | scroll_lock       |
| Shift                    | shift             |
| Shift (Left)             | shift_l           |
| Shift (Right)            | shift_r           |
| Space                    | space             |
| Tab                      | tab               |
| Up                       | up                |

Note: These are the bindings from the pynput python module. If any of them dont work properly then it's most likely because of this library
