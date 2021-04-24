import { createContext } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    play: (episode: Episode) => void;
    setPlayState: (state: boolean) => void;
    togglePlay: () => void;
    isPlaying: boolean;
}

export const PlayerContext = createContext({} as PlayerContextData);