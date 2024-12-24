import React from 'react'
import './Video.css'
import PlayVIdeo from '../../Components/PlayVideo/PlayVIdeo'
import PlayVideo from '../../Components/PlayVideo/PlayVIdeo'
import Recommended from '../../Components/Recommended/Recommended'
import { useParams } from 'react-router-dom'

const Video = () => {

  const {videoId,categoryId} = useParams();

  return (
    <div className='play-container'>
      <PlayVideo videoId={videoId}/>
      <Recommended />
    </div>
  )
}

export default Video
