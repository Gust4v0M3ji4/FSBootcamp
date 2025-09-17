let counter = 0;

return module.exports = (req, res, next) => {
    /** APM: Application Performance Monitoring */
   console.log(`${req.method} ${req.url}`);
   if (req.body) {
    console.log(`${JSON.stringify(req.body, null, 2)}`);
   }
   console.log('--------------------------------');
   console.log('Request IP:', req.ip);
   console.log('Request Time:', new Date().getTime());
   /** Contador de requests */
   counter = counter + 1;
   req.counter = counter;

   /* Rate limiter DDOS */
   
   console.log('Headers:', req.headers);
   next();
}