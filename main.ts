const enum RCbutton {
    Any = -1,
    Red_Float = 10000,
    Red_Forward = 10001,
    Red_Backward = 10010,
    Red_Break = 10011,

    Blue_Float = 10000,
    Blue_Forward = 10100,
    Blue_Backward = 11000,
    Blue_Break = 11100,
}

const enum SpeedRCbutton {
    Any = -1,
    Red_Increment = 1100100,
    Red_Decrement = 1100101,
    Red_Brake = 1001000,

    Blue_Increment = 1110100,
    Blue_Decrement = 1110101,
    Blue_Brake = 1011000,
}

const enum IrButtonAction {
    //% block="pressed"
    Pressed = 0,
    //% block="released"
    Released = 1,
}

//% color=#f68420 icon="\uf09e" block="PF IR Receiver"
namespace pfReceiver {
    const PF_RECEIVER_IR_BUTTON_PRESSED_ID = 789;
    const PF_RECEIVER_IR_BUTTON_RELEASED_ID = 790;

    let bitsReceived = 0;
    let nibble1: uint8 = null;
    let nibble2: uint8 = null;
    let lrc: uint8 = null;
    let toggle: uint8 = null;
    let escape: uint8 = null;
    let channel: uint8 = null;
    let address: uint8 = null;
    let mode: uint8 = null;
    let data: uint8 = null;
    let newCommand: number = null;
    let activeCommand: number = null;
    let lastToggle: uint8 = null;
    let bits: number[] = [];

    function bin_to_dec(bstr: number) {
        return parseInt((bstr + ''), 2);
    }

    function resetState() {
        bitsReceived = 0;
        nibble1 = null;
        nibble2 = null;
        lrc = null;
        toggle = null;
        escape = null;
        channel = null;
        address = null;
        mode = null;
        data = null;
        bits = [];
    }

    function appendBitToDatagram(bit: number): void {
        bitsReceived += 1;
        bits.push(bit);

        if (bitsReceived <= 4) {
            nibble1 = (nibble1 << 1) + bit;
        } else if (bitsReceived <= 8) {
            nibble2 = (nibble2 << 1) + bit;
        } else if (bitsReceived <= 12) {
            data = (data << 1) + bit;
        } else if (bitsReceived <= 16) {
            lrc = (lrc << 1) + bit;
        }

        if (bitsReceived == 1) {
            toggle = (toggle << 1) + bit;
        } else if (bitsReceived == 2) {
            escape = (escape << 1) + bit;
        } else if (bitsReceived <= 4) {
            channel = (channel << 1) + bit;
        } else if (bitsReceived == 5) {
            address = (address << 1) + bit;
        } else if (bitsReceived <= 8) {
            mode = (mode << 1) + bit;
        }
    }

    function getCommand(channel: number, mode: number, data: number) {
        let out = ((channel << 3) + mode << 4) + data;
        return out;
    }

    function process() {
        if (bitsReceived === 16 && (15 ^ nibble1 ^ nibble2 ^ data) === lrc) {
            newCommand = getCommand(channel, mode, data);

            if (lastToggle != toggle) {// || mode == 1
                if (activeCommand >= 0) {
                    control.raiseEvent(
                        PF_RECEIVER_IR_BUTTON_RELEASED_ID,
                        activeCommand
                    );
                }

                activeCommand = newCommand;
                control.raiseEvent(
                    PF_RECEIVER_IR_BUTTON_PRESSED_ID,
                    newCommand
                );
                lastToggle = toggle;

                serial.writeNumbers([channel, mode, data, newCommand])
                serial.writeNumbers(bits)
            }
        }
        resetState()
    }

    function decode(markAndSpace: number): void {
        if (markAndSpace < 526) {
            // low bit
            appendBitToDatagram(0)
        } else if (markAndSpace < 947) {
            // high bit
            appendBitToDatagram(1)
        } else if (markAndSpace < 1579) {
            process()
        }
    }

    function showBits(bits: number[]) {
        basic.clearScreen();
        let x: number = 0;
        let y: number = 0;
        for (let i = 0; i < 16; i++) {
            if (bits[i]) {
                led.plot(x, y);
            }

            x += 1
            if (x > 3) {
                x = 0
                y += 1
            }
        }
    }

    function enableIrMarkSpaceDetection(pin: DigitalPin) {
        pins.setPull(pin, PinPullMode.PullNone);

        let mark = 0;
        let space = 0;

        pins.onPulsed(pin, PulseValue.Low, () => {
            // HIGH, see https://github.com/microsoft/pxt-microbit/issues/1416
            mark = pins.pulseDuration();
        });

        pins.onPulsed(pin, PulseValue.High, () => {
            // LOW
            space = pins.pulseDuration();
            decode(mark + space);
        });
    }

    /**
     * Connects to the IR receiver module at the specified pin.
     * @param pin IR receiver pin, eg: DigitalPin.P0
     */
    //% blockId="pfReceiver_infrared_connect_receiver"
    //% block="connect IR receiver at pin %pin"
    //% pin.fieldEditor="gridpicker"
    //% pin.fieldOptions.columns=4
    //% pin.fieldOptions.tooltips="false"
    //% weight=90
    export function connectIrReceiver(
        pin: DigitalPin
    ): void {
        enableIrMarkSpaceDetection(pin);
    }

    /**
     * Do something when a specific button is pressed or released on the remote control.
     * @param channel the channel switch 0-3
     * @param mode the mode (binary)
     * @param data the data (binary) or -1 (triggers all events)
     * @param action the trigger action
     * @param handler body code to run when the event is raised
     */
    //% blockId=pfReceiver_infrared_on_ir_command
    //% block="on IR command, channel %channel, mode %mode, data %data | %action"
    //% weight=50
    export function onIrCommand(
        channel: number,
        mode: number,
        data: number,
        action: IrButtonAction,
        handler: () => void
    ) {
        let command = getCommand(channel, bin_to_dec(mode), bin_to_dec(data));

        control.onEvent(
            action === IrButtonAction.Pressed
                ? PF_RECEIVER_IR_BUTTON_PRESSED_ID
                : PF_RECEIVER_IR_BUTTON_RELEASED_ID,
            data === -1 ? EventBusValue.MICROBIT_EVT_ANY : command,
            () => {
                handler();
            }
        );
    }

    export function onSpeedRCcommand(
        channel: number,
        button: SpeedRCbutton,
        action: IrButtonAction,
        handler: () => void
    ) {
        let command = (channel << 7) + bin_to_dec(button);

        control.onEvent(
            action === IrButtonAction.Pressed
                ? PF_RECEIVER_IR_BUTTON_PRESSED_ID
                : PF_RECEIVER_IR_BUTTON_RELEASED_ID,
            button === -1 ? EventBusValue.MICROBIT_EVT_ANY : command,
            () => {
                handler();
            }
        );
    }

    export function onRCcommand(
        channel: number,
        button: RCbutton,
        action: IrButtonAction,
        handler: () => void
    ) {
        let command = (channel << 7) + bin_to_dec(button);

        control.onEvent(
            action === IrButtonAction.Pressed
                ? PF_RECEIVER_IR_BUTTON_PRESSED_ID
                : PF_RECEIVER_IR_BUTTON_RELEASED_ID,
            button === -1 ? EventBusValue.MICROBIT_EVT_ANY : command,
            () => {
                handler();
            }
        );
    }
}

// Test

let counter = 0;
pfReceiver.connectIrReceiver(DigitalPin.P2)

// pfReceiver.onIrCommand(0, 110, 100, IrButtonAction.Pressed, () => {
//     counter += 1;
//     basic.showNumber(counter)
// })

// pfReceiver.onIrCommand(0, 110, 101, IrButtonAction.Pressed, () => {
//     counter -= 1;
//     basic.showNumber(counter)
// })

// pfReceiver.onIrCommand(0, 100, 1000, IrButtonAction.Pressed, () => {
//     counter = 0;
//     basic.showNumber(counter)
// })

pfReceiver.onSpeedRCcommand(0, SpeedRCbutton.Red_Increment, IrButtonAction.Pressed, () => {
    counter += 1;
    basic.showNumber(counter)
})

pfReceiver.onSpeedRCcommand(0, SpeedRCbutton.Red_Decrement, IrButtonAction.Pressed, () => {
    counter -= 1;
    basic.showNumber(counter)
})

pfReceiver.onSpeedRCcommand(0, SpeedRCbutton.Red_Brake, IrButtonAction.Pressed, () => {
    counter = 0;
    basic.showNumber(counter)
})


pfReceiver.onSpeedRCcommand(0, SpeedRCbutton.Blue_Increment, IrButtonAction.Pressed, () => {
    counter += 2;
    basic.showNumber(counter)
})

pfReceiver.onSpeedRCcommand(0, SpeedRCbutton.Blue_Decrement, IrButtonAction.Pressed, () => {
    counter -= 2;
    basic.showNumber(counter)
})

pfReceiver.onSpeedRCcommand(0, SpeedRCbutton.Blue_Brake, IrButtonAction.Pressed, () => {
    counter = 2;
    basic.showNumber(counter)
})

// ---

pfReceiver.onRCcommand(0, RCbutton.Red_Forward, IrButtonAction.Pressed, () => {
    counter += 1;
    basic.showNumber(counter)
})

pfReceiver.onRCcommand(0, RCbutton.Red_Forward, IrButtonAction.Released, () => {
    basic.showIcon(IconNames.Happy)
})

pfReceiver.onRCcommand(0, RCbutton.Red_Backward, IrButtonAction.Pressed, () => {
    counter -= 1;
    basic.showNumber(counter)
})