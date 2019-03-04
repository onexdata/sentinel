module.exports = ({app, watcher, config, util}) => {
    const processFile = require('./processFile.js')({app, watcher, config, util})
    watcher.on('ready', async () => {
        watcher.on('add', processFile)
    })
}
