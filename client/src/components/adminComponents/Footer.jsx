import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 px-6 py-4 text-center text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2 select-none">
      <p>&copy; {new Date().getFullYear()} Portfolio. All rights reserved.</p>
      <p>System Status: All systems operational</p>
    </footer>
  );
};

export default Footer;
