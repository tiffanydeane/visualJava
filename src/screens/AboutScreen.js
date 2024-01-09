import React from 'react';
import menu from "../img/sidebar_minimize.png";

const AboutScreen = () => (
	<div className="about">
		<p>
        This web application combines interactive diagrams and animated code tracing with the 
        aim of simplifying the often abstract and complex programming concepts taught in classes 
        like Princeton University's Algorithms and Data Structures course. 
        <br/>
        <br/>
        It is adapted from the {' '}
			<a href="https://csvistool.com/">
                CS 1332 Visualization Tool
			</a>{' '}
			developed by Rodrigo Pontes, which expands on the {' '}
			<a href="https://www.cs.usfca.edu/~galles/visualization/about.html">
                Data Structure Visualization Website
			</a>{' '}
            created by David Galles.
		</p>
        <br/>
		<p>
			For the best experience, please ensure that your browser window is full screen.
		</p>
        <br/>
        <p>
			You can minimize or maximize the sidebar by pressing the menu icon: 
            <img style={{display:"inline", marginLeft:"20px"}} src={menu} alt="menu" width={40}/>
		</p>
	</div>
);

export default AboutScreen;