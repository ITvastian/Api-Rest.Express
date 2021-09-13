function log(req, res, next){
    console.log('logging...');
    next();
}
module.exports = log;//exporto ha file app.js la funcion log