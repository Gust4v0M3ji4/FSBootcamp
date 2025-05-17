// // USO USER1 PARA NO DUPLICAR LA CLASE

// // class User1 {
// //     constructor(
// //         public name: string,
// //         public age: number,
// //         private password: string
// //     ) { }

// //     getPassword(): string {
// //         return this.password;
// //     }
// // }

// //   NOS AHORRAMOS HACER ESTO: 
// //   class User {
// //     name: string;
// //     age: number;
// //     #password: string;

// //     constructor(name: string, age: number, password: string) {
// //         this.name = name;
// //         this.age = age;
// //         this.#password = password;
// //     }




// // INTERFACE IN TYPESCRIPT 
// // EXAMPLE:
// // interface Animal {
// //     name: string;
// //     makeSound(): void;
// // }

// // class Dog implements Animal {
// //     name: string;

// //     constructor(name: string) {
// //         this.name = name;
// //     }

// //     makeSound() {
// //         console.log("Woof!");
// //     }
// // }