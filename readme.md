<div align="center">
  <img src="header.gif" />
</div>

---
## 🚀 Fonctionnalités

- Affiche votre nombre de trophées actuels 🏆
- Montre votre avatar et nom de joueur 🎨
- Met à jour votre présence à intervalle régulier ⏱️
- Inclut des boutons personnalisés pour des actions rapides 🔘

## 🛠️ Installation

1. Clonez le dépôt:

    ```bash
    git clone https://github.com/Ivy-js/Brawl-Stars-RPC.git
    cd Brawl-Stars-RPC
    ```

2. Installez les dépendances:

    ```bash
    npm install
    ```

## ⚙️ Configuration

1. Renommez le fichier `config.example.yml` en `config.yml`:

    ```bash
    mv config.example.yml config.yml
    ```

2. Modifiez `config.yml` avec vos propres informations:

    ```yaml
    discord:
      clientId: "YOUR_DISCORD_CLIENT_ID" # Remplacez par votre ID client Discord
      buttons:
        - label: "Button 1"
          url: "https://example.com/button1"
        - label: "Button 2"
          url: "https://example.com/button2"

    api:
      playerUrl: "https://api.brawlstars.com/v1/players/PLAYER_ID" # Remplacez par votre PlayerID
      avatarUrl: "https://api.brawlify.com/v1/icons" # Remplacez par l'URL de votre API d'avatar

    presence:
      details: "Your Presence Details"
      stateTemplate: "{trophies}🏆 | {name}"
      largeImageTextTemplate: "{name}"
      smallImageKey: "https://example.com/path/to/small/image.png"
      smallImageTextTemplate: "Club : {clubName}"
      updateInterval: 60 # en secondes
    ```

## ▶️ Utilisation

1. Lancez le bot:

    ```bash
    npm run app
    ```

2. Le bot se connectera à votre compte Discord et commencera à mettre à jour votre Rich Presence.

## 📚 Exemples de Code

### main.js

```javascript
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

```

### config.yml

```yaml
# ********************************************************************************************************* #
#                                                                                                           #
#                                                               :::::::::::    :::     :::    :::   :::     #
#    config.yml                                                 :+:        :+:     :+:    :+:   :+:         #
#                                                              +:+        +:+     +:+     +:+ +:+           #
#    By: Ivy <contact@1sheol.xyz>                             +#+        +#+     +:+      +#++:             #
#                                                            +#+         +#+   +#+        +#+               #
#    Created: 2024/11/04 00:52:13 by Ivy                    #+#         #+#+#+#         #+#                 #
#    Updated: 2024/11/04 00:52:13 by Ivy              ###########        ###           ###                  #
#                                                                                                           #
# ********************************************************************************************************* #



# This is the configuration file for the Brawl Stars Discord Rich Presence bot.
discord:
  clientId: "" # Replace with your actual Discord client ID
  buttons: # The buttons that will be displayed on the presence.
    - label: "Button 1"
      url: "https://example.com/button1" 
    - label: "Button 2"
      url: "https://example.com/button2" 

img: 
  avatar: "" # The URL of the avatar image that will be displayed on the presence.

# The tag is the player tag of the account you want to track.
brawlstars:
  tag: "%23" # The player tag of the account you want to track. Write your tag without the # symbol.
  api_key: "" # Replace with your actual Brawl Stars API key Link https://developer.brawlstars.com/#/documentation

# The bot will automatically reconnect if the connection is lost.
MAX_RETRIES : 10

# The presence object is the configuration for the Discord Rich Presence.
presence:
  details: "Your Presence Details" # The details that will be displayed on the presence.
  stateTemplate: "{trophies}🏆 | {name}" # The State Template
  largeImageTextTemplate: "{name}" # The text that will be displayed when hovering over the large image.
  smallImageKey: "https://example.com/path/to/small/image.png" # The key of the small image that will be displayed on the presence.
  smallImageTextTemplate: "Club : {clubName}" # The text that will be displayed when hovering over the small image.
  updateInterval: 60 # in seconds




```

## 📝 License

Ce projet est sous licence ISC. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

```

N'hésitez pas à personnaliser ce README selon vos besoins !
