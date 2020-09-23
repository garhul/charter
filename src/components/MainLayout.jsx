import React, {useState} from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
// import Tabs from 'react-bootstrap/Tabs'
// import Tab from 'react-bootstrap/Tab'
// import DataGrid from './DataGrid';
import Graph from './Plot';
import './MainLayout.css';
import dataSource from '../utils/dataSource';
import { ButtonGroup } from 'react-bootstrap';

export default function mainLayout() {
    return (
        <div className="main">                    
            <TopPanel className="h-45"></TopPanel>                        
            {/* <BottomPanel className="h-45"></BottomPanel>                   */}
            <Footer className="h-5"></Footer>            
        </div>
    )
}

function TopPanel(props) {
    return (<div className="topPanel">
        <Graph  ds={dataSource}></Graph>
    </div>);
}

// function BottomPanel(props) {
//     const [key, setKey] = useState('grid');
//     return (<div className="bottomPanel">
//        <Tabs
//         id="tabs"
//         activeKey={key}
//         onSelect={(k) => setKey(k)}
//       >
//         {/* <Tab eventKey="grid" title="grid"><DataGrid ds={dataSource}></DataGrid></Tab> */}
//         {/* <Tab eventKey="profile" title="Profile">fdsdf</Tab> */}
//         {/* <Tab eventKey="contact" title="Contact" disabled>1351</Tab> */}
//       </Tabs>
//     </div>);
// }

function Footer() {
    const [checked, setChecked] = useState(false);
    
   

    return (<div className="footer">
         <ButtonGroup toggle >
            <ToggleButton className="btn btn_red" type="checkbox"     
            variant="dark"     
            checked={checked}
            value="1"
            onChange={(e) => {
              window.ipc.send('ds.toggle',e.currentTarget.checked);
              setChecked(e.currentTarget.checked);
            }}>
            { checked ? 'Acquire' : 'Stop'}
            </ToggleButton>
        </ButtonGroup>
    </div>);
}
