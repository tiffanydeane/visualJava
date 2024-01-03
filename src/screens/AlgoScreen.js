/* eslint-disable sort-imports */
import '../css/AlgoScreen.css';
import '../css/App.css';
import { BsBookHalf, BsFileEarmarkCodeFill, BsFillSunFill, BsMoonFill } from 'react-icons/bs';
import AnimationManager from '../anim/AnimationMain';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import ReactGA from 'react-ga4';
import { algoMap, citeMap, codeMap } from '../AlgoList';
import modals from '../examples/ExampleModals';
import ReactFlow, { Background } from 'reactflow';
import 'reactflow/dist/style.css';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/ext-language_tools";
import { MdInfoOutline } from "react-icons/md";
import { Tooltip } from "react-tooltip";

class AlgoScreen extends React.Component {
	constructor(props) {
		super(props);

		const algoName = this.props.name;
		this.canvasRef = React.createRef();
		this.animBarRef = React.createRef();

		this.state = {
			algoName: algoName,
			examplesEnabled: false,
			width: 0,
			theme: 'light',
			pseudocodeEnabled: true,
			line: null,
		};
		ReactGA.send({ hitType: 'pageview', page: algoName });
	}

	componentDidMount() {
		if (algoMap[this.state.algoName]) {
			this.animManag = new AnimationManager(this.canvasRef, this.animBarRef);

			this.currentAlg = new algoMap[this.state.algoName][1](
				this.animManag,
				this.canvasRef.current.width,
				this.canvasRef.current.height,
			);

			window.addEventListener('resize', this.updateDimensions);
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateDimensions);
	}

	updateDimensions = () => {
		this.animManag.changeSize(document.getElementById('viewport').clientWidth,
		document.getElementById('viewport').clientHeight);
	};

	render() {
		const algoName = this.state.algoName;

		if (!algoMap[algoName]) {
			return (
				<div className="container">
					<Header />
					<div className="content">
						<div className="four-o-four">
							<h1>404!</h1>
							<h3>
								Algorithm not found! Click <Link to="/">here</Link> to return to the
								home screen and choose another algorithm.
							</h3>
						</div>
					</div>
					<Footer />
				</div>
			);
		}

		const isQuickSelect = algoMap[algoName][0] === 'QuickSelect / kᵗʰ Select';

		// check for verbose name in algoMap
		const header = algoMap[algoName][3] ? algoMap[algoName][3] : algoMap[algoName][0];
		const proOptions = { hideAttribution: true };

		const styles = {
			background: '#1E1E1E',
			width: '100%',
		  };

		return (
			<div className="grid grid-cols-6 w-full">
			<div className="col-start-1 col-span-4 justify-start items-center pl-4 pr-2 pb-4 viz">
			<div className="VisualizationMainPage h-full">
				<div id="container" className='h-full flex-col'>
					<div id="header" className='mb-2'>
						<h1>
							{/* <Link to="/">&#x3008;</Link>&nbsp;&nbsp; */}
							{isQuickSelect ? (
								<>
									QuickSelect / k<sup>th</sup> Select
								</>
							) : (
								<>{header}</>
							)}
						</h1>
					</div>

						<div className="viewport mb-2" id="viewport">
							<ReactFlow
							panOnDrag={false}
							proOptions={proOptions}
							zoomOnPinch={false}
							zoomOnDoubleClick={false}
							preventScrolling={false}
							style={styles}>
								
							<Background/>
							<canvas
								id="canvas"
								ref={this.canvasRef}
							></canvas>
							</ReactFlow>

						</div>

					<div id="mainContent">
						<div id="algoControlSection">
							<table id="AlgorithmSpecificControls"></table>

						</div>

						<div id="generalAnimationControlSection">
							<table id="GeneralAnimationControls" ref={this.animBarRef}></table>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div className="flex col-start-5 col-span-2 w-full viz justify-start pr-2 pl-2 pb-4">
		<AceEditor
			mode="java"
			theme="tomorrow_night_eighties"
			name="editor"
			value = {codeMap[algoName][0]}
			editorProps={{ $blockScrolling: true }}
			className="overlay overflow-hidden"
			setOptions={{
				readOnly: true,
				highlightActiveLine: false, 
				highlightGutterLine: false,
				tabSize: 3
				
			}}
		/>
		<MdInfoOutline id="my-tooltip" style = {{position: 'absolute'}}/>	
		</div>
		<Tooltip 
			anchorSelect="#my-tooltip" 
			content={citeMap[algoName][0]} 
			place='top' 
			style = {{position: 'absolute', zIndex: '99'}}
		/>
		</div>
		);
	}

}

export default AlgoScreen;