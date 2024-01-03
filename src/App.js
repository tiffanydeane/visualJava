/* eslint-disable sort-imports */
import './css/App.css';
import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import AlgoScreen from './screens/AlgoScreen';
import Cookies from 'js-cookie';
import HomeScreen from './screens/HomeScreen';
import ReactGA from 'react-ga4';

const App = () => {
	ReactGA.initialize('G-0ERQ9E89XM');
	ReactGA.send({ hitType: 'pageview', page: 'home' });

	const [context, setContext] = useState(true);

	return (
		<Router basename={process.env.PUBLIC_URL + '/'}>
			<Switch>
				<Route
					exact
					path={['/', '/about']}
					render={props => (
						<HomeScreen {...props} />
					)}
				/>
			</Switch>
		</Router>
	);
};

export default App;
