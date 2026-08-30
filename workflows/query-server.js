const fs = require("fs");

async function run() {

    const output = {
        online: false,
        name: "Community Deadside",
        address: "144.126.153.170:35200",
        queryPort: 35215,
        players: 0,
        maxPlayers: 0,
        ping: null,
        map: null,
        updated: new Date().toISOString()
    };

    try {

        const { GameDig } = await import("gamedig");

        console.log("GameDig loaded.");

        console.log(
            "Querying 144.126.153.170:35215..."
        );

        const state = await GameDig.query({
            type: "protocol-valve",
            host: "144.126.153.170",
            port: 35215,
            givenPortOnly: true,
            socketTimeout: 5000,
            attemptTimeout: 10000
        });

        console.log("========== RESPONSE ==========");
        console.log(state);

        output.online = true;

        output.name =
            state.name || "Community Deadside";

        output.players =
            Array.isArray(state.players)
                ? state.players.length
                : 0;

        output.maxPlayers =
            state.maxplayers || 0;

        output.ping =
            state.ping ?? null;

        output.map =
            state.map ?? null;

    } catch (error) {

        console.log("========== QUERY FAILED ==========");

        console.log(error);

    }

    output.updated =
        new Date().toISOString();

    fs.writeFileSync(
        "server-status.json",
        JSON.stringify(output, null, 4)
    );

    console.log(
        "========== JSON WRITTEN =========="
    );

    console.log(
        fs.readFileSync(
            "server-status.json",
            "utf8"
        )
    );
}

run();