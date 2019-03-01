console.log('Sentinel 1.0.0\n')
// Allow config through a custom environment variable...
if (process.env["SENTINEL_CONFIG_DIR"])
    process.env["NODE_CONFIG_DIR"] = process.env["SENTINEL_CONFIG_DIR"]

// Default config, only for a short while...
var config = {
    debug: {
        envSet: false,
        path: '*'
    }
}

// Allow for debug config through the config file...
if (!process.env["DEBUG"]) {
    process.env["DEBUG"] = config.debug.path
} else {
    config.debug.envSet = true
}

// Load debugging...
let debug = require('debug')('sentinel:system')
debug('Booting.')


// Handle errors...
const exitHandler = require('./src/errors')
debug('Error handler installed.')

// Load our config...
try {
    config = require('config')
} catch (e) {
    exitHandler(e, true)
}
debug('Configuration loaded successfully.')

// Load our watcher...
const watch = require('chokidar')
let watcher = {}
// Watch the folder if it exists...
if (require('fs').existsSync(config.watch.folder)) {
    watcher = watch.watch(config.watch.folder)
    debug(`Watcher attached to "${config.watch.folder}"`)
} else {
    exitHandler(`can't find the folder "${config.watch.folder}". Please create it or change config.`, true)
}

const addFile = async (file) => {
    console.log('DOING STUFF TO', file)
    const csv = require('csvtojson')
    const json = await csv({delimiter:"\t"}).fromFile(file)
    console.log(json)
    const fs = require('fs')
    fs.writeFileSync(config.output.folder+ '/output.json', JSON.stringify(json, null, 2))
}

watcher.on('ready', () => {
    debug('Watcher now ready and listening.')
    let events = {
        fileCreated: { name: 'add', op: addFile },
        // fileDeleted: { name: 'unlink' },
        // folderCreated: { name: 'addDir' },
        // folderDeleted: { name: 'unlinkDir' }
    }
    Object.keys(events).forEach((event) => {
        events[event].log = require('debug')('sentinel:observed:' + event)
        watcher.on(events[event].name, path => {
            events[event].log(path)
            events[event].op(path)
        })    
    })
    watcher.on('error', error => {
        // Ignore EPERM errors in windows, which happen if you delete folders...
        if (error.code === 'EPERM' && require('os').platform() === 'win32') return 
        debug('error', error)
    })
})

