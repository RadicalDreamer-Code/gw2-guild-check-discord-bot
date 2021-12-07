# Discord Bot
[![check workflow](https://github.com/RadicalDreamer-Code/gw2-guild-check-discord-bot/actions/workflows/check.yml/badge.svg)](https://github.com/RadicalDreamer-Code/gw2-guild-check-discord-bot/actions/workflows/check.yml)


## Installation

```sh
$ npm install
```


### Discord Credentials and Guild Wars 2 Information

A config.json needs to be created in src/ with following values:

```json
{
  "token": "",
  "discordGuild": "",
  "guildWarsChannel": "",
  "guildWarsToken": "",
  "guildWarsGuildId": "",
  "guildWarsAccounts": [
      {
        "token": "...",
        "activeCharacterName": "..."
      },
      { ... }
  ]
}
```


## Start / Develop
```sh
$ npm run start:prod
$ npm run start:dev

$ npm run lint
$ npm run format
```
