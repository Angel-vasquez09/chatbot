const { Router }                     = require('express');
const { check }                      = require('express-validator');
const { postMensajeAutomatico, getPorClave }                = require('../controllers/bot');
const { validarCampos }              = require('../middlewares/validar-campos');
const { validarToken }               = require('../middlewares/validar-token');

const router = Router();


router.get('/:clave', getPorClave);

router.post('/', postMensajeAutomatico );


module.exports = router;