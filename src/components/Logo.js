import Image from 'next/image';

const Logo = () => {
  return (
    <a href="/" className="block opacity-90 hover:opacity-100 transition-opacity">
      <Image
        src="/emelifts_logo.svg"
        alt="Emelifts"
        width={112}
        height={32}
        sizes="112px"
        className="h-7 w-auto object-contain brightness-0 md:h-8"
        priority
        fetchPriority="high"
      />
    </a>
  );
};

export default Logo;
