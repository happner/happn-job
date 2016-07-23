happn-job
==========
*an asynchronous javascript job and integration platform*

##premise
The basic design consists of 5 primary elements:
1. projects - where resources and topographies can be designed.
2. resources - resources can be any controllable element that has a directive (a piece of code the element executes when it receives a message) and a set of controls (a piece of HTML that expresses the resources visual configuration interface).
3. topographies - maps or flow diagrams that resources can be dragged on to.
4. deployments - projects that have been published (compiled) and are ready for deployment.
5. substrates - the hosts where applications designed with happn-job are started from, they install and control applications that are deployed to them, and their role is confined to installing deployments, and creating a control and data pipeline between the applications they have installed and the cloud system.

*the design studio is divided into following 3 sections:*

1. blueprints:
*blueprints defined the different code snippets and installation modules that drive a specific integration design. The vanilla blueprint creates an app that creates a single happner instance for each topography, shapes on the topography are compiled as components, and flow (connectors) on the topography become subscriptions between components. There are special parameters in the code $PORT$ that are used so that when a substrate starts multiple happner instances, they are all assigned available ports*

2. projects (design studio):
*projects allows user to design resources, and place resources on to topographies. Topographies have two layouts:
2.1. map layout (ie. actual map of a world, country, suburb, floorplan or cross section) or 2.2 logical flow layout (ie. flow diagram or relational data diagram)*

3. deployments:
*subtrates, or host processes start up and publish their ip addresses and names to a central registry. When a project is published, it's associated blueprint has a build method, that essentially creates a versioned instance of the application based on the project design, the published application is now ready for deployment. When the published application is deployed, the user chooses what substrate the application will run on.* The substrate is then notified with the application url and credentials of the userdoing the deployment, if the user has permission, the substrate downloads the the application, NPM installs it, then forks it and creates a control pipelineto the design studio, so the app can be started, stopped, paused anduser can view performance metrics and logs related to the app*

#research and ideas

maps and tiling
===============

- https://github.com/cutting-room-floor/tilestream
- https://github.com/mapbox/tilemill

