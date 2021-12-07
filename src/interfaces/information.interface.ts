import { Character } from './character.interface';
import { GuildInformation } from './guild-information.interface';

export interface Information {
  guild?: GuildInformation;
  characters: Character[];
}
