import { youtubeEmbedUrl, youtubeThumb } from '@/lib/youtube';

export default function MovementDemo({ youtubeUrl, name, compact = false }) {
  const embed = youtubeEmbedUrl(youtubeUrl);
  const thumb = youtubeThumb(youtubeUrl);

  if (!embed) {
    return null;
  }

  if (compact) {
    return (
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex items-center gap-2 text-[13px] text-[#0066cc]"
      >
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="h-9 w-14 rounded object-cover" />
        ) : null}
        Watch demo
      </a>
    );
  }

  return (
    <div className="mt-3 overflow-hidden rounded-xl bg-black">
      <iframe
        src={embed}
        title={`${name} demo`}
        className="aspect-video w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
