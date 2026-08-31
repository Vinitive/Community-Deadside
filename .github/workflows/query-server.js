const fs = require("fs");

const SERVER_URL = "https://www.gs4u.net/en/s/435059";

async function run() {

    const output = {
        online: false,
        name: "Community_Deadside",
        address: "144.126.153.170:35200",
        players: 0,
        maxPlayers: 20,
        version: null,
        updated: new Date().toISOString()
    };

    try {

        console.log("Fetching GS4U...");

        const response = await fetch(SERVER_URL, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();

        /*
            Convert the HTML into plain-ish text.

            This makes the parser much less sensitive
            to GS4U changing span/div tags.
        */

        const text = html
            .replace(/<script[\s\S]*?<\/script>/gi, " ")
            .replace(/<style[\s\S]*?<\/style>/gi, " ")
            .replace(/<[^>]+>/g, " ")
            .replace(/&nbsp;/gi, " ")
            .replace(/&#160;/gi, " ")
            .replace(/\u00a0/g, " ")
            .replace(/&amp;/gi, "&")
            .replace(/\s+/g, " ")
            .trim();

        console.log("========== PAGE TEXT ==========");
        console.log(text.substring(0, 2500));

        /*
            ONLINE STATUS
        */

        if (/Status:\s*Online/i.test(text)) {

            output.online = true;

        } else if (/Status:\s*Offline/i.test(text)) {

            output.online = false;

        }


        /*
            PLAYER COUNT
        */

        const playersMatch =
            text.match(/Players:\s*(\d+)\s*of\s*(\d+)/i);

        if (playersMatch) {

            output.players =
                parseInt(playersMatch[1], 10);

            output.maxPlayers =
                parseInt(playersMatch[2], 10);

        }


        /*
            VERSION
        */

        const versionMatch =
            text.match(/Version:\s*([0-9.]+)/i);

        if (versionMatch) {

            output.version =
                versionMatch[1];

        }


        /*
            SERVER NAME
        */

        if (text.includes("Community_Deadside")) {

            output.name =
                "Community_Deadside";

        }


        output.updated =
            new Date().toISOString();


        console.log(
            "========== PARSED STATUS =========="
        );

        console.log(output);

    }

    catch (error) {

        console.error(
            "GS4U fetch failed:",
            error
        );

        output.online = false;

        output.updated =
            new Date().toISOString();

    }


    fs.writeFileSync(
        "server-status.json",
        JSON.stringify(output, null, 4)
    );


    console.log(
        "========== FINAL JSON =========="
    );

    console.log(
        JSON.stringify(output, null, 4)
    );

}

run();