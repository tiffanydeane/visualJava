# VisualJava Java DSA Visualization Tool
This React application combines interactive diagrams and animated code tracing with the aim of simplifying the often abstract and complex programming concepts 
taught in classes like Princeton University's Algorithms and Data Structures course. It is hosted on Netlify at https://visualjava.netlify.app/.

*src/algo* contains the main backend logic for each algorithm

*src/anim* contains the overall object creation and manipulation logic for the animations

*src/screens* contains the frontend code for the Home and About pages - *AlgoScreen.js* connects the frontend to the backend

*src/AlgoList.js* lists all the available DSA and maps each one to its file in *src/algo* and its associated code.

### Acknowledgements
The algorithm and animation logic is based on source code from the [Data Structure Visualization Website](https://www.cs.usfca.edu/~galles/visualization) created by David Galles.
<br>Frontend logic is based on source code from the [CS1332 Visualization Tool](https://github.com/RodrigoDLPontes/visualization-tool) created by Rodrigo Pontes, which adapted and expanded Galle's tool into a React app.
