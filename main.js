import Discord, {Intents} from "discord.js"
import config from "./config.json"
import axios from "axios";

// Discord Bot
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", async () => {
    console.log("Ready")
    // Get right channel
    const channel = client.channels.cache.get(config.guildWarsChannel);
    await getGuildInformation(channel);
});

client.login(config.token);

// Guild Wars 2 Part
const guildUrl = `https://api.guildwars2.com/v2/guild/${config.guildWarsGuildId}/`;
const gwAxios = axios.create({
    headers: {
        "Authorization": `Bearer ${config.guildWarsToken}`
    }
})

async function getGuildInformation(channel) {
    const response = await gwAxios.get(guildUrl)
    const data = response.data

    const embed = new Discord.MessageEmbed()
    .setTitle(`${data.name} [${data.tag}]`)
    .setColor('#DAF7A6')
    .addFields(
        {name: 'Message of the day', value: data.motd},
        {name: 'Level', value: data.level.toString()},
        {name: 'Members', value: data.member_count.toString()}
    )

    channel.send({embeds: [embed]})
}

async function getGuildEmblem() {

}