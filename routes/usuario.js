const { Router } = require('express');
const { check } = require('express-validator');

const { usuarioPost, usuarioDelete, usuarioId, validarCorreo, usuarioCedula, usuarioUpdate, getAsesores} = require("../controllers/usuario");
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { esAdminRole } = require('../middlewares/validar-role');
const { validarToken } = require('../middlewares/validar-token');


const router = Router();

router.get('/getAsesores', getAsesores);

router.get('/:id', usuarioId);

router.get('/cedula/:cedula', usuarioCedula);

//Buscar todos los asesores registrados

// Validar Correo
router.get('/correo/:correo', [
    check('correo', 'correo invalido').isEmail(),
    validarCampos
], validarCorreo);

// CREAR USUARIO
router.post('/post', 
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('cedula').not().isEmpty(),
    check('correo','El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    check('password','El password debe tener mas de 6 caracteres').isLength({min:6}),
    check('rol').custom(esRolValido)
    ,
    validarCampos
,usuarioPost);

// ACTUALIZAR ESTUDIANTE
router.put('/put/:id', usuarioUpdate);

router.post('/post/estudiante',
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('telefono','El telefono es obligatorio').not().isEmpty(),
        check('cedula').not().isEmpty(),
        check('correo','El correo no es valido').isEmail(),
        check('correo').custom(emailExiste),
        check('rol').custom(esRolValido)
,usuarioPost)



// ELIMINAR USUARIO
router.delete('/delete/:id',[
    validarToken,
    esAdminRole,
    check('id', 'no es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuarioDelete)


module.exports = router;