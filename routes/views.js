const { Router } = require('express');


const router = Router();


router.get('/home', (req, res) => {
    res.render('home', { // Mandamos algumentos a la pagina home
        titulo: 'Chat Bot'
    });
});


router.get('/administrativos', (req, res) => {
    res.render('administrativos');
})

router.get('/asesor', (req, res) => {
    res.render('asesor');
})



module.exports = router;