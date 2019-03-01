const debug = require('debug')('sentinel:system')
const EXCEPTION = 'experienced an uncaught exception'

// Called only by the exitHandler below, NEVER call this by itself...
const _shutdown = function () {
    debug('Shutdown is being performed...')
    process.exit(0)
}

// Called by process events below...
const exitHandler = function (reason, byDesign) {
    // If we got here by design, we're passing an error string, so format it...
    if (byDesign && reason !== EXCEPTION) {
        if (reason instanceof Error) reason = reason.toString()
        reason = reason
            .replace(/^Error\: /, '')  // Get rid of preceeding "Error:" if exists.
            .replace(/\s\s+/g, ' ')    // Get rid of new lines and excessive whitespace.
        reason = reason.charAt(0).toLowerCase() + reason.slice(1)
    }
    debug(`Exiting because Sentinel ${reason}`)
    if (reason === EXCEPTION) {
        debug(byDesign)
    }
    _shutdown()
    debug(`Exit complete`)    
    console.log('now here')
};

// Handle all exit forms...
// process.on('exit', exitHandler.bind(null, 'was told to exit healthy.'));
process.on('SIGTERM', exitHandler.bind(null, 'was killed by the supervisor'));
process.on('SIGPIPE', exitHandler.bind(null, 'was killed by an internal file change'));
process.on('SIGHUP', exitHandler.bind(null, 'was closed by a console window'));
process.on('SIGBREAK', exitHandler.bind(null, 'was closed by a windows break command'));
process.on('SIGINT', exitHandler.bind(null, 'was commanded to (a user pressed [ctrl+c] at the terminal)'));
// process.on('uncaughtException', exitHandler.bind(null, EXCEPTION));

module.exports = exitHandler