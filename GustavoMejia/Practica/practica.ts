// //CREACION DE CLASES 
// class User {
//     name: string;
//     age: number;
//     #password: string;

//     constructor(name: string, age: number, password: string) {
//         this.name = name;
//         this.age = age;
//         this.#password = password;
//     }

//     checkPassword(input: string): boolean {
//         return input === this.#password;
//     }

//     changePassword(current: string, newPassword: string) {
//         if (this.checkPassword(current)) {
//             this.#password = newPassword;
//         }
//     }

//     greet(): string {
//         return `Hola, soy ${this.name} y tengo ${this.age} años`;
//     }

//     checkAge(): boolean {
//         if (this.age >= 18) {
//             return true
//         } else {
//             return false
//         }
//     }
// }
// // CREACION DE CLASE ADMIN PARA HERENCIA
// class Admin extends User {
//     role: string = 'admin';

//     deleteUser(user: User) {
//         console.log(`Eliminando al usuario ${user.name}`);
//     }

//     greet(): string {
//         return `Hola soy un administrador, mi nombre es ${this.name}`;
//     }
// }

// // CREACION DE PRODUCT PARA EL TALLER 3 FUTURO

// class Product {
//     name: string;
//     price: number;

//     constructor(name: string, price: number) {
//         this.name = name;
//         this.price = price;
//     }
// }

// //INSTANCIANDO LAS CLASES EN OBJETOS
// const user1 = new User('Alice', 25, 'assa');
// const user2 = new User('Gustavo', 25, 'asfdas');
// const user3 = new User('Juan', 6, 'asfaaa');

// const admin1 = new Admin('Admin Jose', 19, 'salala')
// //OUT PRINTS
// console.log(user1)
// console.log(user2)
// console.log(user3)

// console.log(admin1.greet());
// console.log(user3.checkAge());

// // console.log(admin1.deleteUser(user1));


// // interface practice

// interface Animal {
//     name: string;
//     scientificName: string;
//     makeSound(): void;
//     sleep(): void;
// }

// class Dog implements Animal {

//     constructor(
//         public name: string,
//         public scientificName: string
//     ) { }

//     makeSound(): void {
//         console.log('woof');
//     };
//     sleep(): void {
//         console.log('Sleeping zzz');
//     };
// }

// // ES ANIMAL PERO PUSE Z PARA EVITAR DUPLICACION
// abstract class Animalz {
//     constructor(public name: string, public scientificName: string) { }

//     abstract makeSound(): void;

//     move() {
//         console.log(`${this.name} está caminando`);
//     }
// }

// class Cat extends Animalz {
//     raza: string;
//     constructor(
//         name: string,
//         scientificName: string,
//         raza: string
//     ) {
//         super(name, scientificName);
//         this.raza = raza;
//     }
//     makeSound() {
//         console.log("Meow!");
//     }
// }