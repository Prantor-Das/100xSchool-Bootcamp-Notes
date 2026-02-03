// console.log("Hi There");

// JS is Dynamically Typed
// var a = 1;
// a = "harkirat";
// a = true;

// console.log(a);

// Variable
// let name = "John";     // Variable that can be reassigned
// const age = 30;        // Constant variable that cannot be reassigned
// var isStudent = true;  // Older way to declare variables, function-scoped

// Assignment
// let color = "black";
// let height = 176;
// let likePizza = false;
// console.log(`Color: ${color} \nHeight: ${height} \nLike Pizza: ${likePizza}`)

// Functions
// code block used to run a repetitive task
// 
// Function declaration
// function greet(name) {
//     return "Hello, " + name;
// }
//
// // Function call
// let message = greet("John"); // "Hello, John"
// console.log(message);
// 
// Assignment
// function isLegal(name, age) {
//   if (age >= 18) {
//     console.log(name + " is allowed to vote");
//   } else {
//     console.log(name + " is not allowed to vote");
//   }
// }
// 
// isLegal("Prantor", 20);
// isLegal("Shivam", 17);

// Objects
// An object in JavaScript is a collection of`key-value pairs`, 
// where each `key` is a string and each `value` can be any valid JavaScript data type, including another object.
// let user = {
// 	name: "Harkirat",
// 	age: 19
// }
// 
// console.log("Harkirats age is " + user.age);

// Arrays
// Arrays let you group data together
// const users = ["harkirat", "raman", "prantor", "diljeet"];
// const totalUsers = users.length;
// const firstUser = users[0];
// 
// console.log(`Total Users: ${totalUsers} \nFirst User: ${firstUser}`);

// Array of Objects
// We can have more complex objects, for example an array of objects
// const users = [{
// 		name: "Harkirat",
// 		age: 21
// 	}, {
// 		name: "raman",
// 		age: 22
// 	}
// ];
// 
// const user1 = users[0] 
// const user1Age = users[0].age
// console.log(user1);
// console.log(user1Age);

// Object of Objects
// We can have an even more complex object (object of objects)
// const user1 = {
// 	name: "harkirat",
// 	age: 19,
// 	address: {
// 		city: "Delhi",
// 		country: "India",
// 		address: "1122 DLF"
// 	}
// }
// 
// const city = user1.address.city;
// console.log(city);
