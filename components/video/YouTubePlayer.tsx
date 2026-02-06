'use client';

import YouTube, { YouTubeProps } from 'react-youtube';

interface YouTubePlayerProps {
  videoId: string;
  className?: string;
}

export function YouTubePlayer({ videoId, className = '' }: YouTubePlayerProps) {
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  const opts: YouTubeProps['opts'] = {
    width: '100%',
    height: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div className={className}>
      <YouTube 
        videoId={videoId} 
        opts={opts} 
        onReady={onPlayerReady}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />
    </div>
  );
}
