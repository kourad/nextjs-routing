# NEXTJS - Routing and middleware helpers

A small libraries to manage middlewares and routing on nextjs

## Motiviation

The main idea of this library is to make it easier to build complex APIs in NextJS. 

Since my website has more complex API needs, (authentication, logging, etc) I have discovered that nextjs
is quite simple when it comes to building your API endpoints. For example, you do not have a convenient way to differentiate
if your request is of type GET or POST, that added to the difficulty of adding middlewares to extend the functionality has led me to create this library.


## INSTALL

```
npm install nextjs-routing
yarn add nextjs-routing
```

## HOW TO START

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


**More on next update**


