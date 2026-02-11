// Code to read a file `synchronously`
import fs from "fs";

const contents = fs.readFileSync("a.txt", "utf-8");
console.log(contents);

// Code to read a file `asynchronously`

// Using a Callback
fs.readFile("a.txt", "utf-8", (err, content) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(content);
});

// Using Promises + async/await
import fspromise from "fs/promises";

async function readFile() {
  try {
    const content = await fspromise.readFile("a.txt", "utf-8");
    console.log(content);
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

function doOperation(a, b, op) {
  return op(a, b)
}

console.log(doOperation(1, 2, sum))