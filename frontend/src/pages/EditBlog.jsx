import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "../api/axios";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState(""); // Quill HTML
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const quillRef = useRef();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/blogs/${id}`);
        setTitle(res.data.title);
        setDesc(res.data.body);
        setExcerpt(res.data.excerpt || "");
        setCategory(res.data.category);
        setTags(res.data.tags.join(", "));
        setFeaturedImage(res.data.featuredImage || "");
      } catch (error) {
        console.error("Error fetching blog:", error.message);
      }
    };

    fetchBlog();
  }, [id]);

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();

        const quill = quillRef.current?.getEditor?.();
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", data.secure_url);
        }
      } catch (err) {
        console.error("Image upload failed:", err);
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
    setIsSubmitting(true);
    
    try {
      await axios.put(`/blogs/edit/${id}`, {
        title,
        body: desc,
        excerpt,
        category,
        tags: tags.split(",").map((t) => t.trim()).filter(t => t),
        featuredImage,
      });
      navigate(`/blogs/${id}`);
    } catch (error) {
      console.error("Blog update error:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-blog max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">✏️ Edit Blog</h2>
      
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
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate(`/blogs/${id}`)}
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
                Updating...
              </>
            ) : (
              "Update Blog"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditBlog;
