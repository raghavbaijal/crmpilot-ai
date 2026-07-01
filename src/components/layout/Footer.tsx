import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-100 bg-white py-8 px-6 text-center">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
        <p>&copy; {new Date().getFullYear()} AI Real Estate CRM. All rights reserved.</p>
        <div className="flex gap-6 font-medium text-slate-500">
          <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Enterprise support</a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
