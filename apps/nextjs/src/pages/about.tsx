import { NextPage } from "next";
import React from "react";
import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  textContainer,
  textVariant2,
  staggerContainer,
  fadeIn,
} from "../utils/motion";
export const TypingText = ({ title, textStyles }) => (
  <motion.p
    variants={textContainer}
    className={`text-secondary-white text-[14px] font-normal ${textStyles}`}
  >
    {Array.from(title).map((letter, index) => (
      <motion.span variants={textVariant2} key={index}>
        {letter === " " ? "\u00A0" : letter}
      </motion.span>
    ))}
  </motion.p>
);

const About: NextPage = () => {
  return (
    <div className=" to-[[hsl(280,100%,70%)] flex h-screen w-screen flex-col items-center bg-gradient-to-b from-[#6615d7] text-white">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Explore the best songs of all time
      </h1>

      <div className="min-w-96 min-h-96 m-8 flex h-full w-[80%] flex-col items-center justify-center gap-4 rounded-xl bg-[rgba(266,266,266,.2)]">
        <h1 className="p-0 text-3xl font-extrabold tracking-tight">
          What is <span className="text-blue-300">rank</span>-
          <span className="text-red-300">music</span>?
        </h1>

        <p className=" p-8 text-left text-sm sm:p-24 sm:text-lg">
          Billboard ranks the top 100 songs each week. We wanted to put these
          rankings to the test and see if others actually agrees with the
          rankings. We created a website where you can vote on the songs you
          like and dislike. The website currently keeps a total ranking of all
          the users' votes and the rankings will change over time as more people
          vote. We hope you enjoy the site and find some new songs to listen to.
        </p>
      </div>

      <div className="absolute bottom-4  flex items-center justify-center">
        <Link className="font-robotoMono  text-rose-400" href={"/"}>
          Home
        </Link>
        <div className="font-robotoMono text-rose-400">|</div>
        <Link href={"/results"} className="font-robotoMono text-rose-400">
          Leaderboard
        </Link>
        <div className="font-robotoMono text-rose-400">|</div>
        <Link href={"/about"} className="font-robotoMono text-rose-400">
          About
        </Link>
        <div className="font-robotoMono text-rose-400">|</div>
        <a
          className="font-robotoMono text-rose-400"
          target="_blank"
          href="https://github.com/Davi-web/rank-music"
          rel="noreferrer"
        >
          GitHub
        </a>
        <div className="font-robotoMono text-rose-400">|</div>
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: {
                width: "2rem",
                height: "2rem",
                borderRadius: "50%",
              },
              userButtonBox: {
                width: "2rem",
                height: "2rem",
                borderRadius: "50%",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default About;
