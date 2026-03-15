// Promise is also a class
// Calling a promise is easy, defining your own promise is where things get hard

function setTimeoutPromisified(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function callback() {
	console.log("3 seconds have passed");
}

setTimeoutPromisified(5000).then(callback);
// (new.Rectangle(200,300).area());  -- .then() works the same way a .area()

/*
class Promise {
  constructor(){
  
  }
  then(){

  }
  catch() {
  
  }
  finally() { 
  
  }
}
*/
setTimeout(callback, 5000);

// Reading a file
const fs = require("fs");

function callback(err, data) {
  if (err) {
    console.log("error while reading the file");
  }
  console.log(data);
}

function trying(data) {
  console.log(data);
}
function catchErr() {
  console.log("error while reading the file");
}


function fsReadFilePromisified(filepath, encoding) {
  return new Promise((resolve, reject) => { // Its returning an object of the promise class
    fs.readFile(filepath, encoding, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}

// non promisified fs.readfile
fs.readFile("a.txt", "utf-8", callback);

// fsReadFilePromisified("a.txt", "utf-8").then(callback);
fsReadFilePromisified("a.txt", "utf-8")
  .then(trying)
  .catch(catchErr)