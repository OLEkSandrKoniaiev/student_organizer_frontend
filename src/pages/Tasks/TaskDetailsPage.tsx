import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, type ITask } from "../../services/api.service";
import ImageGallery from "react-image-gallery";

const TaskDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<ITask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (!id) return;
        const data = await getTaskById(id);
        setTask(data);
      } catch (err) {
        console.error("Failed to fetch task:", err);
        setError("Failed to load task details");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) return <p>Loading task details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!task) return <p>No task data</p>;

  const images = (task.files || []).map((url) => ({
    original: url,
    thumbnail: url,
  }));

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
      <p className="text-gray-700 mb-2">{task.description}</p>
      <p className="mb-4">
        Status:{" "}
        <span
          className={`font-semibold ${task.done ? "text-green-600" : "text-red-600"}`}
        >
          {task.done ? "Done" : "Not Done"}
        </span>
      </p>

      {images.length > 0 && (
        <>
          {/* Горизонтальна превʼю-галерея */}
          <div className="flex gap-2 overflow-x-auto mb-6">
            {images.map((img, index) => (
              <img
                key={index}
                src={img.thumbnail}
                alt={`task-img-${index}`}
                className="w-32 h-32 object-cover cursor-pointer rounded shadow-sm hover:opacity-80 transition"
                onClick={() => {
                  setStartIndex(index);
                  setIsOpen(true);
                }}
              />
            ))}
          </div>

          {/* Модальне вікно з ImageGallery */}
          {isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
              <div className="w-[80%] h-[80%]">
                <ImageGallery
                  items={images}
                  startIndex={startIndex}
                  showThumbnails={false}
                  showFullscreenButton={false}
                  showPlayButton={false}
                  onSlide={(i) => setStartIndex(i)}
                />
              </div>
              <button
                className="absolute top-5 right-5 text-white text-2xl"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>
          )}
        </>
      )}

      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Back to Tasks
      </button>
    </div>
  );
};

export default TaskDetailsPage;
