const watch = require('chokidar')
const config = require('config')


console.log('Prepairing....', config)
const watcher = watch.watch(config.watch.folder)

watcher.on('ready', () => {
    console.log('Now watching....')
    watcher.on('add', path => {
        console.log(`File ${path} has been added...`)
    })
})
