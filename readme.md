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
```

### config.yml

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

## 📝 License

Ce projet est sous licence ISC. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

```

N'hésitez pas à personnaliser ce README selon vos besoins !
