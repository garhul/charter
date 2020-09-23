const {
  ipcMain
} = require('electron');

// ** simulate values of an AC voltage of 0 to 10 V over a resistor of 4 ohms with steps of range 0-10 V divided by the range
const VMAX = 5;
const R = 4;

let connected = false;
let shall_cont = true;

ipcMain.on('ds.toggle', async (ev, arg) => { console.log(arg); shall_cont = arg });

const generateSequence = async function* (step, ts) {  
  while (connected) {
    for (var i =0.01 ; i <= 3.14; i+=0.01) {    
      await new Promise(resolve => setTimeout(resolve, ts));
      const v = (Math.sin(i).toFixed(3) * VMAX);
      yield v;
    } 
  }
}

exports.init = async () => {
  console.log('Generating 1000 fake packets');
  ipcMain.on('ready', async (ev, arg) => {
    if (connected) return;
    connected = true;
    const gen = generateSequence(1, 60);
    for await (let value of gen) {
      const frame = [
        Date.now(),
        value,
        value / R,
        value * (value / R)
      ];
    
      console.log(`emiting ${frame}`);
      if (shall_cont) ev.sender.send('ds.data', frame.join(','));
    }
  });
}