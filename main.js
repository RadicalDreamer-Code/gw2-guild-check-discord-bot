import Discord, { Intents } from 'discord.js';
import config from './config.json';
import logger from './logger.js';
import axios from 'axios';

// Discord Bot
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS] });
let channel;
let guildInfoMessage;

client.once('ready', async () => {
  console.log('Ready');
  // Get right channel
  channel = client.channels.cache.get(config.guildWarsChannel);

  // Start Information Interval
  const INTERVAL_TIME = 60000; // every hour
  let interval = setInterval(sendMessageIfInformationHasChanged, INTERVAL_TIME);
});

// data: GuildInformation
function createEmbedMessage(data) {
  return new Discord.MessageEmbed()
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
    const response = await gwAxios.get(guildUrl);
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
let currentGuildInformation = {};

async function sendMessageIfInformationHasChanged() {
  // Request
  const guildInfo = await getGuildInformation();
  // if undefined / nothing changed
  if (!guildInfo) return;

  // Compare
  if (!guildInformationIsUnchanged(guildInfo)) {
    console.log('Info has changed');
    currentGuildInformation = guildInfo;

    if (!guildInfoMessage)
      await channel.send({ embeds: [createEmbedMessage(guildInfo)] });
    else await guildInfoMessage.edit(createEmbedMessage(guildInfo));

    logger.info({
      message: 'Guild Information has been updated on Discord',
    });

    return;
  }
}

function guildInformationIsUnchanged(newInformation) {
  return (
    JSON.stringify(newInformation) === JSON.stringify(currentGuildInformation)
  );
}
