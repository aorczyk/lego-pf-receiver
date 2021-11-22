# Power Functions Receiver

Receiving commands from LEGO Power Functions remote controls using IR Receiver Module Iduino ST1089. Running given function when specific button is pressed or released.

### Features:
- all Power Functions remote controls are supported
- possibility to run action on RC button pressed or released
- recording commands from given channels, which could be played by extension [PF Recorder](https://github.com/aorczyk/pf-recorder)

### References:
- [LEGO Power Functions RC](https://www.philohome.com/pf/LEGO_Power_Functions_RC.pdf)

## :warning: Warning!
**Lighting the diode and the IR receiver with sunlight :sunny: or from an ordinary light bulb :bulb: may interfere with the signal reception.**


# Documentation

## pfReceiver.connectIrReceiver

Connects to the IR receiver module at the specified digital pin.

```sig
pfReceiver.connectIrReceiver(DigitalPin.P2)
```
### Parameters

- `pin` - the digital pin where ir receiver module is connected


## pfReceiver.onCommand

Do something when a specific command is sent.

```sig
pfReceiver.onCommand(0, 0b110, 0b100, PfAction.Pressed, () => {
    basic.showIcon(IconNames.Happy)
})
```

### Parameters
- `mode` - the mode (binary eg. 0b100)
- `data` - the data (binary eg. 0b0101) or -1 (triggers all events)
- `action` - the trigger action (Pressed or Released)
- `handler` - the body code to run when the event is raised


## pfReceiver.onSpeedRCcommand

Do something when a specific button is pressed or released on the PF speed remote control.

```sig
pfReceiver.onSpeedRCcommand(PfReceiverChannel.Channel1, PfSpeedControl.RedIncrement, PfAction.Pressed, () => {
    counter += 1;
})
```

### Parameters
- `channel` - the channel switch 0-3
- `button` - the button
- `action` - the trigger action (Pressed or Released)
- `handler` - the body code to run when the event is raised


## pfReceiver.onRCcommand

Do something when a specific state of buttons on the PF remote control is achieved.

```sig
pfReceiver.onRCcommand(PfReceiverChannel.Channel1, PfControl.Forward, PfControl.Float, PfAction.Pressed, () => {
    basic.showIcon(IconNames.SmallHeart)
})
```

### Parameters
- `channel` - the channel switch 0-3
- `red` - the state of the red output button
- `blue` - the state of the blue output button
- `action` - the trigger action (Pressed or Released)
- `handler` - the body code to run when the event is raised


## pfReceiver.startRecord

Starts saving commands from the PF remote controls from given channels.

```sig
pfReceiver.startRecord([0]);
```

### Parameters
- `channels` - the array with channels number (0-3) to record with


## pfReceiver.stopRecord

Stops saving commands.

```sig
pfReceiver.stopRecord();
```

## pfReceiver.getRecordedCommands

Returns recorded commands.

```sig
pfReceiver.getRecordedCommands();
```


## MakeCode Example

```blocks
pfReceiver.connectIrReceiver(DigitalPin.P2)

pfReceiver.onRCcommand(PfReceiverChannel.Channel1, PfControl.Forward, PfControl.Float, PfAction.Pressed, () => {
    basic.showIcon(IconNames.Heart)
})

pfReceiver.onRCcommand(PfReceiverChannel.Channel1, PfControl.Forward, PfControl.Float, PfAction.Released, () => {
    basic.clearScreen()
})
```

## Disclaimer

LEGO® is a trademark of the LEGO Group of companies which does not sponsor, authorize or endorse this project.

## License

Copyright (C) 2021 Adam Orczyk

Licensed under the MIT License (MIT). See LICENSE file for more details.

## Supported targets

* for PXT/microbit