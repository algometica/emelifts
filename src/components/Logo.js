import Image from 'next/image';

const Logo = () => {
  return (
    <a href="/">
      <Image
        src="/emelifts_logo.svg" // Replace with the actual path to your logo
        alt="Emelifts Logo"
        width={150} // Adjust as needed
        height={45} // Adjust as needed
      />
    </a>
  );
};

export default Logo;