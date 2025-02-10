# Question Service

## Description

This service is used to manage the programming questions given to the users after matching. It uses MongoDB Atlas to host a cloud database to manage the questions. The service comes with a RESTful API interface to support Create, Read, Update and Delete (CRUD) operations.

This service also includes Jest for unit testing on an isolated Mongo Memory DB server to ensure that all the endpoints work as required.

## Setup

1. Install Node version 18 or above.
2. Run `npm install` to install the dependencies required.
3. Create `.env` file in the `/questions` folder, copying the content from `sample.env`, setting `NODE_ENV` as `DEV` and filling in the MONGO_URI.
4. Run `npm start` to start the service.

## API Documentation

Refer to [`question.yaml`](./docs/question.yaml) file for the API documentation.
