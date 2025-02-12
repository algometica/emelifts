// src/components/ContactMe.jsx (or .tsx)
import React from 'react';

const ContactMe = () => {
  const googleFormLink = 'https://forms.gle/SFtKRzZcq1wu7v8K8'; // Replace with your actual Google Form link

  return (
    <section className="dark-card py-12 mb-12"> {/* Dark background, margin-bottom */}
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-200 mb-6">Contact Me</h2> {/* White text */}
        <p className="text-gray-400 mb-8 dark-card-text"> {/* Light gray text */}
          Have questions or want to discuss your fitness needs?  Reach out!
        </p>
        <a
          href={googleFormLink}
          target="_blank"
          rel="noopener noreferrer"
          className="dark-card-link bg-transparent hover:bg-gray-700 text-white font-bold py-2 px-4 rounded border border-gray-500 hover:border-transparent transition duration-200 focus:outline-none focus:shadow-outline" // Tailwind styling - dark theme button
        >
          Get in Touch
        </a>
      </div>
    </section>
  );
};

export default ContactMe;