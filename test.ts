let counter = 0;
pfReceiver.connectIrReceiver(DigitalPin.P2)

// --- onIrCommand ---

// pfReceiver.onCommand(1, 110, 100, IrButtonAction.Pressed, () => {
//     counter += 1;
//     basic.showNumber(counter)
// })

// pfReceiver.onCommand(1, 110, 101, IrButtonAction.Pressed, () => {
//     counter -= 1;
//     basic.showNumber(counter)
// })

// pfReceiver.onCommand(1, 100, 1000, IrButtonAction.Pressed, () => {
//     counter = 0;
//     basic.showNumber(counter)
// })

// --- onSpeedRCcommand ---

pfReceiver.onSpeedRCcommand(1, SpeedRCbutton.Red_Increment, IrButtonAction.Pressed, () => {
    counter += 1;
    basic.showNumber(counter)
})

pfReceiver.onSpeedRCcommand(1, SpeedRCbutton.Red_Decrement, IrButtonAction.Pressed, () => {
    counter -= 1;
    basic.showNumber(counter)
})

pfReceiver.onSpeedRCcommand(1, SpeedRCbutton.Red_Brake, IrButtonAction.Pressed, () => {
    counter = 0;
    basic.showNumber(counter)
})

pfReceiver.onSpeedRCcommand(1, SpeedRCbutton.Blue_Increment, IrButtonAction.Pressed, () => {
    counter += 2;
    basic.showNumber(counter)
})

pfReceiver.onSpeedRCcommand(1, SpeedRCbutton.Blue_Decrement, IrButtonAction.Pressed, () => {
    counter -= 2;
    basic.showNumber(counter)
})

pfReceiver.onSpeedRCcommand(1, SpeedRCbutton.Blue_Brake, IrButtonAction.Pressed, () => {
    counter = 0;
    basic.showNumber(counter)
})

// --- onRCcommand ---

pfReceiver.onRCcommand(1, RCbutton.Forward, RCbutton.Float, IrButtonAction.Pressed, () => {
    counter += 1;
    basic.showNumber(counter)
})

pfReceiver.onRCcommand(1, RCbutton.Backward, RCbutton.Float, IrButtonAction.Pressed, () => {
    counter -= 1;
    basic.showNumber(counter)
})


pfReceiver.onRCcommand(1, RCbutton.Float, RCbutton.Forward, IrButtonAction.Pressed, () => {
    counter += 2;
})

pfReceiver.onRCcommand(1, RCbutton.Float, RCbutton.Forward, IrButtonAction.Released, () => {
    basic.showNumber(counter)
})

pfReceiver.onRCcommand(1, RCbutton.Float, RCbutton.Backward, IrButtonAction.Pressed, () => {
    counter -= 2;
})

pfReceiver.onRCcommand(1, RCbutton.Float, RCbutton.Backward, IrButtonAction.Released, () => {
    basic.showNumber(counter)
})

pfReceiver.onRCcommand(1, RCbutton.Forward, RCbutton.Backward, IrButtonAction.Pressed, () => {
    basic.showIcon(IconNames.Diamond)
})

pfReceiver.onRCcommand(1, RCbutton.Backward, RCbutton.Forward, IrButtonAction.Pressed, () => {
    basic.showIcon(IconNames.SmallDiamond)
})

pfReceiver.onRCcommand(1, RCbutton.Forward, RCbutton.Forward, IrButtonAction.Pressed, () => {
    basic.showArrow(0)
})

pfReceiver.onRCcommand(1, RCbutton.Backward, RCbutton.Backward, IrButtonAction.Pressed, () => {
    basic.showArrow(4)
})