import React, {createRef} from 'react';

import './DataGrid.css';

export default class DataGrid extends React.Component{
    wrapper = createRef();

    constructor(props) {
        super(props);
        this.state = { datapoints: [], selectedDatapoints: [] };
        
    }

    componentWillUpdate() {
        const node = this.wrapper.current;
        this.shouldScrollToBottom = node.scrollTop + node.clientHeight + 100 >= node.scrollHeight
    }
    
    componentDidUpdate() {
        if (this.shouldScrollToBottom) {
            const node = this.wrapper.current;
            node.scrollTop = node.scrollHeight   
        }
    }

    componentDidMount() {        
        this.props.ds.notifyChangeOn((d) => {
            this.add(d);
        });
    }

    componentWillUnmount() {
        // window.ipc.removeListener('ds.data',this._parse);
    }

    add(data) {        
        this.state.datapoints.push(data);        
        this.setState({...this.state });
    }

    render() {
        const rows = this.state.datapoints.map((d,i) => (<DataRow key={`row_${i}`} data={d} index={i}/>));
        return <div className="dataGrid" ref={this.wrapper}>
            <DataLabels></DataLabels>
            <div className="dataRows">
                <div style={{"overflowY":"scroll"}}>{rows}</div>
            </div>
        </div>
    }
}

function DataLabels() {
    return (<div className="dataGridLabels">
        <span className="dataGridCell" >Index</span>
        <span className="dataGridCell" >Time</span>
        <span className="dataGridCell" >Cos X</span>
        <span className="dataGridCell" >1/ Cos X</span>
        <span className="dataGridCell" >2/ Cos X</span>
    </div>);
}



function DataRow ({data, index}) {    
    const t = `t - ${(Date.now() - data[0][0]) / 1000} ms`;
    const cellData = [t, ...data[0][1]];
    const cells = cellData.map((col, i) => (<span className="dataGridCell" key={`col${i} ${index}`}>{col} </span>));    
    return (<div className="dataGridRow" key={index}>[{index}] {cells}</div>)
}