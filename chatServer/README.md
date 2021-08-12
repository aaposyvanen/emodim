# Chat Server
This server connects clients using the Message Analyzer UI to each other and maintains a log of all messages sent from the UI. It also requests a word and sentence level analysis for each message received from two other servers.

## Using with Docker
### 1. Build a Docker image

The docker image is built with this command:

    docker build -t chat-server .

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

    docker run -dit -p 3010:3010 --rm --network emodim --name chat-server chat-server

If you want to see the console output from the server, attach to the server like this:

    docker attach chat-server

You can detach from the server with CTRL + p, CTRL + q. CTRL + z will close the whole container.
