import {
	BsFillHouseFill,
	BsFillSunFill,
	BsGithub,
	BsInfoCircleFill,
	BsMoonFill,
} from 'react-icons/bs';
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';
import React from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';

class Header extends React.Component {
	state = {
		menuVisible: null,
	};

	render() {
		const menuClass = { null: '', true: 'show', false: 'hide' };

		return (
			<React.Fragment>
				<div className="header">
					<div id="menu">
						<IconContext.Provider value={{ className: 'menu-bar' }}>
							<RxHamburgerMenu onClick={this.toggleMenu} />
						</IconContext.Provider>
					</div>
					<div id="title">
						<h1>CS 1332 Data Structures and Algorithms Visualization Tool</h1>
					</div>
				</div>
				<div className={`menu ${menuClass[this.state.menuVisible]}`}>
					<ul>
						<li>
							<Link to="/" onClick={this.toggleMenu}>
								<BsFillHouseFill size={20} />
								&nbsp;&nbsp;Home
							</Link>
						</li>
						<li>
							<Link to="/about" onClick={this.toggleMenu}>
								<BsInfoCircleFill size={20} />
								&nbsp;&nbsp;About
							</Link>
						</li>
						<li>
							<a href="https://github.com/RodrigoDLPontes/visualization-tool">
								<BsGithub size={20} />
								&nbsp;&nbsp;Source Code
							</a>
						</li>
					</ul>
				</div>
			</React.Fragment>
		);
	}

	toggleMenu = () => this.setState(state => ({ menuVisible: !state.menuVisible }));
}

export default Header;
