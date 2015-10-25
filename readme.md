
Nodepop [![Build Status](https://travis-ci.org/wholedev/Nodepop.svg?branch=master)](https://travis-ci.org/wholedev/Nodepop)
=======

This repository contains an API with Node.js app using Express 4. The code was structured using MVC patterns following the folder structure.
Will be found the models in 'model' folder, and the controlers in 'route' folder. This API was prepared without use views.

## Dependencies:

Bellow are the tools and libraries (and their minimum versions) required to build run project:

* MongoDB v3.0.
* NodeJS v.4.0 with NPM.

## Config File
The API use a file with config. This file is named 'local_config' and contains:

```js
module.exports = {
    apiKey: 'apikey',
    jwt: {
        secret: 'nodepopapinodepopapi',
        expiresInMinutes: 1440  // expires in 24 hours
    },
    mongoPath: 'mongodb://localhost/nodepop'
};
```
If you use an other type of database connection will be changed in mongoPath variable

## Installation

To install this API will execute this script:

```
git clone https://github.com/wholedev/Nodepop.git
cd nodepop
npm install .
```

## Populate Database

The project contains some scripts to load the database. Types of loads:

* Populate Database:
```
npm run populateDB
```
Load examples in the database
* (**minimum**) Load the Error Messages:
```
npm run initErrorMessages
```
Load the error messages to send messages in JSON with internationalization
* Populate Database and Load the Error Messages:
```
npm run initAllDatabase
```

## Run in Develompent scope

### Dependencies:
Bellow are the tools and libraries (and their minimum versions) required to build run project in development mode:

* nodemon

The run start using these command:

```
npm run dev
```

## Run in Production scope

```
npm start
```
## Run Test 
To run tests of the API, will be installed the development dependencies using npm:

```js
npm install --dev
```
To run test use:

```js
npm test
```
**IMPORTANT**:If the script tests are use the example database

## Documentation from the API

For the documentation i used APIDOC, if run the aplication we can locate the documentation in the path of the aplication /docs/.

```
http://localhost:3000/doc
```

## Images Folder

The images folder to charge the images in relative path of the data returnet from the API.

```
http://localhost:3000/ads/<name_of_image>
```


DevOps
======

The Server is running in production mode in the server:

```
creativedevelopers.es
```

Parts
------

We have 3 parts in the server:

* Documentation: creativedevelopers.es
* API: creativedevelopers.es
* Information: ip

Installation in a server
------------------------

We have a Docker-Compose to run in a server with a MongoDB and we have a simple docker image to run in a server without 
MongoDB. In these repo in the folder scripts we have the docker-compose.yml.

The docker image run with pm2. http://pm2.keymetrics.io/

Structure Server
----------------
The server has 3 parts:

* nginx: Inverse-proxy with the node. This server do inverse proxy with the api and serve the static files. 
* node-pm2 (docker-composite): Docker container with pm2 and node. We have a volume in www folder (var) and the 
next enviroments:
 * DB = link or ip from the database. (default:localhost)
 * CLUSTER = boolean that run in cluster mode (default:false)
 * LOCALHOST = boolean that run api only in the 127.0.0.1 interface. (default:false)
 * PORT = int that run in the port (default:3000)
* mongodb (docker-composite): Docker containter with the mongodb. We have a volume for data folder. 

