import React from 'react';
import {render} from 'react-dom';
import {HashRouter as Router, Route, Link, hashHistory, Switch } from 'react-router-dom'

import 'semantic-ui-css/semantic.min.css';

import Home from './components/Home/Home.jsx'
import TradePage from './components/TradePage/TradePage.jsx';
import CardCreate from './components/CardCreate/CardCreate.jsx';
import CardDetail from './components/CardDetail/CardDetail.jsx';
import MiniCard from './components/MiniCard/MiniCard.jsx'
import Login from './components/Login/Login.jsx'
import Register from './components/Register/Register.jsx'
import Profile from './components/Profile/Profile.jsx'

require('./styles/main.scss')

render(
	<div>
	<Router>
		<div>
		<Route exact path='/' component={Home}/>
		<Route exact path='/minicard' component={MiniCard}/>
		<Route exact path='/create' component={CardCreate}/>
		<Route path='/detail/' component={CardDetail}/>
		<Route exact path='/login' component={Login}/>
		<Route exact path='/register' component={Register}/>
		<Route path='/profile/' component={Profile}/>
		</div>
	</Router>
	</div>,
	document.getElementById('app')
);
