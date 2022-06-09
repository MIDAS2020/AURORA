const express = require('express')
const busboy = require('connect-busboy')
const app = express()
const fs = require('fs-extra')
const { spawn, spawnSync } = require('child_process')
const utilities = require('./utilities')

app.use(busboy())

app.use('/css', express.static('css'))
app.use('/js', express.static('js'))
app.use('/fonts', express.static('fonts'))
app.use('/img', express.static('img'))

app.get('/AURORA', (req, res) => res.sendFile(`${__dirname}/AURORA.html`))

app.get('/datastores', (req, res) => {
    res.json(fs.readdirSync(`${__dirname}/data`)
        .filter(name => fs.existsSync(`${__dirname}/data/${name}/graph`))
        .map(name => {
            return {
                name: name,
                status: fs.existsSync(`${__dirname}/data/${name}/patterns.json`)
                    && fs.existsSync(`${__dirname}/data/${name}/labels.json`)
                    && fs.existsSync(`${__dirname}/data/${name}/limits.json`)
                    ? 'Ready'
                    : fs.existsSync(`${__dirname}/data/${name}/error`)
                        ? `Failed (${fs.readFileSync(`${__dirname}/data/${name}/error`)})`
                        : fs.existsSync(`${__dirname}/data/${name}/progress`)
                            ? `Preparing (${fs.readFileSync(`${__dirname}/data/${name}/progress`)}%)`
                            : 'Pending'
            }
        }))
})

app.post('/datastores', (req, res) => {
    req.busboy.on('field', (key, value) => {
        let name = value
        if (fs.existsSync(`${__dirname}/data/${name}`) && (!fs.existsSync(`${__dirname}/data/${name}/graph`) || fs.existsSync(`${__dirname}/data/${name}/error`))) // re-upload graph file of a datastore with invalid uploaded file
            fs.removeSync(`${__dirname}/data/${name}`)
        try {
            fs.mkdirSync(`${__dirname}/data/${name}`)
        }
        catch (err) {
            if ('EEXIST' == err.code) {
                res.json({
                    success: false,
                    message: 'Duplicate datastore name or invalid datastore name!'
                })
                return
            }
            else if ('ENOENT' == err.code) {
                res.json({
                    success: false,
                    message: 'Invalid datastore name!'
                })
                return
            }
        }
        req.busboy.on('file', (fieldname, file, filename) => {
            let fstream = fs.createWriteStream(`${__dirname}/data/${name}/graph`)
            file.pipe(fstream)
            fstream.on('close', function () {
                let davinci = spawn('./Avatar', [name, '-step1'])
                davinci.stdout.on('data', (data) => {
                    utilities.appendLog(`${__dirname}/data/${name}/graph_log`, `stdout: ${data}`)
                });
                davinci.stderr.on('data', (data) => {
                    utilities.appendLog(`${__dirname}/data/${name}/graph_log`, `stderr: ${data}`)
                });
                davinci.on('close', (code) => {
                    utilities.appendLog(`${__dirname}/data/${name}/graph_log`, `child process exited with code ${code}`)
                    if (0 != code)
                        fs.writeFile(`${__dirname}/data/${name}/error`, 'Runtime error')
                });
                res.json({ success: true })
            })
        })
    })
    req.pipe(req.busboy)
})

app.get('/datastores/:name/labels', (req, res) => {
    let name = req.params['name']
    let content = fs.readFileSync(`${__dirname}/data/${name}/labels.json`, 'utf8')
    res.json(JSON.parse(content))
})

app.get('/datastores/:name/limits', (req, res) => {
    let name = req.params['name']
    let content = fs.readFileSync(`${__dirname}/data/${name}/limits.json`, 'utf8')
    res.json(JSON.parse(content))
})

app.get('/datastores/:name/infos', (req, res) => {
    let name = req.params['name']
    let content = fs.readFileSync(`${__dirname}/data/${name}/GraphInfo.json`, 'utf8')
    res.json(JSON.parse(content))
})

app.get('/datastores/:name/patterns', (req, res) => {
    let name = req.params['name']
    let num = req.query['num']
    let minSize = req.query['minSize']
    let maxSize = req.query['maxSize']
    let davinci = spawn('./Avatar', [name, '-step2', num, minSize, maxSize])
    davinci.stdout.on('data', (data) => {
        utilities.appendLog(`${__dirname}/data/${name}/patterns${num}-${minSize}-${maxSize}_log`, `stdout: ${data}`)
    })
    davinci.stderr.on('data', (data) => {
        utilities.appendLog(`${__dirname}/data/${name}/patterns${num}-${minSize}-${maxSize}_log`, `stderr: ${data}`)
    })
    davinci.on('close', (code) => {
        utilities.appendLog(`${__dirname}/data/${name}/patterns${num}-${minSize}-${maxSize}_log`, `child process exited with code ${code}`)
        let content = fs.readFileSync(`${__dirname}/data/${name}/patterns${num}-${minSize}-${maxSize}.json`, 'utf8')
        res.json(JSON.parse(content))
    })
})

app.get('/datastores/patterns_davinci', (req, res) => {
    let name = req.query['labelType']
    let num = req.query['num']
    let minSize = req.query['minSize']
    let maxSize = req.query['maxSize']

    console.log(name)

    let davinci = spawn('./dist/davinci', [name, minSize, maxSize, num])
    davinci.stdout.on('data', (data) => {
        utilities.appendLog(`${__dirname}/data/${name}/patterns${num}-${minSize}-${maxSize}_log`, `stdout: ${data}`)
    })
    davinci.stderr.on('data', (data) => {
        utilities.appendLog(`${__dirname}/data/${name}/patterns${num}-${minSize}-${maxSize}_log`, `stderr: ${data}`)
    })
    davinci.on('close', (code) => {
        console.log("Done generating patterns using DAVINCI.exe")
        // utilities.appendLog(`${__dirname}/data/${name}/patterns${num}-${minSize}-${maxSize}_log`, `child process exited with code ${code}`)
        // let content = fs.readFileSync(`${__dirname}/data/${name}/patterns${num}-${minSize}-${maxSize}.json`, 'utf8')
        // res.json(JSON.parse(content))

        let patterns = utilities.readLocalPatternsFile('./dist/patterns/thumbnails/GUIPatterns.txt')
        console.log("Done readLocalPatternsFile")
            if (patterns.length > 0)
                res.json({
                    success: true,
                    patterns_davinci: patterns
                })
            else
                res.json({
                    success: false,
                    message: 'Error'
                })
        
        //let name = new Date().getTime()
        //let fstream = fs.createWriteStream(`${__dirname}/data/${name}.txt`)
        //let readStream = fs.createReadStream(file)
        //file.pipe(fstream)
        //fstream.on('close', function () {
        //    let patterns = utilities.readLocalPatternsFile(`${__dirname}/data/${name}.txt`)
        //    if (patterns.length > 0)
        //        res.json({
        //            success: true,
        //            patterns: patterns
        //        })
        //    else
        //        res.json({
        //            success: false,
        //            message: 'Error'
        //        })
        //})
        //req.pipe(readStream)
    })
})

app.post('/load', (req, res) => {
    req.busboy.on('file', (fieldname, file, filename) => {
        let name = new Date().getTime()
        let fstream = fs.createWriteStream(`${__dirname}/data/${name}.txt`)
        file.pipe(fstream)
        fstream.on('close', function () {
            let patterns = utilities.readLocalPatternsFile(`${__dirname}/data/${name}.txt`)
            if (patterns.length > 0)
                res.json({
                    success: true,
                    patterns: patterns
                })
            else
                res.json({
                    success: false,
                    message: 'Error'
                })
        })
    })
    req.pipe(req.busboy)
})

const server = app.listen(3000)
server.setTimeout(0)
