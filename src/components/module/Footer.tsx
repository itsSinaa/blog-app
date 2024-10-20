import React from "react";
const Footer = () => {
  const date = new Date();
  const currentYear = date.getFullYear().toString()

  return (
    <footer className="mt-5 bg-gray-100 text-center py-4">
      <p className="text-sm text-gray-600">
        &copy; {currentYear} Tech Blog. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
