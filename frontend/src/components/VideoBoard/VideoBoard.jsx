import { useState } from "react"
import { Play, Clock, Award, Heart } from "lucide-react"

function VideoBoard() {
  const videos = [
 
    {
      id: "tiles-1",
      title: "Майстер-клас: укладання плитки своїми руками",
      description: "Покрокова інструкція, як підготувати поверхню, обрати клей, зробити розмітку і викласти плитку рівно та якісно.",
      duration: "8:15",
      views: "8.5K",
      thumbnail: "https://i.ytimg.com/vi/r-kAGoIxOGw/maxresdefault.jpg",
      videoId: "r-kAGoIxOGw",
      trainer: "РемонтХаб",
    },
    {
      id: "cement-1",
      title: "Як правильно вибрати цемент для різних типів робіт",
      description: "Цемент буває різних марок і складів. У цьому відео дізнаєтесь, як обрати правильний цемент для фундаменту, штукатурки та кладки.",
      duration: "5:24",
      views: "12K",
      thumbnail: "https://i.ytimg.com/vi/k7A9bhaZhxk/maxresdefault.jpg",
      videoId: "k7A9bhaZhxk",
      trainer: "БудПрофі",
    },
    {
      id: "tools-1",
      title: "Топ-5 інструментів для домашнього ремонту",
      description: "Що потрібно мати у валізі кожного майстра? Порівнюємо функціональність, зручність та бюджет найкращих інструментів.",
      duration: "6:42",
      views: "15K",
      thumbnail: "https://i.ytimg.com/vi/LIUTefK7Uwc/maxresdefault.jpg",
      videoId: "LIUTefK7Uwc",
      trainer: "DIY Майстер",
    },
  ]
  const [activeVideo, setActiveVideo] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const currentVideo = videos[activeVideo]

  const handleVideoChange = (index) => {
    setActiveVideo(index)
    setIsPlaying(false)
  }

  const handlePlayClick = () => {
    setIsPlaying(true)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-2">
          <div className="relative rounded-xl overflow-hidden bg-black">
            {!isPlaying ? (
              <div className="relative">
                <img
                  src={currentVideo.thumbnail}
                  alt={currentVideo.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <button
                    onClick={handlePlayClick}
                    className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                  >
                    <Play size={32} fill="white" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1&rel=0`}
                  title={currentVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-bold">{currentVideo.title}</h3>
            <div className="flex items-center mt-2 text-gray-600">
              <span className="flex items-center mr-4">
                <Clock size={16} className="mr-1" />
                {currentVideo.duration}
              </span>
              <span className="flex items-center mr-4">
                <Award size={16} className="mr-1" />
                {currentVideo.trainer}
              </span>
              <span className="flex items-center">
                <Heart size={16} className="mr-1" />
                {currentVideo.views} переглядів
              </span>
            </div>
            <p className="mt-2 text-gray-700">{currentVideo.description}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Інші відео</h3>
          <div className="space-y-4">
            {videos.map((video, index) => (
              <div
                key={video.id}
                onClick={() => handleVideoChange(index)}
                className={`flex cursor-pointer rounded-lg overflow-hidden transition-all ${
                  activeVideo === index
                    ? "border-2 border-orange-600 bg-orange-50"
                    : "border border-gray-200 hover:border-orange-400"
                }`}
              >
                <div className="relative w-24 h-20 flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-2 flex-1">
                  <h4 className="text-sm font-medium line-clamp-2">{video.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{video.trainer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoBoard
