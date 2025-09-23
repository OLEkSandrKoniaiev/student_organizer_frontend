import React, { useEffect, useState } from "react";
import { getCurrentUser, type IUserProfile } from "../../services/api.service";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>No user data</p>;

  return (
    <div className="max-w-md mx-auto mt-10 flex flex-col items-center gap-4">
      <img
        src={user.photo}
        alt={user.username}
        className="w-32 h-32 rounded-full object-cover"
      />
      <h1 className="text-2xl font-bold">{user.username}</h1>
      <p className="text-gray-700">{user.email}</p>
    </div>
  );
};

export default ProfilePage;
