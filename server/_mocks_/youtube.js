// Mock untuk YouTube API
export const mockYouTubeResponse = (interest) => {
  return {
    videos: [
      {
        videoId: "mock123",
        title: `Mocked video for ${interest}`,
        thumbnail: "https://img.youtube.com/vi/mock123/mqdefault.jpg",
      },
      {
        videoId: "mock456",
        title: `Another ${interest} related video`,
        thumbnail: "https://img.youtube.com/vi/mock456/mqdefault.jpg",
      },
    ],
  };
};
