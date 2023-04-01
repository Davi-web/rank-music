import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { getOptionsForVote } from "../../../../apps/nextjs/src/utils/getRandomSongs";

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
  getTwoSongs: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    const [first, second] = getOptionsForVote();
    if (first !== undefined && second !== undefined) {
      const bothSongs = await ctx.prisma.song.findMany({
        where: { id: { in: [first, second] } },
      });
      if (bothSongs.length !== 2) throw new Error("Failed to find two songs");
      return {
        firstSong: bothSongs[0],
        secondSong: bothSongs[1],
      };
    } else {
      throw new Error("Failed to find two Songs");
    }
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
