import React, { useState, useEffect } from "react";
import axios from "axios";
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

  if (loading) return <p>Loading YouTube videos...</p>;

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="youtube-videos">
      <h3>Related YouTube Videos</h3>
      {videos.length > 0 ? (
        videos.map((video, index) => (
          <div key={index}>
            <h4>{video.title}</h4>
            <div dangerouslySetInnerHTML={{ __html: video.embed_html }} />
          </div>
        ))
      ) : (
        <p>No videos found.</p>
      )}
    </div>
  );
}

export default YouTubeVideos;
