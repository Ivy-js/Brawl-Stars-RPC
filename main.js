/* ******************************************************************************************************* */
/*                                                                                                         */
/*                                                              :::::::::::    :::     :::    :::   :::    */
/*   main.js                                                    :+:        :+:     :+:    :+:   :+:        */
/*                                                             +:+        +:+     +:+     +:+ +:+          */
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
  const fileContents = fs.readFileSync('./config.yml', 'utf8');
  const config = yaml.load(fileContents);

  console.log(config);
} catch (error) {
  console.error("Erreur lors de la lecture du fichier YAML :", error);
}

client.on("ready", async () => {
  console.log(" DISCORD ".bgBlue.black + " Rich Presence activée !");
  console.log(" DISCORD ".bgBlue.black + ` Authed for user ${client.user.username}`);

  async function updatePresence() {
    try {
      const { data } = await axios.get(config.api.playerUrl);
      const currentTrophies = data.trophies;
      const iconId = data.icon.id;
      const iconUrl = await axios.get(`${config.api.avatarUrl}/${iconId}`);

      console.log(" DATA ".bgWhite.black + `  ${data}`);
      console.log(" DATA ".bgWhite.black + `  ${JSON.stringify(iconUrl.data)}`);

      client.setActivity({
        details: config.presence.details,
        state: config.presence.stateTemplate.replace("{trophies}", currentTrophies).replace("{name}", data.name),
        startTimestamp,
        largeImageKey: `${iconUrl.data.imageUrl}`,
        largeImageText: config.presence.largeImageTextTemplate.replace("{name}", data.name),
        smallImageKey: config.presence.smallImageKey,
        smallImageText: config.presence.smallImageTextTemplate.replace("{clubName}", data.club.name),
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

client.login({ clientId: config.discord.clientId }).catch(console.error);
