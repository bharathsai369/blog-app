import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "../api/axios";
import { useRef } from "react";

function CreateBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState(""); // Will hold Quill HTML content
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const quillRef = useRef();

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
        import.meta.process.env.CLOUDINARY_UPLOAD_PRESET
      );

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.process.env.CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();

        // const quill = quillRef.getEditor();
        // const range = quill.getSelection();
        // quill.insertEmbed(range.index, "image", data.secure_url);
        // quillRef.current.getEditor().insertEmbed(index, "image", imageUrl);

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

  // const [quillRef, setQuillRef] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/blogs", {
        title,
        body: desc, // Quill's HTML content
        category,
        tags: tags.split(",").map((t) => t.trim()),
      });
      navigate("/");
    } catch (error) {
      console.error("Blog creation error:", error.message);
    }
  };

  return (
    <div className="create-blog">
      <h2>Create Blog</h2>
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">Blog Details</legend>

          <label className="label">Title</label>
          <input
            type="text"
            className="input"
            placeholder="Blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label className="label">Description</label>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={desc}
            onChange={setDesc}
            modules={modules}
            formats={formats}
            placeholder="Write your blog..."
          />

          <label className="label">Category</label>
          <input
            type="text"
            className="input"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <label className="label">Tags (comma-separated)</label>
          <input
            type="text"
            className="input"
            placeholder="e.g. react,javascript,webdev"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <button className="btn" type="submit">
            Publish
          </button>
        </fieldset>
      </form>
    </div>
  );
}

export default CreateBlog;
