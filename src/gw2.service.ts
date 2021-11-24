import axios from 'axios';
import config from '../config.json';
import logger from './logger';
import { Character } from './interfaces/character.interface';
import { GuildInformation } from './interfaces/guild-information.interface';

const gwAxios = (token: string) =>
  axios.create({
    baseURL: 'https://api.guildwars2.com/v2/',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export async function getGuildInformation() {
  try {
    const response = await gwAxios(config.guildWarsToken).get<GuildInformation>(
      `guild/${config.guildWarsGuildId}/`,
    );
    return response.data;
  } catch (e) {
    logger.error({
      message: "Guild Wars API couldn't get called",
    });
    return;
  }
}

export async function getGuildEmblem() {
  //TODO: Show Guild Emblem on Discord
}

export async function getCharacterInfo(token: string): Promise<Character[]> {
  //TODO: Get Character Info
  try {
    const response = await gwAxios(token).get<Character[]>(
      'https://api.guildwars2.com/v2/characters?ids=all',
    );
    return response.data;
  } catch (e) {
    logger.error({
      message: "Guild Wars API couldn't get called",
    });
    return;
  }
}
