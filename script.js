document.addEventListener("DOMContentLoaded", function () {

    /* ========================= */
    /* ACTIVE NAVIGATION         */
    /* ========================= */

    let currentPage = window.location.pathname.split("/").pop();

    if (!currentPage) {
        currentPage = "index.html";
    }

    const navLinks = document.querySelectorAll(".sidebar nav a");

    navLinks.forEach(function (link) {

        link.classList.remove("active");

        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }

    });


    /* ========================= */
    /* MOBILE MENU               */
    /* ========================= */

    const menuButton = document.getElementById("mobileMenuButton");
    const sidebar = document.querySelector(".sidebar");

    if (menuButton && sidebar) {

        menuButton.addEventListener("click", function () {

            sidebar.classList.toggle("mobile-open");

        });


        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                sidebar.classList.remove("mobile-open");

            });

        });

    }

    /* ========================= */
/* DISCORD WIDGET            */
/* ========================= */

const DISCORD_SERVER_ID = "1542707972260757605";

const discordOnline = document.getElementById("discordOnline");
const discordName = document.getElementById("discordName");
const discordJoin = document.getElementById("discordJoin");
const discordVoiceList = document.getElementById("discordVoiceList");
const discordVoiceCount = document.getElementById("discordVoiceCount");
const voiceStatus = document.getElementById("voiceStatus");


async function loadDiscordWidget() {

    if (!discordOnline) {
        return;
    }

    try {

        const response = await fetch(
            `https://discord.com/api/guilds/${DISCORD_SERVER_ID}/widget.json`
        );

        if (!response.ok) {
            throw new Error("Discord widget unavailable");
        }

        const data = await response.json();


        /* SERVER NAME */

        if (data.name) {
            discordName.textContent = data.name;
        }


        /* ONLINE USERS */

        discordOnline.textContent =
            data.presence_count ?? 0;


        /* JOIN LINK */

        if (data.instant_invite) {

            discordJoin.href =
                data.instant_invite;

        } else {

            discordJoin.style.display =
                "none";

        }


        /* VOICE CHANNELS */

        const members =
            Array.isArray(data.members)
            ? data.members
            : [];

        const channels =
            Array.isArray(data.channels)
            ? data.channels
            : [];


        const voiceMembers =
            members.filter(member =>
                member.channel_id
            );


        discordVoiceCount.textContent =
            voiceMembers.length;


        const voiceChannels =
            channels.filter(channel =>
                channel.id
            );


        discordVoiceList.innerHTML = "";


        let activeVoiceChannels = 0;


        voiceChannels.forEach(channel => {

            const channelMembers =
                voiceMembers.filter(
                    member =>
                        member.channel_id === channel.id
                );


            if (channelMembers.length === 0) {
                return;
            }


            activeVoiceChannels++;


            const channelElement =
                document.createElement("div");

            channelElement.className =
                "voice-channel";


            const name =
                document.createElement("div");

            name.className =
                "voice-channel-name";

            name.textContent =
                channel.name;


            const users =
                document.createElement("div");

            users.className =
                "voice-users";


            users.textContent =
                channelMembers
                    .map(member =>
                        member.username
                    )
                    .join(", ");


            channelElement.appendChild(name);

            channelElement.appendChild(users);

            discordVoiceList.appendChild(
                channelElement
            );

        });


        if (activeVoiceChannels === 0) {

            discordVoiceList.innerHTML =
                `<div class="voice-empty">
                    Nobody is currently in a visible voice channel.
                 </div>`;

        }


        voiceStatus.textContent =
            `${activeVoiceChannels} Active`;

    }

    catch (error) {

        discordOnline.textContent = "--";

        discordVoiceCount.textContent = "--";

        voiceStatus.textContent =
            "Unavailable";

        discordVoiceList.innerHTML =
            `<div class="voice-empty">
                Discord activity could not be loaded.
                Make sure the Discord Server Widget is enabled.
             </div>`;

    }

}


loadDiscordWidget();


/* Refresh Discord every 60 seconds */

setInterval(
    loadDiscordWidget,
    60000
);

});