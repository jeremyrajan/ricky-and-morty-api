const { getEpisode } = require("rickmortyapi");

const getEpisodes = (episodesNumbers: number[]) => {
  if (!episodesNumbers.length) {
    return [];
  }

  return getEpisode(episodesNumbers);
};

module.exports = getEpisodes;