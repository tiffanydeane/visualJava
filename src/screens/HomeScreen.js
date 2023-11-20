import '../css/App.css';
import { Link, Route, Switch } from 'react-router-dom';
import React, { useState } from 'react';
import { algoList, algoMap } from '../AlgoList';
import AboutScreen from './AboutScreen';
import AlgoScreen from './AlgoScreen';
import CodeMirror from '@uiw/react-codemirror';
import { DiCodeBadge } from 'react-icons/di';
import Examples from "../Examples";
import Footer from '../components/Footer';
import Header from '../components/Header';
import LLDiagram from '../LLDiagram';
import { java } from '@codemirror/lang-java';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

const HomeScreen = () =>{

	const [alg, setAlg] = useState(0);

	function changeAlg(name) {
		setAlg(name.name);
		console.log(alg);
	}


return (
	<div>
		<Header />
		<div className="content">
			<Switch>
				<Route exact path="/">
					<div className="outer-flex">
						<div className="inner-flex">
						<div class="grid grid-cols-2 grid-rows-2">
							<div className="flex w-full h-full justify-start items-center pl-8 pr-2 py-4">
							<CodeMirror
								// value={code}
								theme={vscodeDark}
								height="60vh"
								width={`100%`}
								extensions = {[java()]}
								// onChange={(editor, data, value) => {
								//   setCode(editor);
								// }}
								options={{
								lineNumbers: true,
								styleActiveLine: true,
								readOnly: true,
								}}
								className="overlay rounded-md overflow-hidden w-full h-full"
							/>   
							</div>

							<div className="flex w-full h-full justify-start items-center pr-8 pl-2 py-4">
							<div className="flex rounded-md w-full h-full bg-[#1E1E1E] p-5" id ="vis">
							{/* <LLDiagram/> */}
							<AlgoScreen
								algoName = 'ArrayList'
							/>
							</div>
							</div>

							<div className="flex flex-col pl-8 pr-2 row-start-2 row-end-3">
							<div className="flex w-full justify-start pr-8 pl-2 py-4">
							
							{algoList.map((name, idx) =>
									// <Link
									// 	to={`/${name}`}
									// 	// key={idx}
									// 	style={{ textDecoration: 'none' }}
									// >
										

									// </Link>
									<button className="button" onClick={() => changeAlg({name})} key={idx}>
									<div className="algo-name">{algoMap[name][0]}</div>
									</button>

							)}
							</div>
						
							</div>
						

						</div>

						</div>
					</div>
				</Route>
				<Route path="/about">
					<AboutScreen />
				</Route>
			</Switch>
		</div>
		<Footer />
	</div>
);
};

export default HomeScreen;
