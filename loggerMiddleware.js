const logger = (request, response, next)=>{
    console.log(request.method)
    console.log(request.path)
    console.log(request.body)
    console.log('-----')
    next()// el next es para que siga con la ejecucion. Sino se detiene aca
}

module.exports = logger