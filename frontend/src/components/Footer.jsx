import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📚</span>
          <span className="text-xl font-bold">BlogApp</span>
        </div>
        <p className="text-base-content/70">
          Share your thoughts with the world. Create, connect, and inspire.
        </p>
        <p className="text-sm text-base-content/60 mt-2">
          Built with ❤️ using React, Node.js, and MongoDB
        </p>
      </div>
      
      <div>
        <div className="grid grid-flow-col gap-4">
          <Link to="/" className="link link-hover">Home</Link>
          <Link to="/create" className="link link-hover">Create</Link>
          <a href="#about" className="link link-hover">About</a>
          <a href="#contact" className="link link-hover">Contact</a>
        </div>
      </div>
      
      <div>
        <div className="grid grid-flow-col gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-ghost">
            📦
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-ghost">
            🐦
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-ghost">
            💼
          </a>
          <a href="mailto:contact@blogapp.com" className="btn btn-circle btn-ghost">
            📧
          </a>
        </div>
      </div>
      
      <div>
        <p className="text-sm text-base-content/60">
          © {currentYear} BlogApp. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
