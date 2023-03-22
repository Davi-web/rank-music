import { Song, prisma } from "../db/index";
const { getChart } = require("billboard-top-100");

import axios from "axios";

const doBackFill = async () => {
  const chart: Array<Song> = await new Promise((resolve, reject) => {
    getChart(
      "hot-100",
      "",
      (err: any, chart: { songs: Song[] | PromiseLike<Song[]> }) => {
        if (err) reject(err);
        resolve(chart.songs);
      },
    );
  });
  // get youtuve video ids
  const finalChart = await Promise.all(
    chart.map(async (song, index) => {
      const { data } = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${song.title} ${song.artist}&key=AIzaSyA3SpUmF2JcQ04R3RQSRNJInM6-rkFRbYA`,
      );
      return {
        title: song.title,
        artist: song.artist,
        cover: song.cover,
        rank: index + 1,
        id: index + 1,
        videoId: data.items[0].id.videoId,
      };
    }),
  );
  const results = await prisma.$transaction(
    finalChart.map((song) =>
      prisma.song.update({
        where: {
          id: song.id,
        },
        data: {
          title: song.title,
          artist: song.artist,
          cover: song.cover,
          rank: song.rank,
          videoId: song.videoId,
        },
      }),
    ), // returns an array of Promises
  );
  console.log(results);
};

doBackFill();
