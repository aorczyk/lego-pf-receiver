let counter = 0;
pfReceiver.connectIrReceiver(DigitalPin.P2)

// --- onIrCommand ---

// pfReceiver.onCommand(0, 0b110, 0b100, IrButtonAction.Pressed, () => {
//     counter += 1;
//     basic.showNumber(counter)
// })

// pfReceiver.onCommand(0, 0b110, 0b101, IrButtonAction.Pressed, () => {
//     counter -= 1;
//     basic.showNumber(counter)
// })

// pfReceiver.onCommand(0, 0b100, 0b1000, IrButtonAction.Pressed, () => {
//     counter = 0;
//     basic.showNumber(counter)
// })

// --- onSpeedRCcommand ---

pfReceiver.onSpeedRCcommand(Channel.Channel1, SpeedRCbutton.RedIncrement, IrButtonAction.Pressed, () => {
    counter += 1;
    basic.showNumber(counter)
})

pfReceiver.onSpeedRCcommand(Channel.Channel1, SpeedRCbutton.RedDecrement, IrButtonAction.Pressed, () => {
    counter -= 1;
    basic.showNumber(counter)
})

pfReceiver.onSpeedRCcommand(Channel.Channel1, SpeedRCbutton.RedBrake, IrButtonAction.Pressed, () => {
    counter = 0;
    basic.showNumber(counter)
})

pfReceiver.onSpeedRCcommand(Channel.Channel1, SpeedRCbutton.BlueIncrement, IrButtonAction.Pressed, () => {
    counter += 2;
    basic.showNumber(counter)
})

pfReceiver.onSpeedRCcommand(Channel.Channel1, SpeedRCbutton.BlueDecrement, IrButtonAction.Pressed, () => {
    counter -= 2;
    basic.showNumber(counter)
})

pfReceiver.onSpeedRCcommand(Channel.Channel1, SpeedRCbutton.BlueBrake, IrButtonAction.Pressed, () => {
    counter = 0;
    basic.showNumber(counter)
})

// --- onRCcommand ---

pfReceiver.onRCcommand(Channel.Channel1, RCbutton.Forward, RCbutton.Float, IrButtonAction.Pressed, () => {
    counter += 1;
    basic.showNumber(counter)
})

pfReceiver.onRCcommand(Channel.Channel1, RCbutton.Backward, RCbutton.Float, IrButtonAction.Pressed, () => {
    counter -= 1;
    basic.showNumber(counter)
})


pfReceiver.onRCcommand(Channel.Channel1, RCbutton.Float, RCbutton.Forward, IrButtonAction.Pressed, () => {
    counter += 2;
})

pfReceiver.onRCcommand(Channel.Channel1, RCbutton.Float, RCbutton.Forward, IrButtonAction.Released, () => {
    basic.showNumber(counter)
})

pfReceiver.onRCcommand(Channel.Channel1, RCbutton.Float, RCbutton.Backward, IrButtonAction.Pressed, () => {
    counter -= 2;
})

pfReceiver.onRCcommand(Channel.Channel1, RCbutton.Float, RCbutton.Backward, IrButtonAction.Released, () => {
    basic.showNumber(counter)
})

pfReceiver.onRCcommand(Channel.Channel1, RCbutton.Forward, RCbutton.Backward, IrButtonAction.Pressed, () => {
    basic.showIcon(IconNames.Diamond)
})

pfReceiver.onRCcommand(Channel.Channel1, RCbutton.Backward, RCbutton.Forward, IrButtonAction.Pressed, () => {
    basic.showIcon(IconNames.SmallDiamond)
})

pfReceiver.onRCcommand(Channel.Channel1, RCbutton.Forward, RCbutton.Forward, IrButtonAction.Pressed, () => {
    basic.showArrow(0)
})

pfReceiver.onRCcommand(Channel.Channel1, RCbutton.Backward, RCbutton.Backward, IrButtonAction.Pressed, () => {
    basic.showArrow(4)
})