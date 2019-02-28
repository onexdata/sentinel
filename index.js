const watcher = require('node-watch')(process.argv[2] || './', {recursive: true}, (event, file) => {
    console.log(`${file} ${event} detected`)
});

// Fall from grace (user closed the app)...
process.on('SIGINT', e => {
    console.log('Shutting down...')
    watcher.close();
    console.log('Successful!')
})