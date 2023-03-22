import type { GetServerSideProps, NextPage } from "next";
import { prisma } from "../../../../packages/db/index";
import React from "react";
import { inferAsyncReturnType } from "@trpc/server";
import Image from "next/image";
import { useTable } from "react-table";

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

const generateCountPercentage = (song: SongResultsQuery[number]) => {
  const { voteFor, voteAgainst } = song._count;
  const totalVotes = voteFor + voteAgainst;
  const voteForPercentage = (voteFor / totalVotes) * 100;
  if (voteFor + voteAgainst === 0) {
    return 0;
  }
  return voteForPercentage;
};

const ResultsPage: React.FC<{
  songs: inferAsyncReturnType<typeof GetSongsInOrder>;
}> = (props) => {
  return (
    <div className=" to-[[hsl(280,100%,70%)] flex flex-col  items-center bg-gradient-to-b from-[#6615d7] bg-fixed ">
      <table className=" m-4 table-auto rounded-tl-full rounded-br-full border-dotted  bg-gradient-to-b from-green-300 to-green-50 bg-fixed">
        <thead className=" ">
          <tr className="font-robotoMono text-center font-bold text-rose-400 sm:text-2xl ">
            <th className="px-8">Rankings</th>
            <th className="px-8">Billboards Rankings</th>
            <th className="px-8">Cover</th>
            <th className="px-8">Song</th>
            <th className="px-8">Artist</th>
            <th className="px-8">Total Votes</th>
            <th className="px-8">Chosen Percentage</th>
          </tr>
        </thead>
        <tbody>
          {props.songs.map((song, index) => {
            return (
              <tr
                className="md:text-md font-robotoMono sm:text-md text-center text-xs font-bold text-rose-400 sm:text-2xl"
                key={index}
              >
                <td className="">{index + 1}</td>
                <td className="">{song.rank}</td>
                <td className="self-center">
                  <Image
                    src={song.cover}
                    width={100}
                    height={100}
                    alt="hello"
                    loading="lazy"
                    className="flex self-center justify-self-center rounded-full"
                  />
                </td>
                <td className="p-4">{song.title}</td>
                <td className="">{song.artist}</td>
                <td className="">{song._count.voteFor}</td>
                <td className="">
                  {generateCountPercentage(song).toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

type SongResultsQuery = inferAsyncReturnType<typeof GetSongsInOrder>;

const SongListing: React.FC<{
  song: SongResultsQuery[number];
  rank: number;
}> = ({ song, rank }) => {
  const voteForPercentage = generateCountPercentage(song);
  return (
    <div className="flex w-full items-center justify-between gap-4 border-b p-2 text-xs">
      <Image src={song.cover} width={64} height={64} alt="hello" />
      <div className="flex justify-center text-left">#{rank + 1}</div>
      <div className="w-full capitalize">
        {song.title} by {song.artist}
      </div>
      <div>
        <div>Vote For: {voteForPercentage}%</div>
        <div>Vote Against:{song.rank}%</div>
      </div>
    </div>
  );
};

export default ResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
  const songsOrderedByVote = await GetSongsInOrder();
  const DAY_IN_SECONDS = 60 * 60 * 24;
  return {
    props: {
      songs: songsOrderedByVote,
    },
    revalidate: DAY_IN_SECONDS,
  };
};
