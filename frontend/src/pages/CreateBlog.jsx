import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "../api/axios";
import { useRef } from "react";
import { useAuth } from "../context/AuthContext";

function CreateBlog() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState(""); // Will hold Quill HTML content
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const quillRef = useRef();

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="alert alert-warning">
          <span>Please log in to create a blog post.</span>
        </div>
      </div>
    );
  }

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      
      // Check if Cloudinary credentials are available
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      
      if (!cloudName || !uploadPreset) {
        console.error("Cloudinary credentials not configured");
        alert("Image upload not configured. Please add Cloudinary credentials to your .env file.");
        return;
      }

      formData.append("upload_preset", uploadPreset);

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        
        if (!res.ok) {
          throw new Error(`Upload failed: ${res.status}`);
        }
        
        const data = await res.json();

        const quill = quillRef.current?.getEditor?.();
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", data.secure_url);
        }
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("Image upload failed. Please try again or use a different image.");
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: handleImageUpload,
        },
      },
      clipboard: {
        matchVisual: false,
      },
      history: {
        delay: 2000,
        maxStack: 500,
        userOnly: true,
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
    "image",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
      const response = await axios.post("/blogs", {
        title,
        body: desc, // Quill's HTML content
        excerpt,
        category,
        tags: tags.split(",").map((t) => t.trim()).filter(t => t),
        featuredImage,
      });
      
      console.log("Blog created successfully:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Blog creation error:", error);
      setError(error.response?.data?.message || "Failed to create blog. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-blog max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">✍️ Create New Blog</h2>
      
      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Blog Details</h3>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title *</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                placeholder="Enter your blog title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Excerpt</span>
                <span className="label-text-alt">Brief description (max 200 chars)</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Brief description of your blog..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                maxLength={200}
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Category *</span>
              </label>
              <select
                className="select select-bordered"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                disabled={isSubmitting}
              >
                <option value="">Select a category</option>
                <option value="Technology">Technology</option>
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Travel">Travel</option>
                <option value="Food">Food</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Tags</span>
                <span className="label-text-alt">Comma-separated</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                placeholder="e.g. react, javascript, webdev"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Featured Image URL</span>
              </label>
              <input
                type="url"
                className="input input-bordered"
                placeholder="https://example.com/image.jpg"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Content</h3>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Blog Content *</span>
              </label>
              <div className="border rounded-lg">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={desc}
                  onChange={setDesc}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your blog content here..."
                  style={{ minHeight: "300px" }}
                  readOnly={isSubmitting}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/")}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Publishing...
              </>
            ) : (
              "Publish Blog"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateBlog;
