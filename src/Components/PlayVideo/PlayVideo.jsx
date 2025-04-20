import React, { useEffect, useState } from "react";
import "./PlayVideo.css";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import jack from "../../assets/jack.png";
import { API_KEY, value_converter } from "../../data";
import moment from "moment";
import { use } from "react";
import { useParams } from "react-router-dom";

const PlayVideo = () => {

  const {videoId}=useParams();

  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);


  const fetchVideoData = async () => {
    const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
    await fetch(videoDetails_url)
      .then((res) => res.json())
      .then((data) => setApiData(data.items ? data.items[0] : null))
      .catch((error) => console.error("Error fetching video data:", error));
  };

  const fetchOtherData = async () => {
    if (!apiData || !apiData.snippet) {
      console.error("apiData is null or incomplete. Skipping fetchOtherData.");
      return;
    }

    const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
    await fetch(channelData_url)
      .then((res) => res.json())
      .then((data) => setChannelData(data.items[0]))
      .catch((error) => console.error("Error fetching channel data:", error));

    const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
    await fetch(comment_url)
      .then((res) => res.json())
      .then((data) => setCommentData(data.items))
      .catch((error) => console.error("Error fetching comment data:", error));
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    if (apiData) {
      fetchOtherData();
    }
  }, [apiData]);

  if (!videoId) {
    return <p>Video not available. Please provide a valid video ID.</p>;
  }

  if (!apiData) {
    return <p>Loading video data...</p>; // Show a loading message while data is being fetched
  }

  return (
    <div className="play-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      <h3>{apiData.snippet.title || "Title Here"}</h3>
      <div className="play-video-info">
        <p>
          {value_converter(apiData.statistics.viewCount) || "16k"} views &bull;{" "}
          {apiData?moment(apiData.snippet.publishedAt).fromNow():""}
        </p>
        <div>
          <span>
            <img src={like} alt="" />
            {apiData?value_converter(apiData.statistics.likeCount):""}
          </span>
          <span>
            <img src={dislike} alt="" />
          </span>
          <span>
            <img src={share} alt="" />
            Share
          </span>
          <span>
            <img src={save} alt="" />
            save
          </span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img src={channelData?channelData.snippet.thumbnails.default.url:""} alt="" />
        <div>
          <p>{apiData?apiData.snippet.channelTitle:""}</p>
          <span>{channelData?value_converter(channelData.statistics.subscriberCount):"1M"} Subscribers</span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        <p>{apiData?apiData.snippet.description.slice(0,250):"Descroption here"}</p>
        <hr />
        <h4>{apiData?value_converter(apiData.statistics.commentCount):102} Comments</h4>
        {commentData.map((item, index) => {
          return (
            <div key={index} className="comment">
              <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
              <div>
                <h3>
                  {item.snippet.topLevelComment.snippet.authorDisplayName} <span> {moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span>
                </h3>
                <p>
                  {item.snippet.topLevelComment.snippet.textDisplay}
                </p>
                <div className="comment-section">
                  <img src={like} alt="" />
                  <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                  <img src={dislike} alt="" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayVideo;
