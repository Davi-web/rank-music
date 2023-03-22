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
      <table className=" m-4 table-auto rounded-tl-full rounded-br-full  bg-gradient-to-b from-green-300 to-green-50 bg-fixed">
        <thead className="border-b-[1px] border-dashed border-rose-400 ">
          <tr className="font-robotoMono text-center font-bold text-rose-400 sm:text-2xl  ">
            <th className="border-r-[1px] border-dashed border-rose-400 px-8">
              Rankings
            </th>
            <th className="border-r-[1px] border-dashed border-rose-400 px-8 ">
              Billboards Rankings
            </th>
            <th className="border-r-[1px] border-dashed border-rose-400 px-8 ">
              Cover
            </th>
            <th className="border-r-[1px] border-dashed border-rose-400 px-8 ">
              Song
            </th>
            <th className="border-r-[1px] border-dashed border-rose-400 px-8 ">
              Artist
            </th>
            <th className="border-r-[1px] border-dashed border-rose-400 px-8 ">
              Total Votes
            </th>
            <th className=" px-8 ">Pick Rate</th>
          </tr>
        </thead>
        <tbody>
          {props.songs.map((song, index) => {
            return (
              <tr
                className="md:text-md font-robotoMono sm:text-md border-b-[1px] border-dashed border-rose-400 text-center text-xs font-semibold  text-rose-400 sm:text-lg"
                key={index}
              >
                <td className="border-r-[1px] border-dashed border-rose-400">
                  {index + 1}
                </td>
                <td className="border-r-[1px] border-dashed border-rose-400">
                  {song.rank}
                </td>
                <td className="flex justify-center border-r-[1px] border-dashed border-rose-400">
                  <Image
                    src={song.cover}
                    width={100}
                    height={100}
                    alt="hello"
                    loading="lazy"
                    className=" m-4 rounded-full shadow-md"
                  />
                </td>
                <td className="border-r-[1px] border-dashed border-rose-400">
                  {song.title}
                </td>
                <td className="border-r-[1px] border-dashed border-rose-400">
                  {song.artist}
                </td>
                <td className="border-r-[1px] border-dashed border-rose-400">
                  {song._count.voteFor}
                </td>
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
