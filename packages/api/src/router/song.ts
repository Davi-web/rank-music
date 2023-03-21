import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { getChart, listCharts } from "billboard-top-100";
import { search, settings } from "youtube-video-search";
import * as yt from "youtube-search-without-api-key";
import axios from "axios";

interface Song {
  title: string;
  artist: string;
  rank: number;
  cover: string;
  position: {
    peakPosition: number;
    positionLastWeek: number;
    weeksOnChart: number;
  };
  videoId: string | undefined;
}

export const songRouter = router({
  all: protectedProcedure.query(async ({ ctx }) => {
    //get the current date formatted as YYYY-MM-DD
    return ctx.prisma.song.findMany();
  }),
  byId: protectedProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.song.findFirst({ where: { id: input } });
  }),
  voteForSong: protectedProcedure
    .input(
      z.object({
        votedFor: z.number(),
        votedAgainst: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.vote.create({
        data: {
          votedForId: input.votedFor,
          votedAgainstId: input.votedAgainst,
        },
      });
    }),
});
