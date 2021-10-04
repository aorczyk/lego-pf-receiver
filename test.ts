let counter = 0;
pfReceiver.connectIrReceiver(DigitalPin.P2, true)

// --- onIrCommand ---

// pfReceiver.onCommand(0, 0b110, 0b100, PfAction.Pressed, () => {
//     counter += 1;
//     basic.showNumber(counter)
// })

// pfReceiver.onCommand(0, 0b110, 0b101, PfAction.Pressed, () => {
//     counter -= 1;
//     basic.showNumber(counter)
// })

// pfReceiver.onCommand(0, 0b100, 0b1000, PfAction.Pressed, () => {
//     counter = 0;
//     basic.showNumber(counter)
// })

// --- onSpeedRCcommand ---

pfReceiver.onSpeedRCcommand(PfReceiverChannel.Channel1, PfSpeedControl.RedIncrement, PfAction.Pressed, () => {
    counter += 1;
    // basic.showNumber(counter)
})

pfReceiver.onSpeedRCcommand(PfReceiverChannel.Channel1, PfSpeedControl.RedDecrement, PfAction.Pressed, () => {
    counter -= 1;
    // basic.showNumber(counter)
})

pfReceiver.onSpeedRCcommand(PfReceiverChannel.Channel2, PfSpeedControl.RedDecrement, PfAction.Pressed, () => {
    basic.showIcon(IconNames.Happy)
})

pfReceiver.onSpeedRCcommand(PfReceiverChannel.Channel2, PfSpeedControl.RedDecrement, PfAction.Pressed, () => {
    basic.showIcon(IconNames.Heart)
})

pfReceiver.onSpeedRCcommand(PfReceiverChannel.Channel1, PfSpeedControl.RedBrake, PfAction.Pressed, () => {
    basic.showNumber(counter)
    counter = 0;
    // basic.showNumber(counter)
    // pfReceiver.stopRecord()
    console.log(JSON.stringify(pfReceiver.getRecordedCommands()))
    pfReceiver.startRecord([0])
})

pfReceiver.onSpeedRCcommand(PfReceiverChannel.Channel1, PfSpeedControl.BlueIncrement, PfAction.Pressed, () => {
    counter += 2;
    basic.showNumber(counter)
})

pfReceiver.onSpeedRCcommand(PfReceiverChannel.Channel1, PfSpeedControl.BlueDecrement, PfAction.Pressed, () => {
    counter -= 2;
    basic.showNumber(counter)
})

pfReceiver.onSpeedRCcommand(PfReceiverChannel.Channel1, PfSpeedControl.BlueBrake, PfAction.Pressed, () => {
    counter = 0;
    basic.showNumber(counter)
})

// --- onRCcommand ---

pfReceiver.onRCcommand(PfReceiverChannel.Channel1, PfControl.Forward, PfControl.Float, PfAction.Pressed, () => {
    counter += 1;
    basic.showNumber(counter)
})

pfReceiver.onRCcommand(PfReceiverChannel.Channel1, PfControl.Backward, PfControl.Float, PfAction.Pressed, () => {
    counter -= 1;
    basic.showNumber(counter)
})


pfReceiver.onRCcommand(PfReceiverChannel.Channel2, PfControl.Forward, PfControl.Float, PfAction.Pressed, () => {
    basic.showIcon(IconNames.SmallHeart)
})

pfReceiver.onRCcommand(PfReceiverChannel.Channel2, PfControl.Forward, PfControl.Float, PfAction.Released, () => {
    basic.clearScreen()
})

pfReceiver.onRCcommand(PfReceiverChannel.Channel2, PfControl.Backward, PfControl.Float, PfAction.Pressed, () => {
    basic.showIcon(IconNames.Heart)
})

pfReceiver.onRCcommand(PfReceiverChannel.Channel2, PfControl.Backward, PfControl.Float, PfAction.Released, () => {
    basic.clearScreen()
})


pfReceiver.onRCcommand(PfReceiverChannel.Channel1, PfControl.Float, PfControl.Forward, PfAction.Pressed, () => {
    counter += 2;
})

pfReceiver.onRCcommand(PfReceiverChannel.Channel1, PfControl.Float, PfControl.Forward, PfAction.Released, () => {
    basic.showNumber(counter)
})

pfReceiver.onRCcommand(PfReceiverChannel.Channel1, PfControl.Float, PfControl.Backward, PfAction.Pressed, () => {
    counter -= 2;
})

pfReceiver.onRCcommand(PfReceiverChannel.Channel1, PfControl.Float, PfControl.Backward, PfAction.Released, () => {
    basic.showNumber(counter)
})

pfReceiver.onRCcommand(PfReceiverChannel.Channel1, PfControl.Forward, PfControl.Backward, PfAction.Pressed, () => {
    basic.showIcon(IconNames.Diamond)
})

pfReceiver.onRCcommand(PfReceiverChannel.Channel1, PfControl.Backward, PfControl.Forward, PfAction.Pressed, () => {
    basic.showIcon(IconNames.SmallDiamond)
})

pfReceiver.onRCcommand(PfReceiverChannel.Channel1, PfControl.Forward, PfControl.Forward, PfAction.Pressed, () => {
    basic.showArrow(0)
})

pfReceiver.onRCcommand(PfReceiverChannel.Channel1, PfControl.Backward, PfControl.Backward, PfAction.Pressed, () => {
    basic.showArrow(4)
})



input.onButtonPressed(Button.A, function () {
    pfReceiver.startRecord([0]);
    basic.showString("R")
})

input.onButtonPressed(Button.B, function () {
    pfReceiver.stopRecord();
    serial.writeLine(JSON.stringify(pfReceiver.getRecordedCommands()))
    basic.showString("S")
})