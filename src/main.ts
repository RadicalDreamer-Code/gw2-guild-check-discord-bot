import { Intents, Client, MessageEmbed, TextChannel } from 'discord.js';
import config from '../config.json';
import logger from './logger';
import axios from 'axios';
import { GuildInformation } from './interfaces/guild-information.interface';

// Discord Bot
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
let textChannel: TextChannel;

// TODO: this needs to be typed or changed overal, mainly used for caching data, this can be handlede in other ways
let guildInfoMessage;

client.once('ready', async () => {
  console.log('Ready');
  // Get right channel
  const channel = client.channels.cache.get(config.guildWarsChannel);
  textChannel = channel as TextChannel;

  // Start Information Interval
  const INTERVAL_TIME = 60000; // every hour
  const interval = setInterval(
    sendMessageIfInformationHasChanged,
    INTERVAL_TIME,
  );
});

// data: GuildInformation
function createEmbedMessage(data: GuildInformation) {
  return new MessageEmbed()
    .setTitle(`${data.name} [${data.tag}]`)
    .setColor('#DAF7A6')
    .addFields(
      { name: 'Message of the day', value: data.motd },
      { name: 'Level', value: data.level.toString() },
      { name: 'Members', value: data.member_count.toString() },
    );
}

client.login(config.token);

// Guild Wars 2 Part
const guildUrl = `https://api.guildwars2.com/v2/guild/${config.guildWarsGuildId}/`;
const gwAxios = axios.create({
  headers: {
    Authorization: `Bearer ${config.guildWarsToken}`,
  },
});

async function getGuildInformation() {
  try {
    const response = await gwAxios.get<GuildInformation>(guildUrl);
    return response.data;
  } catch (e) {
    logger.error({
      message: "Guild Wars API couldn't get called",
    });
    return;
  }
}

async function getGuildEmblem() {
  //TODO: Show Guild Emblem on Discord
}

// compare in an interval
let currentGuildInformation: GuildInformation;

async function sendMessageIfInformationHasChanged() {
  // Request
  const guildInfo = await getGuildInformation();
  // if undefined / nothing changed
  if (!guildInfo) return;

  // Compare
  // TODO: this should be handled inside the interface, maybe convert it to a normal class for these kinds of actions
  // meaning for handling formatting etc as well
  if (!guildInformationIsUnchanged(guildInfo)) {
    console.log('Info has changed');
    currentGuildInformation = guildInfo;

    const embedMessage = createEmbedMessage(guildInfo);
    if (!guildInfoMessage) {
      await textChannel.send({ embeds: [embedMessage] });
    } else {
      await guildInfoMessage.edit(embedMessage);
    }

    logger.info({
      message: 'Guild Information has been updated on Discord',
    });

    return;
  }
}

function guildInformationIsUnchanged(newInformation: GuildInformation) {
  return (
    JSON.stringify(newInformation) === JSON.stringify(currentGuildInformation)
  );
}
