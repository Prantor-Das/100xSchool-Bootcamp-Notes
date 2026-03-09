// Callback
// A callback in JavaScript is a function passed as an argument to another function, which is then executed (or "called back") at a later point in time.
function createQuote(quote, callback) {
  var myQuote = "Like I always say, " + quote;
  callback(myQuote); // The callback function is executed here
}

function logQuote(quote) {
  console.log(quote);
}

// Pass logQuote as a callback to createQuote
createQuote("eat your vegetables!", logQuote); 
// Output: Like I always say, eat your vegetables!


// Code to read a file `synchronously`
const fs = require("fs");
const path = require("path");
// path:- A built-in module that helps you work with and 
// manipulate file and folder paths safely across different operating systems.

const filepath = path.join(__dirname, "a.txt");
const contents = fs.readFileSync(filepath, "utf-8");
console.log(contents+"1");

// Code to read a file `asynchronously`

// Using a Callback
// readfile is an asynchronous function
fs.readFile("a.txt", "utf-8", (err, content) => {
  // Why err first not content because its error first callback like in go language
  // The pattern (err, content) => { ... } is known as an Error-first callback in Node.js, 
  // a convention adopted to handle the inherent asynchronous nature of I/O operations and the possibility of failure [1]. 
  if (err) {
    console.error(err);
    return;
  }
  console.log(content+"2");
});

// Using Promises + async/await
const fspromise = require("fs/promises");

async function readFile() {
  try {
    const content = await fspromise.readFile("a.txt", "utf-8");
    console.log(content+"3");
  } catch (err) {
    console.error(err);
  }
}

readFile();

// Functional Arguments
function sum(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

function subtract(a, b) {
  return a - b;
}

function divide(a, b) {
  return a / b;
}

function doOperation(a, b, op) { // Passing a full-blown function as input
  return op(a, b)
}

console.log(sum(1, 2))
console.log(doOperation(1, 2, sum))
console.log(doOperation(2, 4, multiply))

// Waithing for 1 sec
// let beforeTime = Date.now();
// for(let 1=0;i<100000000000;i++){
//  let currentTime = Date.now();
//  if(currentTime-beforeTime>=1000) {
//    break;
//  }
// }

// setTimeout
// function run() {
// 	console.log("I will run after 1s");
// }

// const a = 10;
// const b = 20;

// console.log(a);
// console.log(b);

// function sum_run() {
//   console.log(a + b);
// }

// setTimeout(sum_run, 1000)
// setTimeout(() => {
//   console.log(sum(a,b) + " call");
// },1000)

// setTimeout(run, 1000);
// console.log("I will run immedietely");

// Input from user in terminal
// Using readline
// const readline = require("readline");

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.question("Enter your name: ", function(name) {
//   console.log("Hello " + name);
//   rl.close();
// });

// // Modern async/await version (cleaner)
// const rl_promise = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// async function main() {
//   const name = await rl_promise.question("Enter your name: ");
//   console.log("Hello " + name);
//   rl_promise.close();
// }

// main();
// Earlier it gave error as we cannot have two readline interfaces active at the same time on process.stdin. 
// The trick is:
// Close the first interface before creating the second one.
// Think of it like only one program can “listen” to the keyboard at a time. 

const readline = require("readline");
const readlinePromise = require("readline/promises");

// First: callback version
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter your first name: ", function(name) {
  console.log("Hello " + name);

  rl.close(); // close first interface

  // Second: async/await version
  const rl2 = readlinePromise.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  async function askAgain() {
    const name2 = await rl2.question("Enter your last name: ");
    console.log("Nice to meet you " + name + " " + name2);
    rl2.close();
  }

  askAgain();
});