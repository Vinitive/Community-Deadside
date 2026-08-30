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
        console.log("Fetching GS4U server page...");

        const response = await fetch(SERVER_URL, {
            headers: {
                "User-Agent": "Mozilla/5.0 CommunityDeadsideStatusBot/1.0"
            }
        });

        if (!response.ok) {
            throw new Error(`GS4U returned HTTP ${response.status}`);
        }

        const html = await response.text();

        console.log("GS4U page downloaded successfully.");

        /* =========================
           SERVER NAME
        ========================= */

        const nameMatch = html.match(
            /<h1[^>]*>\s*Community_Deadside\s*<\/h1>/i
        );

        if (nameMatch) {
            output.name = "Community_Deadside";
        }

        /* =========================
           ONLINE STATUS
        ========================= */

        const statusMatch = html.match(
            /Status:\s*(?:<\/[^>]+>\s*)*Online/i
        );

        output.online = Boolean(statusMatch);

        /* =========================
           PLAYER COUNT
        ========================= */

        const playersMatch = html.match(
            /(\d+)\s*(?:&nbsp;|\s)*of(?:&nbsp;|\s)*(\d+)/i
        );

        if (playersMatch) {
            output.players = Number(playersMatch[1]);
            output.maxPlayers = Number(playersMatch[2]);
        }

        /* =========================
           VERSION
        ========================= */

        const versionMatch = html.match(
            /Version:\s*(?:<\/[^>]+>\s*)*([0-9.]+)/i
        );

        if (versionMatch) {
            output.version = versionMatch[1];
        }

        output.updated = new Date().toISOString();

        console.log("Parsed server data:");
        console.log(output);

    } catch (error) {
        console.error("GS4U status fetch failed:");
        console.error(error);

        output.online = false;
        output.updated = new Date().toISOString();
    }

    fs.writeFileSync(
        "server-status.json",
        JSON.stringify(output, null, 4)
    );

    console.log("========== SERVER STATUS ==========");
    console.log(
        fs.readFileSync("server-status.json", "utf8")
    );
}

run();