/* eslint-disable sort-imports */
import '../css/App.css';
import { Route, Switch } from 'react-router-dom';
import React, { useState } from 'react';
import { dataList, sortList, searchList, algoMap, codeMap } from '../AlgoList';
import AboutScreen from './AboutScreen';
import AlgoScreen from './AlgoScreen';
import Header from '../components/Header';
import { Sidebar, Menu, MenuItem, SubMenu, useProSidebar } from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const HomeScreen = () =>{

	const [alg, setAlg] = useState('LinkedList');

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
			<Switch>
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
							style={{ textAlign: "center", color: "#ffffff"}}
							onClick={() => {
								toggle();
							}}
						>
						</MenuItem>

						<SubMenu label="Data Structures" style={{ display: !collapsed ? "flex" : "none", color: "#ffffff"}}>
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
						<SubMenu label="Sorting" style={{ display: !collapsed ? "flex" : "none", color: "#ffffff"}}>
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
						<SubMenu label="Searching" style={{ display: !collapsed ? "flex" : "none", color: "#ffffff"}}>
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
						</Sidebar>
					
						<AlgoScreen 
							key = {alg}
							name = {alg}
						/>
						</div>
					</div>
					</div>
				</Route>
				<Route path="/about">
					<AboutScreen />
				</Route>
			</Switch>
		</div>
	</div>
);
};

export default HomeScreen;
