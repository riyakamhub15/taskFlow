
import React, { useEffect, useState } from "react";
import API from "../services/api";

const TaskStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/tasks/stats");
        setStats(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Failed to load statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading statistics...</p>;

  if (error) return <p>{error}</p>;

  if (!stats) return null;

  const cards = [
    { title: "Total Tasks", value: stats.totalTasks },
    { title: "To Do", value: stats.todoTasks },
    { title: "In Progress", value: stats.inProgressTasks },
    { title: "Completed", value: stats.completedTasks },
    { title: "High Priority", value: stats.priority.high },
    { title: "Medium Priority", value: stats.priority.medium },
    { title: "Low Priority", value: stats.priority.low },
  ];

  return (
    <div className="stats-container">
      {cards.map((card) => (
        <div className="stats-card" key={card.title}>
          <h3>{card.title}</h3>
          <p>{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;
