import {
  Intents,
  Client,
  MessageEmbed,
  TextChannel,
  Message,
} from 'discord.js';
import config from '../config.json';
import logger from './logger';
import { GuildInformation } from './interfaces/guild-information.interface';
import { Character } from './interfaces/character.interface';
import { getCharacterInfo, getGuildInformation } from './gw2.service';

// Discord Bot
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
let textChannel: TextChannel;
let guildInfoMessage: Message;

logger.info('Discord-Bot Service started');
client.once('ready', async () => {
  logger.info('Discord-Bot is ready');
  const channel = client.channels.cache.get(config.guildWarsChannel);
  textChannel = channel as TextChannel;

  if (process.env.NODE_ENV === 'production') {
    const INTERVAL_TIME_ONE_HOUR = 3600000;
    setInterval(update, INTERVAL_TIME_ONE_HOUR);
  } else {
    logger.info('Dev-Mode activated!');
    await update();
  }
});

function createEmbedMessage(data: Information): MessageEmbed {
  const activePlayers = data.characters
    .map((character) => {
      return `${character.name} (${character.profession}) \n Level: ${character.level} Deaths: ${character.deaths} \n\n`;
    })
    .join('');

  // TODO: incrementally build addFields dependend on given data (character > 0 etc.)
  return new MessageEmbed()
    .setTitle(`${data.guild.name} [${data.guild.tag}]`)
    .setColor('#DAF7A6')
    .addFields(
      { name: 'Message of the day', value: data.guild.motd },
      { name: 'Level', value: data.guild.level.toString() },
      { name: 'Members', value: data.guild.member_count.toString() },
      { name: 'Active Players', value: activePlayers || 'no data' },
    );
}

client.login(config.token);

// Guild Wars 2 Part
interface Information {
  guild?: GuildInformation;
  characters: Character[];
}

let currentInformation: Information = {
  guild: undefined,
  characters: [],
};

// compare in an interval
async function update(): Promise<void> {
  const newInformation: Information = {
    guild: undefined,
    characters: [],
  };

  // All calls are made here
  newInformation.guild = await getGuildInformation();
  if (!newInformation.guild) return;

  for (const account of config.guildWarsAccounts) {
    const characters = await getCharacterInfo(account.token as string);
    if (!characters) continue;

    for (const character of characters) {
      if (character.name === account.activeCharacterName) {
        newInformation.characters.push(character);
      }
    }
  }

  // Compare all response -> update if changed
  if (informationHasChanged(newInformation)) {
    currentInformation = newInformation;
    const embedMessage = createEmbedMessage(newInformation);

    // TODO: this should be handled inside the interface, maybe convert it to a normal class for these kinds of actions
    // meaning for handling formatting etc as well
    if (!guildInfoMessage) {
      await textChannel.send({ embeds: [embedMessage] });
    } else {
      await guildInfoMessage.edit({ embeds: [embedMessage] });
    }

    logger.info({
      message: 'Guild Information has been updated on Discord',
    });
  }
}

function informationHasChanged(newInformation: Information) {
  return JSON.stringify(newInformation) !== JSON.stringify(currentInformation);
}
