import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/YouTubeVideos.module.css";

const apiUrl = import.meta.env.VITE_SMARTCHEF_API_URL;

function YouTubeVideos({ recipeTitle }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchYouTubeVideos = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/videos?query=${recipeTitle}`
        );
        setVideos(response.data);
      } catch (error) {
        setError("An error occurred while fetching YouTube videos.");
      } finally {
        setLoading(false);
      }
    };
    fetchYouTubeVideos();
  }, [recipeTitle]);

  if (loading)
    return <p className={styles["loading"]}>Loading YouTube videos...</p>;

  if (error) return <p className={styles["error"]}>{error}</p>;

  return (
    <div className={styles["youtube-videos"]}>
      <h3 className={styles["title"]}>Related YouTube Videos</h3>
      {videos.length > 0 ? (
        <div className={styles["video-grid"]}>
          {videos.map((video, index) => (
            <div key={index} className={styles["video-card"]}>
              <div className={styles["video-thumbnail"]}>
                <div dangerouslySetInnerHTML={{ __html: video.embed_html }} />
              </div>
              <h4 className={styles["video-title"]}>{video.title}</h4>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles["no-videos"]}>No videos found.</p>
      )}
    </div>
  );
}

export default YouTubeVideos;
