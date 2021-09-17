const enum RCbutton {
    //% block="Float"
    Float = 0b0,
    //% block="Forward"
    Forward = 0b1,
    //% block="Backward"
    Backward = 0b10,
    //% block="Break"
    Break = 0b11,
}

const enum SpeedRCbutton {
    //% block="Any"
    Any = -1,
    //% block="Red Increment"
    Red_Increment = 0b1100100,
    //% block="Red Decrement"
    Red_Decrement = 0b1100101,
    //% block="Red Break"
    Red_Brake = 0b1001000,

    //% block="Blue Increment"
    Blue_Increment = 0b1110100,
    //% block="Blue Decrement"
    Blue_Decrement = 0b1110101,
    //% block="Blue Break"
    Blue_Brake = 0b1011000,
}

const enum IrButtonAction {
    //% block="Pressed"
    Pressed = 0,
    //% block="Released"
    Released = 1,
}

//% color=#f68420 icon="\uf09e" block="PF IR Receiver"
namespace pfReceiver {
    const PF_RECEIVER_IR_BUTTON_PRESSED_ID = 789;
    const PF_RECEIVER_IR_BUTTON_RELEASED_ID = 790;

    export let debug: boolean = false;
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
        let out = (channel << 7) | (mode << 4) | data;
        return out;
    }

    function process() {
        if (bitsReceived === 16 && (15 ^ nibble1 ^ nibble2 ^ data) === lrc) {
            newCommand = getCommand(channel, mode, data);
            
            if (debug){
                serial.writeNumbers(bits)
                serial.writeNumbers([channel, mode, data, newCommand])
            }

            if (lastToggle != toggle || (mode == 1 && activeCommand != newCommand)) {
                if (activeCommand >= 0) {
                    control.raiseEvent(
                        PF_RECEIVER_IR_BUTTON_RELEASED_ID,
                        activeCommand
                    );
                }

                control.raiseEvent(
                    PF_RECEIVER_IR_BUTTON_PRESSED_ID,
                    newCommand
                );

                activeCommand = newCommand;
                lastToggle = toggle;
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
    //% weight=100
    export function connectIrReceiver(
        pin: DigitalPin
    ): void {
        enableIrMarkSpaceDetection(pin);
        resetState();
    }

    /**
     * Do something when a specific command is sent.
     * @param channel the channel switch 1-4
     * @param mode the mode (binary eg. 0b100)
     * @param data the data (binary eg. 0b0101) or -1 (triggers all events)
     * @param action the trigger action
     * @param handler body code to run when the event is raised
     */
    //% blockId=pfReceiver_on_command
    //% block="on IR command: channel %channel | mode %mode | data %data | %action"
    //% channel.min=1 channel.max=4 channel.defl=1
    //% weight=50
    export function onCommand(
        channel: number,
        mode: number,
        data: number,
        action: IrButtonAction,
        handler: () => void
    ) {
        let command = getCommand((channel - 1), mode, data);

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

    /**
     * Do something when a specific button is pressed or released on the PF speed remote control.
     * @param channel the channel switch 1-4
     * @param button the button
     * @param action the trigger action
     * @param handler body code to run when the event is raised
     */
    //% blockId=pfReceiver_infrared_on_speed_rc_command
    //% block="on Speed RC command: channel %channel | button %button | %action"
    //% channel.min=1 channel.max=4 channel.defl=1
    //% weight=90
    export function onSpeedRCcommand(
        channel: number,
        button: SpeedRCbutton,
        action: IrButtonAction,
        handler: () => void
    ) {
        let command = ((channel - 1) << 7) | button;

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

    /**
     * Do something when a specific button is pressed or released on the PF remote control.
     * @param channel the channel switch 1-4
     * @param red the red output button
     * @param blue the blue output button
     * @param action the trigger action
     * @param handler body code to run when the event is raised
     */
    //% blockId=pfReceiver_infrared_on_rc_command
    //% block="on RC command: channel %channel | red %red | blue %blue | %action"
    //% channel.min=1 channel.max=4 channel.defl=1
    //% weight=95
    export function onRCcommand(
        channel: number,
        red: RCbutton,
        blue: RCbutton,
        action: IrButtonAction,
        handler: () => void
    ) {
        let command = ((channel - 1) << 7) | (1 << 4) | (blue << 2) | red;

        control.onEvent(
            action === IrButtonAction.Pressed
                ? PF_RECEIVER_IR_BUTTON_PRESSED_ID
                : PF_RECEIVER_IR_BUTTON_RELEASED_ID,
                command,
            () => {
                handler();
            }
        );
    }
}