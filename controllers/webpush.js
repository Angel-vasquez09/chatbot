const { response } = require("express");

const webpush = require('../helpers/webpush');

// Notificar un nuevo mensaje a un usuario especifico
const newMessage = async(req, res = response) => {

    try {
        const { title, message, pushSubscription} = req.body;
        console.log(title);

        const payload = JSON.stringify({
            title  : title,
            message: message
        });

        console.log(pushSubscription);

        await webpush.sendNotification(pushSubscription,payload);


    } catch (error) {
        console.log('Este es el error x' + error);
    }
}


module.exports = {
    newMessage
}

