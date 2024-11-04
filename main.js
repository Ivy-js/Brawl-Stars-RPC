/* ******************************************************************************************************* */
/*                                                                                                         */
/*                                                              :::::::::::    :::     :::    :::   :::    */
/*   main.js                                                    :+:        :+:     :+:    :+:   :+:        */
/*                                                             +:+        +:+     +:+ +:+          */
/*   By: Ivy <contact@1sheol.xyz>                             +#+        +#+     +:+      +#++:            */
/*                                                           +#+         +#+   +#+        +#+              */
/*   Created: 2024/11/04 00:55:29 by Ivy                    #+#         #+#+#+#         #+#                */
/*   Updated: 2024/11/04 00:55:29 by Ivy              ###########        ###           ###                 */
/*                                                                                                         */
/* ******************************************************************************************************* */

const rpc = require("discord-rpc");
const axios = require("axios");
require("colors");
const client = new rpc.Client({ transport: "ipc" });
const startTimestamp = new Date();
const yaml = require("js-yaml");
const fs = require("fs");

try {
  const fileContents = fs.readFileSync("./config.yml", "utf8");
  const config = yaml.load(fileContents);

  const MAX_RETRIES = config.MAX_RETRIES || 5;
  let retryCount = 0;

  async function connectRpc() {
    try {
      await client.login({ clientId: config.discord.clientId });
      console.log(" DISCORD ".bgBlue.black + " Rich Presence activée !");
      console.log(
        " DISCORD ".bgBlue.black + ` Authed for user ${client.user.username}`
      );
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        console.log(`Retrying to connect... (${retryCount}/${MAX_RETRIES})`);
        setTimeout(connectRpc, 5000); // Retry after 5 seconds
      } else {
        console.error(
          "Failed to connect to Discord RPC after multiple attempts:",
          error
        );
      }
    }
  }
  client.on("ready", async () => {
    async function updatePresence() {
      try {
        const { data } = await axios.get(
          `https://api.brawlstars.com/v1/players/${config.brawlstars.tag}`,
          {
            headers: {
              Authorization: `Bearer ${config.brawlstars.api_key}`,
            },
          }
        );
        const currentTrophies = data.trophies;
        const iconUrl = config.img.avatar;


        client.setActivity({
          details: config.presence.details,
          state: config.presence.stateTemplate
            .replace("{trophies}", currentTrophies)
            .replace("{name}", data.name),
          startTimestamp,
          largeImageKey: `${iconUrl}`,
          largeImageText: config.presence.largeImageTextTemplate.replace(
            "{name}",
            data.name
          ),
          smallImageKey: config.presence.smallImageKey,
          smallImageText: config.presence.smallImageTextTemplate.replace(
            "{clubName}",
            data.club.name
          ),
          instance: false,
          buttons: config.discord.buttons,
        });
      } catch (e) {
        console.log(" ERROR ".bgRed.black + ` Une erreur est survenue : ${e}`);
      }
    }

    updatePresence();
    setInterval(updatePresence, config.presence.updateInterval * 1000);
  });

  connectRpc();
  console.log(config);
} catch (error) {
  console.error("Erreur lors de la lecture du fichier YAML :", error);
}
