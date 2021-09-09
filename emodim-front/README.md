# Message Analyzer

Message Analyzer is a React app created for the Emodim project. It is supposed to be used together with multiple backend components found in [this repository](https://github.com/aaposyvanen/emodim).

The app shows a message thread with different kinds of annotations for the emotional content in messages sent with the app. When the server is running the app can be accessed at [localhost:3000](http://localhost:3000).

## Annotation options

There are three different kinds of annotations:
- message-level analysis for messages in thread
- word highlighting for messages in thread
- word highlighting in reply intervention

Each can be turned on or off separately from the others. The three options allow 8 different combinations of annotations shown, as shown in the table below.

|#| Reply Highlights|Thread Highlights|Message-level analysis|
|---|---|---|---|
|1|0|0|0|
|2|0|0|1|
|3|0|1|0|
|4|0|1|1|
|5|1|0|0|
|6|1|0|1|
|7|1|1|0|
|8|1|1|1|

 To control which annotations are shown navigate to a different path on the page, according to the first column in the table. For example, to show no annoatations navigate to [localhost:3000/1](http://localhost:3000/1). To show all annotations, instead go to [localhost:3000/8](http://localhost:3000/8). If no specific path is specified, the app will reroute to /1.

 ## Good to know

 The first thing the app will ask a user to do is to choose a nickname. Nicknames aren't checked or controlled in anyway, having multiple users with the same nickname is entirely possible and should always be accounted for.

 After choosing a nickname the app connects to a chat server running on the same domain. All Message Analyzer clients connected to the same chat server will receive all messages sent from the other clients.

 Clients do not know about the annotation settings of other clients and they will not affect each other in any way. All messages that go through the chat server will always be enriched with analysis data before being sent back to everyone (even the sender, because the sender also needs the analysis data). The client only uses the annotation settings to determine if it should show something extra according to the data that is always there, nothing else.

 Refreshing the page will lose all data from the app, meaning both the chosen nickname and all messages sent or received. Only the chat server keeps permanent logs of all messages sent.

## Using with Docker
### 1. Build a Docker image

The docker image is built with this command:

    docker build -t front .

The last parameter (.) is the path to the Dockerfile in this folder, navigate to this folder or adjust the parameter accordingly before running the command.

The build process will likely take a few minutes.

### 2. Make sure the required Docker network exists

Docker networks are used to allow the isolated containers to talk to each other. This system is designed to work as part of a bridge network. More info about Docker networks can be found [here](https://docs.docker.com/network/)

A network can be created with the following command:

    docker network create emodim

The last parameter is just a name and it can be anything, it just needs to be the same name while creating and connecting to the network. In all examples the network name will be emodim, named after the research group this system was implemented for.

Docker remembers the networks created even after restarts, so the network only needs to be set up once in the environment running Docker. You can check if your network already exists like this:

    docker network ls

If your network exists, you can inspect it for details, such as a list of all containers connected to it like this:

    docker network inspect emodim

If you want to remove your network, use this command:

    docker network rm emodim


### 3. Run the image in a container:

Running the image is done with this command:

    docker run -dit -p 3000:3000 --rm --network emodim --name front front

If you want to see the console output from the server, attach to the server like this:

    docker attach front

You can detach from the server with CTRL + p, CTRL + q. CTRL + z will close the whole container.

## Using without docker

To run the server without docker you need to have [node](https://nodejs.org/en/) installed. Using the latest LTS version is recommended.

1. Install dependencies

        npm install

2. Run the server

        npm start

## Redux-logger

This app uses [redux](https://redux.js.org/) to handle state and [redux-logger](https://github.com/LogRocket/redux-logger) to log state changes in the browser devtools console. Redux-logger can be used most effectively by installing the Redux DevTools browser extension (available for at least Chrome and Firefox).

After installing the extension there is a Redux tab available in the browser's devtools if the current website uses Redux and allows it. This allows reviewing and replaying any state changes that occurred during the use of the app. Most importantly, all of this data can be exported and imported for later analysis.
