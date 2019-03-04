const process = {
    decompress (from, to) {
        console.log(`Decompressing from ${from} to ${to}`)
    },
    copy (from, to) {
        console.log(`Copying from ${from} to ${to}`)
    }
}

function runEMS(path) {
    console.log(`Running EMS on ${path}...`)
}

async function CSV2JSON(path) {
    console.log(`converting ${path} to JSON`)
    const csv = require('csvtojson')
    return await csv({delimiter:"\t"}).fromFile(path)
}

function checkTransactionSchema(data) {
    return true
}

function exportToDB(data, dbService) {
    console.log('Exporting to DB...')
    dbService.create(data)
    console.log(`The transaction stored to the database.`)
}

function archiveFiles(upload, temp, csv) {
    console.log(`Archiving ${upload}, ${temp}, ${csv}`)
}

module.exports = ({app, watcher, config, util}) => {
    return async uploadedFile => {
        console.log(`Processing uploaded file ${uploadedFile}...`)

        // Get the timeFile name...
        const tempFile = uploadedFile + '.temp'

        // Get the dbService...
        const dbService = app.services.transaction
        
        // Calculate the file processing strategy...
        const strategy = ['.zip', '.gz'].includes(util.fileExt(uploadedFile)) ?
            'decompress' :
            'copy';

        // Decompress or copy the file...
        console.log('Choosing', strategy)
        process[strategy](uploadedFile, tempFile)

        // Get the CSV output...
        const csvFile = uploadedFile // runEMS(tempFile)

        // Get the JSON output...
        let transaction = await CSV2JSON(csvFile)
        transaction = { from: 1, to: 1, contents: JSON.stringify(transaction) }
        // Verify the JSON Schema...
        if (checkTransactionSchema(transaction)) {
            // Save it to the database...
            exportToDB(transaction, dbService)
        } else {
            console.log(`The transaction wasn't valid. Alerting...`)
            app.services.alert.create('SchemaCheckFailed', transaction)
        }

        app.services.alert.create({name: 'everythingWorked'}, transaction)
        // Archive files involed...
        archiveFiles(uploadedFile, tempFile, csvFile)
    }
}