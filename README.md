# NEXTJS - Routing and middleware helpers

A small libraries to manage middlewares and routing on nextjs

## Motiviation

The main idea of this library is to make it easier to build complex APIs in NextJS. 

Since my website has more complex API needs, (authentication, logging, etc) I have discovered that nextjs
is quite simple when it comes to building your API endpoints. For example, you do not have a convenient way to differentiate
if your request is of type GET or POST, that added to the difficulty of adding middlewares to extend the functionality has led me to create this library.


## Install

```
npm install nextjs-routing
yarn add nextjs-routing
```

## How to start

```javascript
// /api/test.js
import { runWithMiddlewares } from "nextjs-routing";


// First function called on POST Request
function myFunction1(req, res, next) {
    // your code here
    next();
}
// Second function called on POST Request
function myFunction2(req, res, next) {
    // your code here
    next();
}

// Function called on GET Request
function myFunction3(req, res, next) {
    // your code here
    next();
}

export default runWithMiddlewares({
    POST: [myFunction1, myFunction2],
    GET: [myFunction3]
});
```

## Middleware pattern

All methods added must follow the pattern from expressjs, so our functions looks like:


```javascript
function middleware(req, res, next) {
    // your code here.
}

function errorMiddleware(error, req, res, next) {
    // your code here
}
```


## Pass data trought different handlers

The runWithMiddlewares method implements a value map to pass data between different handlers.

```javascript

function handler1(req, res, next) {
    // add data to the route
    req.set('mydata', {
        // some data
    });
    next();
}

function handler2( req, res, next ) {
    const mydata = req.get('mydata');

    // code...
}

export default runWithMiddlewares({
    POST: [handler1, handler2],
});

```



## Override the error handler

You can override the error handler providing your own function.

```javascript
export default runWithMiddlewares({
    /* ...your config */
}, function (error, req, res, next) {
    // GET THE ERROR HERE
});
```


# API

## runWithMiddlewares(handlers: Object, errorHandler?: Function)

**handlers**: Map with the error handlers to execute

**errorhandler**: Function executed when any error is submited

Example:

```javascript
runWithMiddlewares({
    GET: [...functions],
    POST: [...functions],
    UPDATE: [...functions],
    DELETE: [...functions],
}, (error, req, res, next) => {

})
```



**More on next update**


