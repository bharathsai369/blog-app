import React from "react";

export default function RightSidebar() {
  const trending = [
    "10 Tips for React Beginners",
    "How to Secure Your Node.js App",
    "Understanding JWT Cookies",
  ];
  const categories = ["Tech", "Lifestyle", "Travel", "Coding", "News"];

  return (
    <div className="card border shadow p-4 top-20">
      <h2 className="text-lg font-semibold mb-3">Trending</h2>
      <ul className="space-y-2 list-disc list-inside">
        {trending.map((post, index) => (
          <li key={index} className="text-sm hover:text-primary cursor-pointer">
            {post}
          </li>
        ))}
      </ul>

      <h2 className="text-lg font-semibold mb-3">Categories</h2>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat}>
            <a className="link link-hover text-base-content hover:text-primary">
              {cat}
            </a>
          </li>
        ))}
      </ul>
      <div className="join">
        <div>
          <div>
            <input className="input join-item" placeholder="Search" />
          </div>
        </div>
        <select className="select join-item">
          <option disabled selected>
            Filter
          </option>
          <option>Sci-fi</option>
          <option>Drama</option>
          <option>Action</option>
        </select>
        <button className="btn join-item">Search</button>
      </div>
    </div>
  );
}
