import React from 'react'
import { AiFillPlayCircle, AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useRef, useState, useEffect } from "react"
import { BsFillPauseFill, BsPlayFill } from 'react-icons/bs'
import { HiMiniSpeakerWave } from 'react-icons/hi2'
import firstvideo from "../../assets/pexels-sara-mazin-20125021 (1080p).mp4"
import "./video.css"
const Video = () => {
    const [videoUrl, setVideoUrl] = useState(firstvideo);
    const videoRef = useRef(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [videoDuration, setVideoDuration] = useState(0)
    const [videoCurrentTime, setVideoCurrentTime] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isVolumeHidden, setIsVolumeHidden] = useState(true);
    const [progress, setProgress] = useState(0)
    const progressBarRef = useRef(null)
    const [buffring, setBuffring] = useState(false);


    const handleSelectVideo = (e) => {
        const selectedVideo = e.target.files && e.target.files[0]
        if (selectedVideo) {
            const selectedVideoUrl = URL.createObjectURL(selectedVideo)
            setVideoUrl(selectedVideoUrl)
            setProgress(0)
            setIsPlaying(false)
        }
    }




    const handleVolumeChange = (e) => {
        const volumeRange = Number(e.target.value)
        setVolume(volumeRange)
        if (videoRef.current) {
            videoRef.current.volume = volumeRange
        }
    }

    const handleLoadingFinish = () => {
        setVideoDuration(videoRef.current?.duration || 0);
        setIsLoading(false);
    }

    const handleTimeUpdate = () => {
        const currentTime = videoRef.current?.currentTime || 0
        setVideoCurrentTime(currentTime);
        if (videoRef.current?.duration) {
            setProgress((currentTime / videoRef.current.duration) * 100)
        }
    }

    const handleVideoEnded = () => {
        videoRef.current?.pause();
        setIsPlaying(false);
    }

    const handlePlayPause = () => {
        setIsPlaying(p => {
            if (p) {
                videoRef.current?.pause();
            }
            else {
                videoRef.current?.play();
            }
            return !p
        })
    }

    const seekLeft = () => {
        const currentVideoTime = videoRef.current?.currentTime || 0
        if (videoRef.current) {
            videoRef.current.currentTime = currentVideoTime - 10
        }
    }
    const seekRight = () => {
        const currentVideoTime = videoRef.current?.currentTime || 0
        if (videoRef.current) {
            videoRef.current.currentTime = currentVideoTime + 10
        }
    }

    const handlePlayerClick = (e) => {

        const clickPostion = e.nativeEvent.offsetX
        const playerWidth = videoRef.current?.clientWidth
        const clickPostionPercent = clickPostion / (playerWidth || 0) * 100
        const centerStartPostion = 42
        const centerEndPostion = 58

        if (clickPostionPercent >= centerStartPostion && clickPostionPercent <= centerEndPostion) {
            handlePlayPause()
        }
        else if (clickPostionPercent < centerStartPostion) {
            seekLeft()
        }
        else if (clickPostionPercent > centerEndPostion) {
            seekRight()
        }
    }
    const handleProgressBarClick = (e) => {
        const clickPostion = e.nativeEvent.offsetX
        const progressBarWidth = progressBarRef.current?.clientWidth
        const clickPostionPercent = clickPostion / (progressBarWidth || 0) * 100
        const clickedTime = (videoDuration / 100) * clickPostionPercent
        if (videoRef.current) {
            videoRef.current.currentTime = clickedTime;
        }
    }

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        return formattedTime;
    }


    useEffect(() => {
        const videoPlayer = videoRef.current
        const handleLoadingStart = () => {
            setIsLoading(true)
        }
        const handleBuffring = () => {
            setBuffring(true);
        }
        const handlePlaying = () => {
            setBuffring(false);
        }

        if (videoPlayer) {
            videoPlayer.addEventListener('loadstart', handleLoadingStart)
            videoPlayer.addEventListener('canplaythrough', handleLoadingFinish);
            videoPlayer.addEventListener('timeupdate', handleTimeUpdate)
            videoPlayer.addEventListener('ended', handleVideoEnded)
            videoPlayer.addEventListener('waiting', handleBuffring)
            videoPlayer.addEventListener('stalled', handleBuffring)
            videoPlayer.addEventListener('playing', handlePlaying)

        }
        return () => {
            videoPlayer?.removeEventListener('loadstart', handleLoadingStart)
            videoPlayer?.removeEventListener('canplaythrough', handleLoadingFinish);
            videoPlayer?.removeEventListener('timeupdate', handleTimeUpdate)
            videoPlayer?.removeEventListener('ended', handleVideoEnded)
            videoPlayer?.removeEventListener('waiting', handleBuffring)
            videoPlayer?.removeEventListener('stalled', handleBuffring)
            videoPlayer?.removeEventListener('playing', handlePlaying)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="video-wrapper ">
            <label className="video-selector " htmlFor="select-video">Select Video <AiFillPlayCircle /></label>
            <input className="video-input" onChange={handleSelectVideo} type="file" name="select-video" id="select-video" accept="video/*" multiple={false} />
            {(buffring || isLoading) && <div className="loader"><AiOutlineLoading3Quarters /></div>}
            {videoUrl && <video onDoubleClick={handlePlayerClick} className="video " ref={videoRef} src={videoUrl} ></video>}
            {!videoUrl && <div className='video-scalaton'></div>}
            <div className="toolbar-container ">
                {
                    !isLoading && <div className="toolbar ">
                        <div className="video-timer-container ">
                            <p>{formatTime(videoCurrentTime)}</p>
                            <div onClick={handleProgressBarClick} ref={progressBarRef} className="video-timer ">
                                <div style={{ width: `${progress}%`, height:'100%', backgroundColor:'black',borderRadius:'8px' }}  ></div>
                            </div>
                            <p>{formatTime(videoDuration)}</p>
                            <div style={{position:'relative'}} >
                                {!isVolumeHidden && <input step={0.05} value={volume} onChange={handleVolumeChange} min={0} max={1}  className="volume-controller " type="range" name="volume" id="volume" />}
                                <HiMiniSpeakerWave style={{cursor:'pointer'}} onClick={() => setIsVolumeHidden(p => !p)} />
                            </div>
                        </div>

                        <div >
                            <div style={{cursor:'pointer',fontSize:'34px'}}onClick={handlePlayPause} >
                                {
                                    isPlaying && <BsFillPauseFill />
                                }
                                {
                                    !isPlaying && <BsPlayFill />
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Video