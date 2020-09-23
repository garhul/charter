window.ipc = window.require('electron').ipcRenderer;
window.ipc.send('ready');
    window.ipc.on('ds.data' ,(ev, data) => {  
});

class DataSource  {
    constructor() {
        this.bufferDepth = 500; // amount of datapoints to display at any given time
        this.series = [];
        this.changeListeners = [];

        this.transformFn = (data, index) => {
            return parseFloat(data).toFixed(3);
        };

        window.ipc.on('ds.data', (ev, data) => {
            this.parseData(data);
        });
    }

    _notifyChange() {
        const lastdp = this.series[this.series.length - 1];
        this.changeListeners.forEach(fn => {
            fn.call(this, lastdp);
        });
    }

    notifyChangeOn(fn) {
        this.changeListeners.push(fn);
    }

    parseData(data) {            
        const dp = data.split(',');
        const ts = dp.shift();

        if (this.series.length === this.bufferDepth) {
            //drop the oldest element
            this.series.shift();
        }

        this.series.push([ts, ...dp.map(this.transformFn)]);
        this._notifyChange();

    }        

    setSeriesTransform(serieIndex, fn) {
        this.series[serieIndex].tf = fn;
    }

    setSeriesUnit(serieIndex, unit) {
        this.series[serieIndex].unit = unit;
    }

    setSeriesLabel(serieIndex, label) {
        this.series[serieIndex].label = label;
    }

}



module.exports = new DataSource();