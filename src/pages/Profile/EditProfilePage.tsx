import React, { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, type IUserProfile } from "../../services/api.service";
import api from "../../services/api.service";
import noImage from "../../assets/no-image-icon.png";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

const EditProfilePage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(noImage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data: IUserProfile = await getCurrentUser();
        setUsername(data.username);
        setPreview(data.photo || noImage);
      } catch (err: unknown) {
        console.error("Failed to fetch user:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Invalid file type. Allowed: JPG, JPEG, PNG, GIF, WebP");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert("File is too large. Maximum size is 10MB");
      return;
    }

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const file = e.dataTransfer.files[0];
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Invalid file type. Allowed: JPG, JPEG, PNG, GIF, WebP");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert("File is too large. Maximum size is 10MB");
      return;
    }

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const handleSubmit = async () => {
    if (!username.trim()) {
      alert("Username cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    if (photo) formData.append("photo", photo);

    try {
      await api.put("/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err: unknown) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-md mx-auto mt-10 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="border p-2 rounded w-full"
      />

      <div
        className="border-dashed border-2 border-gray-400 w-48 h-48 flex items-center justify-center cursor-pointer rounded relative overflow-hidden"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById("photoInput")?.click()}
      >
        <img
          src={preview}
          alt="Preview"
          className="w-full h-full object-cover"
        />
        <input
          type="file"
          id="photoInput"
          className="hidden"
          accept={ALLOWED_TYPES.join(",")}
          onChange={handleFileChange}
        />
        <span className="absolute bottom-2 text-gray-700 text-sm">
          Click or drop image here
        </span>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate("/profile")}
          className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 transition"
        >
          Back
        </button>

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default EditProfilePage;
