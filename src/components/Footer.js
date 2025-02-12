// const Footer = () => {
//   return (
//     <footer className="text-center py-4 dark-footer">
//       <p>© {new Date().getFullYear()} emelifts. All rights reserved.</p>
//     </footer>
//   );
// };

// export default Footer;

// src/components/Footer.jsx (or .tsx)
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const instagramLink = 'https://www.instagram.com/emelifts/'; // Replace with your actual Instagram link

  return (
    <footer className="dark-footer text-gray-400 py-4 mb-4"> {/* Darker background, lighter text */}
      <div className="container mx-auto text-center">
        <p>© {new Date().getFullYear()} Emelifts. All rights reserved.</p>
        <div className="mt-2">
          {/* Instagram Icon */}
          <Link href={instagramLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300"> {/* Light gray, hover effect */}
            <svg
              className="w-6 h-6 inline-block"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12 2.163c3.204 0 3.584.012 4.85.07 1.327.058 2.278.16 2.874.354.596.194 1.042.413 1.43.791.388.378.608.824.791 1.42.194.596.296 1.547.354 2.874.059 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.058 1.327-.16 2.278-.354 2.874-.194.596-.413 1.042-.791 1.43-.378.388-.824.608-1.42.791-.596.194-1.547.296-2.874.354-1.266.059-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.327-.058-2.278-.16-2.874-.354-.596-.194-1.042-.413-1.43-.791-.378-.388-.824-.608-1.42.791-.596.194-1.547.296-2.874.354-1.266.059-1.646.07-4.85.07S2.163 20.163 2.163 16.959c0-3.204.012-3.584.07-4.85.058-1.327.16-2.278.354-2.874.194-.596.413-1.042.791-1.43.388-.378.608-.824.791-1.42.194-.596.296-1.547.354-2.874.059-1.266.07-1.646.07-4.85s-.012-3.584-.07-4.85c-.058-1.327-.16-2.278-.354-2.874-.194-.596-.413-1.042-.791-1.43-.378-.388-.824-.608-1.42.791-.596.194-1.547.296-2.874.354-1.266.059-1.646.07-4.85-.07S2.163 3.837 2.163 7.041c0 3.204-.012 3.584-.07 4.85-.058 1.327-.16 2.278-.354 2.874-.194.596-.413 1.042.791 1.43-.378.388-.824.608-1.42.791-.596.194-1.547.296-2.874.354-1.266.059-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.327-.058-2.278-.16-2.874-.354-.596-.194-1.042-.413-1.43-.791-.378-.388-.824-.608-1.42.791-.596.194-1.547.296-2.874.354-1.266.059-1.646-.07-4.85-.07S3.837 2.163 7.041 2.163c3.204 0 3.584.012 4.85.07 1.327.058 2.278.16 2.874.354.596.194 1.042.413 1.43.791.388.378.608.824.791 1.42.194.596.296 1.547.354 2.874.059 1.266.07 1.646.07 4.85zM12 6.157a5.843 5.843 0 1 0 0 11.686 5.843 5.843 0 0 0 0-11.686zM12 16a3.943 3.943 0 1 1 0-7.886 3.943 3.943 0 0 1 0 7.886zm6.405-11.184a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"
                clipRule="evenodd"
                fill="orange"
              />
            </svg>
          </Link>
          {/* Add other social media icons here */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;