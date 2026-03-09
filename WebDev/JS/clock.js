const { log } = require("console");

let counter = 0;
function callback() {
  log(counter);
  counter++;
}
// Then its called
setInterval(callback, 1000);

// First its called 
let x = 0;
for (let i = 0; i < 123454321; i++) {
  x += i;
}
log(x);