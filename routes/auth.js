const { Router }                     = require('express');
const { check }                      = require('express-validator');
const { loginUsuario, renovarToken } = require('../controllers/auth');
const { validarCampos }              = require('../middlewares/validar-campos');
const { validarToken }               = require('../middlewares/validar-token');

const router = Router();


router.post('/login',[
    check('correo','El correo es obligatorio').isEmail(),
    validarCampos
] ,loginUsuario);


router.get('/',[
    validarToken,
] , renovarToken);


module.exports = router;