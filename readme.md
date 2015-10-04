
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
http://localhost:3000/docs