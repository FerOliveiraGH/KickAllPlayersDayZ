const BattleNode = require('battle-node')
require('dotenv').config()

var config = {
    ip: process.env.HOST,
    port: process.env.RCON_PORT,
    rconPassword: process.env.RCON_PASSWORD
}
const bnode = new BattleNode(config)

async function kickAllPlayers() {
    bnode.on('login', async function(err, success) {
        if (err) {
            console.log('Unable to connect to server.')
            throw new Error("Stop Execution")
            // await new Promise(r => setTimeout(() => r(), 5000))
            // await bnode.login()
        }
       
        if (success == true) {
            console.log('Logged in RCON successfully.')
        }
        else if (success == false) {
            console.log('RCON login failed! (password may be incorrect)')
            throw new Error("Stop Execution")
        }
    })
    
    bnode.on('message', async function(message) {
        console.log(message)
        let parts = message.trim().split(/\s+/)
        if (parts[4] == "connected") {
            await bnode.sendCommand(`kick ${parts[1].replace('#','')}`)
        }
    })

    await bnode.login()

//    await bnode.sendCommand(`#lock`, function(res) {
//        console.log("Lock Server")
//    })

    await bnode.sendCommand('players', async function(players) {
        const playerLines = players.split('\n').slice(3, -1)

        for(let i = 0; i < 5; i++) {
            await new Promise(r => setTimeout(() => r(), 1000))
            await bnode.sendCommand(`say -1 Você será desconectado agora!!!`) 
        }

        await playerLines.forEach(async line => {
            const parts = line.trim().split(/\s+/)
    
            await bnode.sendCommand(`kick ${parts[0]}`)
        })
    })

    bnode.on('disconnected', function() {
        console.log('RCON server disconnected.');
        throw new Error("Stop Execution")
    });
}

try {
    kickAllPlayers()
}
catch(e) {
    console.log(e)
}