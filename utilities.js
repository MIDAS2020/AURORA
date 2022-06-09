const fs = require('fs-extra')

exports.appendLog = function (filename, msg) {
    fs.appendFile(filename, `[${new Date().toLocaleString()}]\n${msg}\n`)
}

exports.readLocalPatternsFile = function (filename) {
    let patterns = []
    try {
        let data = fs.readFileSync(filename).toString()
        let lines = data.split(/\n/).map(line => line = line.trim())
        let nodeCnt = 0, nodeMap = {}, pattern = {}
        lines.forEach(line => {
            if (0 == line.length) {
                if (nodeCnt > 0) {
                    patterns.push(pattern)
                    nodeCnt = 0
                    nodeMap = {}
                    pattern = {}
                }
            }
            else if ('t' == line[0]) {
                if (nodeCnt > 0) {
                    patterns.push(pattern)
                    nodeCnt = 0
                    nodeMap = {}
                    pattern = {}
                }
                let a = line.split(' ')
                pattern.id = parseInt(a[2])
                nodeCnt = 0
                pattern.n = parseInt(a[3])
                pattern.e = []
                pattern.labels = []
            }
            else if ('v' == line[0]) {
                let a = line.split(' ')
                nodeMap[parseInt(a[1])] = nodeCnt++
                pattern.labels.push(parseInt(a[2]))
            }
            else if ('e' == line[0]) {
                let a = line.split(' ')
                pattern.e.push([
                    nodeMap[parseInt(a[1])],
                    nodeMap[parseInt(a[2])]
                ])
            }
        });
        if (nodeCnt > 0)
            patterns.push(pattern)
        return patterns
    }
    catch (ignore) {
        return []
    }
}

exports.readLocalPatternsFileV3 = function (filename) {
    let datastore = ''
    let patterns = []
    try {
        let data = fs.readFileSync(filename).toString()
        let lines = data.split(/\n/).map(line => line = line.trim())
        let nodeCnt = 0, nodeMap = {}, pattern = {}
        let isFirstLine = true
        lines.forEach(line => {
            if (isFirstLine) {
                datastore = line
                isFirstLine = false;
            } else if (0 == line.length) {
                if (nodeCnt > 0) {
                    patterns.push(pattern)
                    nodeCnt = 0
                    nodeMap = {}
                    pattern = {}
                }
            }
            else if ('t' == line[0]) {
                if (nodeCnt > 0) {
                    patterns.push(pattern)
                    nodeCnt = 0
                    nodeMap = {}
                    pattern = {}
                }
                let a = line.split(' ')
                pattern.id = parseInt(a[2])
                nodeCnt = 0
                pattern.n = parseInt(a[3])
                pattern.e = []
                pattern.labels = []
                pattern.isDefault = a[1] == 'defaults'
            }
            else if ('v' == line[0]) {
                let a = line.split(' ')
                nodeMap[parseInt(a[1])] = nodeCnt++
                pattern.labels.push(parseInt(a[2]))
            }
            else if ('e' == line[0]) {
                let a = line.split(' ')
                pattern.e.push([
                    nodeMap[parseInt(a[1])],
                    nodeMap[parseInt(a[2])]
                ])
            }
        });
        if (nodeCnt > 0)
            patterns.push(pattern)
        return {
            datastore: datastore,
            patterns: patterns
        }
    }
    catch (ignore) {
        return {
            datastore: '',
            patterns: []
        }
    }
}
