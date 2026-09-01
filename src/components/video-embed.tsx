import { Play } from "lucide-react";

export function VideoEmbed({
  youtubeVideoId,
  title,
}: {
  youtubeVideoId?: string;
  title: string;
}) {
  if (!youtubeVideoId) {
    return (
      <div className="flex aspect-video items-center justify-center bg-[#1b1a18] p-6 text-center text-white">
        <div>
          <Play className="mx-auto mb-3" />
          <p className="font-semibold">Video placeholder</p>
          <p className="mt-2 text-sm text-white/70">
            Add a YouTube video ID to the weekly content record.
          </p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      className="aspect-video w-full"
      src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}`}
      title={title}
      loading="lazy"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );
}
