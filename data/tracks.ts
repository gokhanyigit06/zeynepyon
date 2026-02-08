export interface AudioTrack {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    audioUrl: string;
    duration: string;
}

export const tracks: AudioTrack[] = [
    {
        id: 1,
        title: "Morning Whispers",
        description: "A calm start to the day with gentle reflections.",
        imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?w=400&h=400&fit=crop",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        duration: "4:20",
    },
    {
        id: 2,
        title: "City Echoes",
        description: "Urban stories from the heart of Istanbul.",
        imageUrl: "https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?w=400&h=400&fit=crop",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        duration: "3:15",
    },
    {
        id: 3,
        title: "Midnight Poetry",
        description: "Verses read under the moonlight.",
        imageUrl: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=400&h=400&fit=crop",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        duration: "5:45",
    },
    {
        id: 4,
        title: "The Silent Traveler",
        description: "Notes from a journey without words.",
        imageUrl: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=400&h=400&fit=crop",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        duration: "2:50",
    },
    {
        id: 5,
        title: "Coffee Shop Talks",
        description: "Overheard conversations and hidden meanings.",
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        duration: "6:10",
    },
    {
        id: 6,
        title: "Waves of Thought",
        description: "Deep dive into the ocean of mind.",
        imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        duration: "4:05",
    },
];
