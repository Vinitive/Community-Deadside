const fs = require("fs");

async function queryServer() {

    let GameDig;

    try {

        const module = await import("gamedig");

        GameDig = module.GameDig;

    } catch (error) {

        console.error("Could not load GameDig:", error);

        process.exit(1);

    }


    const output = {

        online: false,

        name: "Community Deadside",

        address: "144.126.153.170:35200",

        queryPort: 35215,

        players: 0,

        maxPlayers: 0,

        ping: null,

        map: null,

        version: null,

        updated: new Date().toISOString()

    };


    try {

        const state = await GameDig.query({

            type: "protocol-valve",

            host: "144.126.153.170",

            port: 35215,

            givenPortOnly: true,

            socketTimeout: 5000,

            attemptTimeout: 10000

        });


        console.log("SERVER RESPONSE:");

        console.log(state);


        output.online = true;

        output.name =
            state.name || "Community Deadside";

        output.players =
            Array.isArray(state.players)
                ? state.players.length
                : state.raw?.numplayers ?? 0;

        output.maxPlayers =
            state.maxplayers ?? 0;

        output.ping =
            state.ping ?? null;

        output.map =
            state.map ?? null;

        output.version =
            state.version ?? null;

    }

    catch (error) {

        console.error(
            "Deadside query failed:",
            error
        );

    }


    fs.writeFileSync(

        "server-status.json",

        JSON.stringify(
            output,
            null,
            4
        )

    );


    console.log(
        "server-status.json written:"
    );

    console.log(output);

}


queryServer();