const authConfig = require('../config/authConfig')();

const roleMiddlware = (roles = ['administrador']) => (req, res, next) => {

    const forbidden = () => {
        const error = new Error("Usuário não autorizado!");
        error.status = 403;
        throw error;
    }

    if(req.login && !authConfig.bypass){
        const { tipo } = req.login
        console.log('tipo =====>', tipo)

        if(tipo && Array.isArray(tipo)){
            const temRole = roles.includes('all') || tipo.some( roleUser => roles.includes(roleUser))
            if(temRole){
                next()
            }else{
                forbidden()
            }

        }else{
            forbidden()
        }
    }else if(authConfig.bypass){
        next()
    }else{
        forbidden()
    }
}

module.exports = roleMiddlware