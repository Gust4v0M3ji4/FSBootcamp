const testCallback = ( text, callback) => { 
     setTimeout(() => {
        callback(null, `El texto es: ${text} - ${new Date().toISOString()}`);
     }, 5000) 
}

const testPromise = async ( text) => { 
    return new Promise((resolve, reject) => {    
        setTimeout(() => {
            resolve(`El texto es: ${text} - ${new Date().toISOString()}`);
        }, 5000)
    })
}


const data = await testPromise('Hola Promise');
console.log(data);

// testPromise('Hola Promise').then(data => {
//     console.log(data);
// }).catch(err => {
//     console.error(err);
// });



// testCallback('Hola', (err, data) => {
//     if(err){
//         console.error(err);
//     } else {
//         console.log(data);
//     }
// }); 