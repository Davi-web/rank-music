import type { GetServerSideProps, NextPage } from "next";
import { prisma } from "../../../../packages/db/index";
import React from "react";
import { inferAsyncReturnType } from "@trpc/server";
import Image from "next/image";
const ResultsPage: React.FC<{
  songs: inferAsyncReturnType<typeof GetSongsInOrder>;
}> = (props) => {
  return (
    <div className="flex flex-col">
      <h2>Results</h2>
      {props.songs.map((song) => {
        return <SongListing song={song} />;
      })}
    </div>
  );
};
const GetSongsInOrder = async () => {
  return await prisma.song.findMany({
    orderBy: {
      voteFor: {
        _count: "desc",
      },
    },
    select: {
      id: true,
      rank: true,
      cover: true,
      artist: true,
      title: true,
      _count: {
        select: {
          voteFor: true,
          voteAgainst: true,
        },
      },
    },
  });
};

const generateCountPercenrage = (song: SongResultsQuery[number]) => {
  const { voteFor, voteAgainst } = song._count;
  const totalVotes = voteFor + voteAgainst;
  const voteForPercentage = (voteFor / totalVotes) * 100;
  const voteAgainstPercentage = (voteAgainst / totalVotes) * 100;
  return {
    voteForPercentage,
    voteAgainstPercentage,
  };
};

type SongResultsQuery = inferAsyncReturnType<typeof GetSongsInOrder>;
const SongListing: React.FC<{ song: SongResultsQuery }> = (props) => {
  const { voteForPercentage, voteAgainstPercentage } = generateCountPercenrage(
    props.song,
  );
  return (
    <div className="flex items-center justify-between gap-4 border-b p-2">
      <Image src={props.song.cover} width={200} height={200} alt="Song Cover" />
      <div className="capitalize">
        {props.song.title} by {props.song.artist}
      </div>
      <div>
        <div>Vote For: {voteForPercentage}%</div>
        <div>Vote Against: {voteAgainstPercentage}%</div>
      </div>
    </div>
  );
};

export default ResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
  const songsOrderedByVote = await GetSongsInOrder();
  console.log("songs", songsOrderedByVote);

  return {
    props: {
      songs: songsOrderedByVote,
    },
    revalidate: 60,
  };
};
