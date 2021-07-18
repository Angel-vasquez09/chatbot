const { response } = require("express")
const Subscription = require("../models/subsNotification");


const obtenerUserSubscrito = async(req, res = response) => {

    const { id } = req.params;

    try {

        const verificarId = await Subscription.findOne({id: id});

        if (verificarId !== null) {

            return res.json({
                ok: true,
                verificarId
            });
            
        }
    } catch (error) {
        console.log('Este es el erro =>' + error)
    }
}



const guardarSubscriptionUser = async(req, res = response) => {
    
    const { id, subcription} = req.body;
    
    try {
        
        const verificarId = await Subscription.findOne({id: req.body.id});
        
        if (verificarId !== null) {

            verificarId.subcription = subcription;
            await verificarId.save();

            return res.json({
                ok: true,
                verificarId
            })

        }else{

            const guardarSubscription = new Subscription({id,subcription});
            await guardarSubscription.save();

            return res.json({
                ok: true,
                guardarSubscription
            })
        }
        

    } catch (error) {
        console.log('Error en la base de datos' + error)
    }

}

module.exports = {
    guardarSubscriptionUser,
    obtenerUserSubscrito
}