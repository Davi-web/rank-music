import dynamic from "next/dynamic";
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  {
    ssr: false,
  },
);
const MotionPage = () => {
  return (
    <div>
      <MotionDiv
        className="box"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
          ease: [0, 0.71, 0.2, 1.01],
          scale: {
            type: "spring",
            damping: 5,
            stiffness: 100,
            restDelta: 0.001,
          },
        }}
      >
        hello
      </MotionDiv>
      <MotionDiv
        className="h-[150px] w-[150px] rounded-full bg-[#cc66ff]"
        whileHover={{ scale: 1.2, rotate: 90 }}
        whileTap={{ scale: 0.8, rotate: -90, borderRadius: "100%" }}
      />
    </div>
  );
};

export default MotionPage;
