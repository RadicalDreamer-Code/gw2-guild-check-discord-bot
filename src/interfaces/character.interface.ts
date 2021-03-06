export class Character {
  name: string;
  race: string;
  gender: string;
  flags: unknown;
  profession: string;
  level: number;
  guild: string;
  age: number;
  created: string; //	"2021-11-22T16:24:00Z"
  deaths: number;
  crafting: Crafting[];
  backstory: unknown;
  ww_abilities: unknown;
  equipment: unknown;
  recipes: unknown;
  bags: unknown;
}

class Crafting {
  discipline: string;
  rating: number;
  active: true;
}
