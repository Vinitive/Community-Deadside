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

    const menuButton =
        document.getElementById("mobileMenuButton");

    const sidebar =
        document.querySelector(".sidebar");


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

    const DISCORD_SERVER_ID =
        "1542707972260757605";


    const discordOnline =
        document.getElementById("discordOnline");

    const discordName =
        document.getElementById("discordName");

    const discordJoin =
        document.getElementById("discordJoin");

    const discordVoiceList =
        document.getElementById("discordVoiceList");

    const discordVoiceCount =
        document.getElementById("discordVoiceCount");

    const voiceStatus =
        document.getElementById("voiceStatus");


    async function loadDiscordWidget() {

        if (!discordOnline) {
            return;
        }


        try {

            console.log("Loading Discord widget...");


            const response = await fetch(
                `https://discord.com/api/guilds/${DISCORD_SERVER_ID}/widget.json`
            );


            console.log(
                "Discord response status:",
                response.status
            );


            if (!response.ok) {

                throw new Error(
                    `Discord returned ${response.status}`
                );

            }


            const data =
                await response.json();


            console.log(
                "Discord widget data:",
                data
            );


            /* SERVER NAME */

            if (data.name && discordName) {

                discordName.textContent =
                    data.name;

            }


            /* ONLINE COUNT */

            if (discordOnline) {

                discordOnline.textContent =
                    data.presence_count ?? 0;

            }


            /* INVITE */

            if (discordJoin) {

                if (data.instant_invite) {

                    discordJoin.href =
                        data.instant_invite;

                    discordJoin.style.display =
                        "inline-flex";

                } else {

                    discordJoin.style.display =
                        "none";

                }

            }


            /* MEMBERS / VOICE */

            const members =
                Array.isArray(data.members)
                    ? data.members
                    : [];


            const channels =
                Array.isArray(data.channels)
                    ? data.channels
                    : [];


            const voiceMembers =
                members.filter(function (member) {

                    return member.channel_id;

                });


            if (discordVoiceCount) {

                discordVoiceCount.textContent =
                    voiceMembers.length;

            }


            if (discordVoiceList) {

                discordVoiceList.innerHTML = "";

            }


            let activeVoiceChannels = 0;


            channels.forEach(function (channel) {

                const channelMembers =
                    voiceMembers.filter(
                        function (member) {

                            return (
                                member.channel_id ===
                                channel.id
                            );

                        }
                    );


                if (channelMembers.length === 0) {
                    return;
                }


                activeVoiceChannels++;


                const channelElement =
                    document.createElement("div");

                channelElement.className =
                    "voice-channel";


                const channelName =
                    document.createElement("div");

                channelName.className =
                    "voice-channel-name";

                channelName.textContent =
                    channel.name;


                const users =
                    document.createElement("div");

                users.className =
                    "voice-users";


                users.textContent =
                    channelMembers
                        .map(function (member) {

                            return member.username;

                        })
                        .join(", ");


                channelElement.appendChild(
                    channelName
                );

                channelElement.appendChild(
                    users
                );


                if (discordVoiceList) {

                    discordVoiceList.appendChild(
                        channelElement
                    );

                }

            });


            if (
                activeVoiceChannels === 0 &&
                discordVoiceList
            ) {

                discordVoiceList.innerHTML =
                    `<div class="voice-empty">
                        Nobody is currently in a visible voice channel.
                    </div>`;

            }


            if (voiceStatus) {

                voiceStatus.textContent =
                    `${activeVoiceChannels} Active`;

            }

        }

        catch (error) {

            console.error(
                "Discord widget error:",
                error
            );


            if (discordOnline) {
                discordOnline.textContent = "--";
            }


            if (discordVoiceCount) {
                discordVoiceCount.textContent = "--";
            }


            if (voiceStatus) {
                voiceStatus.textContent = "Unavailable";
            }


            if (discordVoiceList) {

                discordVoiceList.innerHTML =
                    `<div class="voice-empty">
                        Discord widget could not be loaded.
                    </div>`;

            }

        }

    }


    loadDiscordWidget();


    setInterval(
        loadDiscordWidget,
        60000
    );

});