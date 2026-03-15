// Classes:- In JavaScript, classes are a way to define blueprints for creating objects (different type of object)

class Rectangle {
   constructor(width, height, color) { // defines the structure of the objects created from that class
	    this.width = width;
	    this.height = height;
	    this.color = color; 
   }
  
  static whoami() {
    return "I am a rectangle"
   } // are methods those are attached to class cannot be called directly like rect.whoami()
  
   area() { // non static method
	   const area = this.width * this.height; // here this is set to rect, the "this" points to rect
		 return area;
   }
   
   paint() {
			console.log(`Painting with color ${this.color}`);
   }
   
}

const rect = new Rectangle(2, 4, "red");
// console.log(rect);// Rectangle { width: 2, height: 4, color: 'red' }
const rec = new Rectangle(2, 4); //For this the paint will be undefined as its not passed 
const area = rect.area();
rect.paint();

console.log(area);
// console.log(rect.whoami()); // rect.whoami is not a function

// Rectangle (class) 
//    ↓
// rect (object)


// Date Class
const now = new Date(); // Current date and time
console.log(now); // Full date object

// // Date Format Methods
// console.log(now.toISOString());     // ISO format
// console.log(now.toDateString());    // Human readable date
// console.log(now.toTimeString());    // Time with timezone
// console.log(now.toLocaleDateString()); // Local date format
// console.log(now.toLocaleTimeString()); // Local time format
// console.log(now.toLocaleString());     // Local date + time

// // Get Methods
// console.log(now.getFullYear());  // Year
// console.log(now.getMonth());     // Month (0-11)
// console.log(now.getDate());      // Day of month
// console.log(now.getDay());       // Day of week (0-6)

// console.log(now.getHours());     
// console.log(now.getMinutes());   
// console.log(now.getSeconds());   
// console.log(now.getMilliseconds());

// console.log(now.getTime()); // Milliseconds since Jan 1, 1970

// // UTC Methods
// console.log(now.getUTCFullYear());
// console.log(now.getUTCMonth());
// console.log(now.getUTCDate());
// console.log(now.getUTCHours());

// // Set Methods
// now.setFullYear(2030);
// now.setMonth(5); // June
// now.setDate(15);

// now.setHours(10);
// now.setMinutes(30);
// now.setSeconds(45);

// console.log(now);

// // Static Methods
// console.log(Date.now()); // Current timestamp

// getMonth() → 0–11 (January = 0)
// getDay() → 0–6 (Sunday = 0)

// Output
// 2026-03-10T05:02:13.641Z
// 2026-03-10T05:02:13.641Z
// Tue Mar 10 2026
// 10:32:13 GMT+0530 (India Standard Time)
// 3/10/2026
// 10:32:13 AM
// 3/10/2026, 10:32:13 AM
// 2026
// 2
// 10
// 2
// 10
// 32
// 13
// 641
// 1773118933641
// 2026
// 2
// 10
// 5
// 2030-06 - 15T05:00: 45.641Z
// 1773118933692

// Maps
const map = new Map();
map.set('name', 'Alice');
map.set('age', 30);
console.log(map.get('name'));
console.log(map.get('age'));
// console.log(map.get()); // undefined


// without classes
function area1(r) {
  return r.width * r.height;
}

let r1 = {
  width: 20,
  height: 30,
  color: "red"
}

let r2 = {
  width: 10,
  height: 20,
  color: "green"
}

console.log(area1(r1));
console.log(area1(r2));


// Inheritance
// Allows one class to inherit properties and methods from another class. 
// This mechanism enables code reuse, making it easier to create new classes that are based on existing ones, without having to duplicate code.
class Shape {
    constructor(color) {
        this.color = color;
    }

    paint() {
			console.log(`Painting with color ${this.color}`);
    }

  area() {
  //gives error if base class that extends this class have forgot to implement it
  // expects to be override
        throw new Error('The area method must be implemented in the subclass');
    }

    getDescription() {
        return `A shape with color ${this.color}`;
    }
}

class Rect extends Shape {
    constructor(width, height, color) {
        super(color);  // Call the parent class constructor to set the color
        this.width = width;
        this.height = height;
    }

    area() {
        return this.width * this.height;
    }

    getDescription() {
        return `A rectangle with width ${this.width}, height ${this.height}, and color ${this.color}`;
    }
}

class Circle extends Shape {
    constructor(radius, color) {
        super(color);  // Call the parent class constructor to set the color
        this.radius = radius;
    }

    area() {
        return Math.PI * this.radius * this.radius;
    }

    getDescription() {
        return `A circle with radius ${this.radius} and color ${this.color}`;
    }
}

const rectangle = new Rect(102, 20, "Red");
const c1 = new Circle(20, "yellow");
console.log(rectangle.area());
console.log(rectangle.getDescription());
rectangle.paint();
