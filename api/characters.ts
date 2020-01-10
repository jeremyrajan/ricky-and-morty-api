import { NowRequest, NowResponse } from "@now/node";
const { getCharacter } = require("rickmortyapi");
const getEpisodeInfo = require("./_utils/getEpisodeInfo");

interface IEpisode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[]
}

export default async (request: NowRequest, response: NowResponse) => {
  try {
    const { page } = request.query;
    const { results: characters, info } = await getCharacter({
      page: page || 1
    });
    const promises: Promise<IEpisode>[] = [];
    characters.forEach((character: { episodes: number[]; episode: string[]; }) => {
      character.episodes = character.episode.map(epUrl =>
        Number(epUrl.split("/").pop())
      );
      promises.push(getEpisodeInfo(character.episodes));
      delete character.episode;
    });

    const episodePromiseResults = await Promise.all(promises);
    const episodes = episodePromiseResults.flat().reduce(
      (accumulator, episode: IEpisode) => ({ ...accumulator, [episode.id]: episode }),
      {}
    );

    response.status(200).send(
      JSON.stringify({
        characters,
        episodes,
        info
      })
    );
  } catch (error) {
    console.error(error);
    response.status(400).send(JSON.stringify({ status: "error" }));
  }
};
