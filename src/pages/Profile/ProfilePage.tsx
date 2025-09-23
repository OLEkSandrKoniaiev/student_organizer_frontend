import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  deleteUserPhoto,
  type IUserProfile,
} from "../../services/api.service";
import noImage from "../../assets/no-image-icon.png";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err: unknown) {
        console.error("Failed to fetch user:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleDeletePhoto = async () => {
    if (!window.confirm("Are you sure you want to delete your photo?")) return;
    try {
      await deleteUserPhoto();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setUser((prev) => (prev ? { ...prev, photo: null } : prev));
    } catch (err: unknown) {
      console.error("Failed to delete photo:", err);
      alert("Failed to delete photo");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>No user data</p>;

  return (
    <div className="max-w-md mx-auto mt-10 flex flex-col items-center gap-4">
      <div className="relative w-32 h-32">
        <img
          src={user.photo || noImage}
          alt={user.username}
          className="w-32 h-32 rounded-full object-cover"
        />
        {user.photo && (
          <button
            onClick={handleDeletePhoto}
            className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 transition"
            title="Delete photo"
          >
            ×
          </button>
        )}
      </div>

      <h1 className="text-2xl font-bold">{user.username}</h1>
      <p className="text-gray-700">{user.email}</p>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate("/profile/edit")}
          className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
        >
          Edit Profile
        </button>

        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
