# Outline

The software is designed as the GUI for `AURORA`. It is a browser/server application developed with HTML5, JavaScript and Node.js. Through the interface, users are able to upload datastore, get data-driven patterns, and draw graphs with multiple tools.

Techniques in front-end (`AURORA.html`):

1. [Sigma.js](https://github.com/jacomyal/sigma.js/), [Linkurious.js](https://github.com/Linkurious/linkurious.js) - graph drawing library
2. [jQuery](https://jquery.com), [Bootstrap v4](https://getbootstrap.com) - front-end component library and utilities

Techniques in back-end (`AURORA.js`):

- [Node.js Express](https://expressjs.com) - web framework


# Directories

- `/css`, `/fonts`, `/img`, `/js` - HTML resource files
- `/data` - datastores (1 sub-folder per datastore)
- `/node_modules` - saved Node.js packages


# Features

| Feature | Operation | Implementation |
|---|---|---|
| upload datastore | 'Upload datastore' panel | Create a folder in `/data`; Save graph file in the folder and name it `graph`; Launch `DACINCI` program over the graph |
| look over datastores | 'Load datastore' panel | Keep track of `DAVINCI` running progress of each unready datastore |
| load a datastore | 'Load datastore' panel | Display labels (`labels.json` from back-end) and graph profile (`GraphInfo.json` from back-end); Put limits (upper limits of ego degree and ring length) on adding default patterns (`limits.json` from back-end) |
| generate patterns | 'Load datastore' panel | Launch `DAVINCI` program over `patterns.json` with specified parameters; Create Sigma objects for each pattern; Draw patterns (nodes are placed arbitraly) in the specified organize way; Run layout algorithm `ForceAtlas2` over each pattern; Rotate and scale patterns in order that each pattern fully occupies its container |
| look over graph profile | Move mouse to the icon right after the green datastore name | Bootstrap tooltip plugin |
| look over instructions for drawing board | Move mouse to the icon in the upper right corner of the drawing board | Bootstrap tooltip plugin |
| attach label | Select some node and double click label | Modify `label` attribute of Sigma node object |
| search label | Type keyword in search box of labels panel | Show matched items and hide mismatched items |
| detach label | Select some node and click 'Detach label' button in the upper left corner of the drawing board | Modify `label` attribute of Sigma node object |
| change width of labels panel | Drag the gap between labels panel and drawing board | Catch the drag event and modify some CSS attributes of the panel |
| clear the whole graph | Click the 'New window' button in the upper left corner of the drawing board | Reset the main Sigma object |
| scale selected nodes or the whole graph | Click the 'Expand' button or the 'Shrink' button in the upper left corner of the drawing board | Calculate new coordinates and assign them |
| scale selected nodes or the whole graph | Click the 'Rotate clockwise' button or the 'Rotate anticlockwise' in the upper left corner of the drawing board | Calculate new coordinates and assign them |
| add node | Click background (double click when some nodes are selected) | Catch the click event and add a node into main Sigma object |
| add edge | Click source node and target node successively | Record the click events; Add an edge into main Sigma object |
| move node/edge | Drag node with left mouse button | Sigma select plugin |
| remove node | Right click node | Catch right click node event and drop node from main Sigma object |
| remove edge | Right click edge | Catch right click edge event and drop edge from main Sigma object |
| select node | Click node or select with lasso (click 'Select with lasso' button in the upper left corner of the drawing board) | Sigma select plugin & lasso plugin |
| clear select status | Click background | Catch the click event and clear selected nodes set `s.activeState.nodes()` |
| reset organize way of generated patterns | Choose a way from the select box in the top of 'Generated patterns' panel | Catch the event of changing the select box; Delete existing containers of generated patterns; Re-draw patterns in new organize way |


# Installation

1. Install [Node.js](https://nodejs.org/en/)
2. Install Node.js packages via command `npm install`
3. Start server via command `node app.js`
4. Access web via `http://localhost:3000/AURORA` or `http://<your_server_ip>:3000/AURORA`
5. Load patterns via Load Local Patterns


