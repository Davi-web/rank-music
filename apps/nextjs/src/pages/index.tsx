import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@acme/api";
import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

const PostCard: React.FC<{
  post: inferProcedureOutput<AppRouter["post"]["all"]>[number];
}> = ({ post }) => {
  return (
    <div className="max-w-2xl rounded-lg border-2 border-gray-500 p-4 transition-all hover:scale-[101%]">
      <h2 className="text-2xl font-bold text-[hsl(280,100%,70%)]">
        {post.title}
      </h2>
      <p>{post.content}</p>
    </div>
  );
};

const Home: NextPage = () => {
  const {
    data: songPair,
    refetch,
    isLoading,
  } = trpc.song.getTwoSongs.useQuery();

  const castVote = trpc.song.voteForSong.useMutation();

  const voteForSong = async (votedFor: number) => {
    if (!votedFor) return;
    if (!songPair?.secondSong?.rank || !songPair?.firstSong?.rank) return;

    if (votedFor === songPair?.firstSong?.rank) {
      // If voted for 1st pokemon, fire voteFor with first ID
      castVote.mutate({
        votedFor: songPair?.firstSong?.rank,
        votedAgainst: songPair?.secondSong?.rank,
      });
    } else {
      // else fire voteFor with second ID
      castVote.mutate({
        votedFor: songPair?.secondSong?.rank,
        votedAgainst: songPair?.firstSong?.rank,
      });
    }

    setFirstVideo(false);
    setSecondVideo(false);
    refetch();
  };

  const [firstVideo, setFirstVideo] = useState(false);
  const [secondVideo, setSecondVideo] = useState(false);

  const showFirstVideo = () => {
    setFirstVideo(true);
    setSecondVideo(false);
  };

  const showSecondVideo = () => {
    setSecondVideo(true);
    setFirstVideo(false);
  };
  return (
    <>
      <Head>
        <title>Rank-Music</title>
        <meta
          name="description"
          content="Vote on the best song from the Billboards Top 100 songs"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className=" to-[[hsl(280,100%,70%)] flex h-screen w-screen flex-col items-center bg-gradient-to-b from-[#6615d7] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Billboard's{" "}
            <span className="text-[hsl(280,100%,70%)]">Top 100</span> Songs
          </h1>
          <AuthShowcase />
          {isLoading && (
            <Image
              src="/bars.svg"
              alt="Loading"
              height={200}
              width={200}
              className=" animate-fade-in animate-ping self-center"
            />
          )}
          {songPair && (
            <div className="animate-fade-in grid grid-cols-3 gap-24 ">
              <div className="flex h-full w-full flex-col justify-center">
                <div className="flex flex-col gap-4 text-center transition-opacity">
                  {firstVideo ? (
                    <iframe
                      width={400}
                      height={280}
                      src={`https://www.youtube.com/embed/${songPair.firstSong?.videoId}?autoplay=1`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="m-4 aspect-video  self-center p-4"
                    />
                  ) : (
                    <Image
                      onClick={showFirstVideo}
                      src={`${songPair.firstSong?.cover}`}
                      width={200}
                      height={200}
                      alt="Song Cover"
                      className={`${
                        firstVideo || secondVideo ? "" : "animate-bounce"
                      } self-center`}
                      loading="lazy"
                    />
                  )}
                  <p className="font-robotoMono text-sm italic sm:text-lg">
                    {songPair.firstSong?.title} by {songPair.firstSong?.artist}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (songPair.firstSong?.rank) {
                      voteForSong(songPair.firstSong?.rank);
                    }
                  }}
                  className="gr font-robotoMono my-4 w-full rounded-md bg-[hsl(280,100%,75%)] px-4 py-2 text-lg text-white"
                >
                  Vote Thumbs up
                </button>
              </div>
              <h3 className="flex justify-center text-lg">vs.</h3>

              <div className="flex w-full flex-col justify-center">
                <div className=" flex w-full flex-col justify-center gap-4 text-center align-middle">
                  {secondVideo ? (
                    <iframe
                      width={400}
                      height={280}
                      src={`https://www.youtube.com/embed/${songPair.secondSong?.videoId}?autoplay=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="m-4 aspect-video self-center p-4"
                    />
                  ) : (
                    <Image
                      onClick={showSecondVideo}
                      src={`${songPair.secondSong?.cover}`}
                      width={200}
                      height={200}
                      alt="Song Cover"
                      className={`${
                        firstVideo || secondVideo ? "" : "animate-bounce"
                      } self-center`}
                      loading="lazy"
                    />
                  )}
                  <p className=" font-robotoMono text-sm sm:text-lg">
                    {songPair.secondSong?.title} by{" "}
                    {songPair.secondSong?.artist}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (songPair.secondSong?.rank) {
                      voteForSong(songPair.secondSong?.rank);
                    }
                  }}
                  className="font-robotoMono my-4 w-full rounded-md bg-[hsl(280,100%,75%)] px-4 py-2 text-white"
                >
                  Vote Thumbs up
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { isSignedIn } = useAuth();
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined,
    { enabled: !!isSignedIn },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {isSignedIn && (
        <>
          <p className="font-robotoMono text-center text-2xl text-white">
            {secretMessage && (
              <span>
                {secretMessage}
                <br />
              </span>
            )}
          </p>
          <div className="flex items-center justify-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "3rem",
                    height: "3rem",
                  },
                },
              }}
            />
          </div>
        </>
      )}
      {!isSignedIn && (
        <p className="text-center text-2xl text-white">
          <Link href="/sign-in">Sign In</Link>
        </p>
      )}
    </div>
  );
};
