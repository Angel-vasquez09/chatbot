const socket          = require('./socket');
const webPush         = require('./webpush');
const asesor          = require('./asesor');
const usuario         = require('./usuario');
const auth            = require('./auth');
const subNotification = require('./subsNotification');



module.exports = {
    ...socket,
    ...webPush,
    ...usuario,
    ...subNotification,
    ...auth,
    ...asesor
}