/* eslint-disable sort-imports */
import '../css/App.css';
import { Link, Route, Switch } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { dataList, sortList, searchList, algoMap, codeMap } from '../AlgoList';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import AlgoScreen from './AlgoScreen';
import CodeMirror from '@uiw/react-codemirror';
import { DiCodeBadge } from 'react-icons/di';
import { EditorState, EditorSelection } from '@codemirror/state';
import { EditorView } from 'codemirror';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { java } from '@codemirror/lang-java';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Sidebar, Menu, MenuItem, SubMenu, useProSidebar } from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Typography } from '@mui/material';
import { Code, Edit } from '@mui/icons-material';


const HomeScreen = () =>{

	const [alg, setAlg] = useState('LinkedList');
	const [expanded, setExpanded] = React.useState(false);

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const [selectedIndex, setSelectedIndex] = React.useState(0);

	const handleListItemClick = (event, index, name) => {
		setSelectedIndex(index);
		setAlg(name);
	};

	const { collapseSidebar, toggleSidebar, collapsed, toggled, broken, rtl } =
    useProSidebar();

  const toggle = () => {
    toggleSidebar();
    if (toggled) {
      collapseSidebar();
    } else {
      collapseSidebar();
    }
  };

return (
	<div>
		<Header />
		<div className="content">
				<Route exact path="/">
					<div className="outer-flex">
						<div className="inner-flex">
						<div style={( { height: "100vh" },{ display: "flex"})}>
						<Sidebar
						breakPoint="sm"
						transitionDuration={800}
						backgroundColor="#383f4e"
						rtl={false}
						style={{ height: "100vh"}}
						className="pb-4 rounded-md"
					>
						{/* {!broken && ( */}
						<Menu menuItemStyles={{
						button: {
								backgroundColor: '#383f4e',
								'&:hover': {
										backgroundColor: '#69748a',
										color: '#ffffff'
									},
							},
						}}
						>
						<MenuItem
							icon={<MenuOutlinedIcon/>}
							// onClick={() => {
							//   collapseSidebar();
							// }}
							style={{ textAlign: "center", color: "#ffffff"}}
							onClick={() => {
								toggle();
							  }}
						>
						</MenuItem>

						<SubMenu label="Data Structures" style={{ display: !toggled ? "flex" : "none", color: "#ffffff"}}>
						{dataList.map((name, idx) =>
											<MenuItem
											selected={selectedIndex === idx}
											onClick={(event) => handleListItemClick(event, idx, name)}
											key={idx}
											style={{ color: "#ffffff"}}
											>
											{algoMap[name][0]}
											</MenuItem>
						)}
						</SubMenu>
						<SubMenu label="Sorting" style={{ display: !toggled ? "flex" : "none", color: "#ffffff"}}>
						{sortList.map((name, idx) =>
											<MenuItem
											selected={selectedIndex === idx}
											onClick={(event) => handleListItemClick(event, idx, name)}
											key={idx}
											style={{ color: "#ffffff"}}
											>
											{algoMap[name][0]}
											</MenuItem>
						)}
						</SubMenu>
						<SubMenu label="Searching" style={{ display: !toggled ? "flex" : "none", color: "#ffffff"}}>
						{searchList.map((name, idx) =>
											<MenuItem
											selected={selectedIndex === idx}
											onClick={(event) => handleListItemClick(event, idx, name)}
											key={idx}
											style={{ color: "#ffffff"}}
											>
											{algoMap[name][0]}
											</MenuItem>
						)}
						</SubMenu>

						</Menu>
						{/* )} */}
					</Sidebar>
						
							<AlgoScreen 
										key = {alg}
										name = {alg}
									/>


						</div>
					</div>
					</div>
				</Route>
		</div>
	</div>
);
};

export default HomeScreen;
