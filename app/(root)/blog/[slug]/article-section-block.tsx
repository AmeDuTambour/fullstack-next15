"use client";

import { formatText } from "@/lib/utils";
import { ArticleSection } from "@/types";
import Image from "next/image";
import YouTube from "react-youtube";

const ArticleSectionBlock = ({ section }: { section: ArticleSection }) => {
  const hasImage = section.image !== undefined && section.image !== null;
  const hasYouTube =
    section.youTubeUrl !== undefined && section.youTubeUrl !== null;

  const options = {
    playerVars: {
      autoplay: 0,
      controls: 1,
    },
  };

  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = hasYouTube
    ? getYouTubeVideoId(section.youTubeUrl ?? "")
    : null;

  return (
    <div className="col-span-2 space-y-10">
      <h3 className="h3-bold text-2xl">{section.title}</h3>{" "}
      <div className="flex flex-col md:flex-row gap-4 items-start ">
        {hasImage && (
          <div className="w-full md:w-1/3">
            <Image
              src={section.image ?? ""}
              height={200}
              width={200}
              alt="section image"
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <div
          className="flex-1 italic text-xl text-justify"
          dangerouslySetInnerHTML={{ __html: formatText(section.body ?? "") }}
        />
      </div>
      {hasYouTube && videoId && (
        <div className="flex justify-center w-full">
          <div className="w-full md:w-4/5 lg:w-3/4 aspect-video">
            {" "}
            <YouTube
              videoId={videoId}
              opts={options}
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleSectionBlock;
