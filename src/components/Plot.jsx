import React, {useEffect, useRef} from 'react'
import 'uplot/dist/uPlot.min.css';
import './Plot.css';
import uPlot from "uplot";

const data = [];
const maxDataLength = 100; // number of points to display

const colors = {v:'#4BA',i:'#AB3', p: '#B4A'};
const cursorOpts = {
  lock: true,
  y:false,
  focus: {
    prox: 10,
  },
  sync: {
    key: "moo",
    setSeries: false,
  },
}

const vOps = {
  cursor: cursorOpts,
  width: window.innerWidth,
  height: (window.innerHeight) / 4,
  scales: {x:{time:false}, y:{auto:true}},
  series:  [
    {
      label: "x",
      stroke: "#ccc",    
      value: (u,v ) => `T - ${((Date.now() - v) / 1000).toFixed(3)} s`,
    },
    {
      label: "V",
      stroke: colors.v,
      value: (u,v ) => `${v} Volts`,
    }
  ],
  // legend: { show: false },
  axes: [{
    show:false,
    size: 20,
    label: "Time ",
    labelSize: 50,
    stroke: "#ccc",    
    values: (u, vals, space) => vals.map(v => ((Date.now() - v) / 1000).toFixed(2)),    
  },
  {
    space: 20,
    size: 60,
    label: "Voltage",
    //	labelSize: 20,
    stroke: colors.v,
    class: "foo",
    values: (u, vals, space) => vals.map(v => v + ' V'),
  }]
};

const iOps = {
  cursor: cursorOpts,
  width: window.innerWidth,
  height: (window.innerHeight ) / 4,
  scales: {x:{time:false}, y:{auto:true}},
  series:  [
    {
      label: "x",
      stroke: "#ccc",    
      value: (u,v ) => `T - ${((Date.now() - v) / 1000).toFixed(3)} s`,
    },
    {
      label: "A",
      value: (u,v ) => `${v} Amps`,
      stroke: colors.i,
    }
  ],
  // legend: {show: false},
  axes: [{
    show:false,
    size: 20,
    label: "Time ",
    labelSize: 20,
    stroke: "#ccc",    
    values: (u, vals, space) => vals.map(v => ((Date.now() - v) / 1000).toFixed(2)),    
  },
  {
    space: 20,
    size: 60,
    label: "Current",
    labelSize: 30,    
    stroke: colors.i,
    class: "foo",
    values: (u, vals, space) => vals.map(v => v + ' A'),
  }]
}

const pOps = {
  cursor: cursorOpts,
  width: window.innerWidth,
  height: (window.innerHeight) / 4,
  scales: {x:{time:false}, y:{auto:true}},
  series:  [
    {
      label: "x",
      stroke: "#ccc",    
      value: (u,v ) => `T - ${((Date.now() - v) / 1000).toFixed(3)} s`,
    },
    {
      label: "P",
      stroke: colors.p,
    }
  ],  
  axes: [{
    show:false,
    space: 20,
    size: 40,
    label: "Time ",
    labelSize: 40,
    stroke: "#ccc",    
    values: (u, vals, space) => vals.map(v => ((Date.now() - v) / 1000).toFixed(2)),    
  },
  {
    space: 20,
    size: 60,
    label: "Power",
    labelSize: 30,
    stroke: colors.p,
    class: "foo",
    values: (u, vals, space) => vals.map(v => v + ' mW'),
  }]
}

const immediate = [
  {},
  {max:null, min:null, avg: null},
  {max:null, min:null, avg: null},
  {max:null, min:null, avg: null},
];
// const data = [[now, now + 60, now + 120, now + 180], [1, 2, 3, 4]];

export default function Graph(props) {
  const plotRefA = useRef();
  const plotRefV = useRef();
  const plotRefP = useRef();

  useEffect(() => {
    const vPlot  = new uPlot(vOps, data, plotRefV.current);
    const aPlot  = new uPlot(iOps, data, plotRefA.current);
    const pPlot  = new uPlot(pOps, data, plotRefP.current);

    props.ds.notifyChangeOn((d, indx)=> {
      d.forEach((v,i)=> {    
        if (!data[i]) data[i] = [];
        if (data[i].length === maxDataLength) data[i].shift();
        if (i === 0) {
          data[i].push(parseInt(v));          
        } else {
          data[i].push(parseFloat(v).toFixed(4));
        
          immediate[i].max = (immediate[i].max === null || immediate[i].max < d[i]) ? d[i] : immediate[i].max;
          immediate[i].min = (immediate[i].min === null || immediate[i].min > d[i]) ? d[i] : immediate[i].min;
          immediate[i].avg = (immediate[i].avg === null ) ? d[i] : (immediate[i].avg + d[i]) / 2 ;
        }           
      });

      vPlot.setData([data[0],data[1]]);
      aPlot.setData([data[0],data[2]]);
      pPlot.setData([data[0],data[3]]);

    });
  }, []);
  return (
    <div>
      {/* <PlotControls v={immediate[1]} /> */}
      <div ref={plotRefV} />
      <div ref={plotRefA} />
      <div ref={plotRefP} />
    </div>
  );
}


export function PlotControls({v}) {
    return (<div style={{"color": "#fff"}}> Vmin: {v.min}, Vmax: {v.max},  Vavg: {v.avg} </div>)
}



// axes: [
//   {      
    
//     show: true,
//     label: "Sin X",
//     time: false,
//     stroke: "#ffaa00",
//     grid: {
//       show: true,
//       stroke: "#444",
//       width: 1,
//       dash: [],
//     },
//   },
//   {
//     show: true,
//     label: "Sin X",
//     labelSize: 30,
//     labelFont: "1em Arial",
//     font: "1em Arial",
//     gap: 5,
//     size: 50,
//     stroke: "#99b040",
//     grid: {
//       show: true,
//       stroke: "#333",
//       width: 1,
//       dash: [],
//     },
//     ticks: {
//       show: true,
//       stroke: "#eee",
//       width: 2,
//       dash: [0],
//       size: 10,
//     }
//   },{
//     show: true,
//     label: "otro coso",
//     stroke: '#fff',
//   }
// ],