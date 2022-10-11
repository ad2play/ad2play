# SOAR Platform Backend - originated from the Master Thesis of Lukas Stöger

This software artifact was created using VSCode which is therefore the recommended IDE for executing it.
For running scripts the terminal (Git Bash) is strongly recommended. 
Before executing the project make sure you have installed Node.js and NPM on your computer. 
In the phase of implementation the versions Node: v16.14.0 and NPM: 8.8.0 were used.

## Preparation
    -   Before the system can be started, the environment variables must be set in order to allow accessing the different sources and create a connection to the database
    -   These variables are stored in the .env file of this directory (if not existing run "npm run prepare" in the command prompt) !! Note the difference between the _env and .env
            -> .env is the relevatn one, the other one is only the empty version of it
    -   The first step is to initialize the database connection
    -   This can either be done by initializing a local on prem MongoDB instance (https://www.mongodb.com/try/download/community) or provded by a hosting service like Atlas (https:/www.mongodb.com/atlas/database)
    -   For creating the connection between the backend an the database only the connection string of the database must be saved in the .env file (property: MONGO_DB_CONNECTION_STRING)
    -   After the database connection is saved the next step is to retrieve the access credentials for each source.

        1. NVD: for NVD you need to request an API key (https://nvd.nist.gov/developers/request-an-api-key) and save the key into the property: NVD_API_KEY of the .env file
        2. IBM XFE: To get access to the database at first an account must be created (https://www.ibm.com/account/reg/de-de/signup?formid=urx-30243) after that a key pair for the api access can be generated in the setting (https://exchange.xforce.ibmcloud.com/settings/api) the resulting key:passwort pair must be pasted into the IBM_XFE_KEY,
        IBM_XFE_PW properties of the .env file
        3. CISA: because CISA is a website there are no credentials reguired for accessing the data
        4. Siemens: the Siemens adapter doesn't require any credentials as well
        5. Cisco: To access the CISCO OpenVuln API a CISCO ID must be created and the API key pair must be generated (https://developer.cisco.com/psirt/). The values must then be saved into the CISCO_CLIENT_ID, CISCO_CLIENT_SECRET fields

    -   When all these values are set in the .env file all required aspects of the environment are given -> the system can start

## Dependencies
    -   The entire project is based on dependencies that represent packages used for certain tasks
    -   In order to get the system up and running all these dependencies must be installed in advance
    -   For installing these packages run the command "npm install" in the terminal
    -   When the installation process finished successfully the project 

## Running
    -   For starting the backend instance type the command "npm run start:dev"
    -   The Backend is then availlable under "http://localhost:8081/" and the swagger interface can be accessed at "http://localhost:8081/api-docs#/"    
    -   then nodemon starts the server
    -   nodemon listens for code changes and restarts the server automatically when a file is saved with changes
    -   WARNING: Changes to the .env file require a manual restart of the instances -> nodemon can't alter environment variables when up and running
    -   Evaluation algorithm can be used by declaring the field "GENERATE_EVALUATION_OUTPUT" in the .env file as true
            ->  the algorithm is executed on every restart of the system and analyses the whole database. Outputs can be found in the console and in the folder "src/EvaluationOutputs"
    -   For stopping the instance go into the terminal and press STRG + C / CTRL + C and the server stops running

## Evaluation Data
    -   The data that was evaluated for the work is located in the folder "./EvaluationData" in order to create transparency regarding the results of the work