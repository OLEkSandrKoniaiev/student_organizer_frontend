import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTasks,
  toggleTaskDone,
  deleteTask,
  type ITask,
} from "../../services/api.service";

const TASKS_PER_PAGE = 5;

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchTasks = async (pageToFetch: number) => {
    setLoading(true);
    try {
      const data = await getTasks(pageToFetch, TASKS_PER_PAGE);
      setTasks((prev) => [...prev, ...data.tasks]);
      setTotalCount(data.taskTotalCount);
    } catch (err: unknown) {
      console.error("Failed to fetch tasks:", err);
      alert("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(page);
  }, [page]);

  const handleLoadMore = () => setPage((prev) => prev + 1);

  const handleToggleDone = async (id: string, currentDone: boolean) => {
    try {
      const updatedTask = await toggleTaskDone(id, !currentDone);
      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? { ...task, done: updatedTask.done } : task,
        ),
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Failed to update task status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      setTotalCount((prev) => prev - 1);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      alert("Failed to delete task");
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-3xl mx-auto mt-10 flex flex-col gap-4">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
      </div>

      {filteredTasks.length === 0 && <p>No tasks found</p>}

      {filteredTasks.map((task) => (
        <div
          key={task._id}
          className="border p-4 rounded shadow hover:shadow-md transition flex flex-col gap-3"
        >
          <div
            className="cursor-pointer"
            onClick={() => navigate(`/task/${task._id}`)}
          >
            <h2 className="font-bold text-lg">{task.title}</h2>
            <p className="text-gray-700">{task.description}</p>
            <p className="text-sm text-gray-500">
              {task.done ? "✅ Done" : "⌛ Pending"}
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => handleToggleDone(task._id, task.done)}
              className={`px-3 py-1 rounded text-white transition ${
                task.done
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {task.done ? "Undone" : "Done"}
            </button>

            <button
              onClick={() => navigate(`/task/${task._id}/edit`)}
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(task._id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {tasks.length < totalCount && (
        <button
          onClick={handleLoadMore}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
};

export default TaskListPage;
