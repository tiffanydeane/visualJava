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

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(false);
	}, []);


	if (loading) {
		return <div>.</div>;
	}

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
				{/* <Route
					render={props => (
						<AlgoScreen {...props} />
					)}
				/> */}
			</Switch>
		</Router>
	);
};

export default App;
