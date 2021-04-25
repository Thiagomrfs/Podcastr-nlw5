import { useRef, useEffect, useState } from 'react';
import { usePlayer } from '../../contexts/playerContext';

import Image from 'next/image';
import Head from 'next/head';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
    const [progress, setProgress] = useState(0);

    const { 
        episodeList, currentEpisodeIndex,
        isPlaying, togglePlay, setPlayState, clearPlayerState,
        playNext, hasNext, playPrevious, hasPrevious,
        isLooping, toggleLoop,
        isShuffling, toggleShuffle
    } = usePlayer();

    const episode = episodeList[currentEpisodeIndex];
    const audioRef = useRef<HTMLAudioElement>(null);

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', event => {
            setProgress(Math.floor(audioRef?.current?.currentTime));
        })
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEndend() {
        if (hasNext) {
            playNext();
        } else {
            clearPlayerState();
        }
    }

    useEffect( () => {
        if(!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying])

    return (
        <div className={styles.playerContainer}>
            <Head>
                <title>Home | Podcastr</title>
            </Head>

            <header>
                <img src="/playing.svg" alt="tocando agora"/>
                <strong>Tocando agora</strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image width={592} height={592} src={episode.thumbnail} objectFit='cover'/>
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
            <div className={styles.emptyPlayer}>
                <strong>Selecione um podcast para ouvir</strong>
            </div>
            ) }

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>

                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                                max={audioRef?.current?.duration}
                                value={progress}
                                onChange={handleSeek}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    
                    <span>{episode?.durationAsString ?? convertDurationToTimeString(0)}</span>
                </div>

                { episode && (
                    <audio 
                        src={episode.url}
                        ref={audioRef}
                        loop={isLooping}
                        onPlay={() => setPlayState(true)}
                        onEnded={handleEpisodeEndend}
                        onPause={() => setPlayState(false)}
                        onLoadedMetadata={setupProgressListener}
                        autoPlay/>
                    )}

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode || episodeList.length === 1} onClick={() => toggleShuffle()} className={isShuffling ? styles.isActive : ""}>
                        <img src="/shuffle.svg" alt="embaralhar"/>
                    </button>
                    <button type="button" disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="tocar anterior" onClick={() => playPrevious()}/>
                    </button>
                    <button type="button" className={styles.playButton} disabled={!episode} onClick={() => togglePlay()}>
                        { isPlaying ? (
                            <img src="/pause.svg" alt="pausar"/>
                        ) : (
                            <img src="/play.svg" alt="tocar"/>
                        )}
                    </button>
                    <button type="button" disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="tocar próxima" onClick={() => playNext()}/>
                    </button>
                    <button type="button" disabled={!episode} onClick={() => toggleLoop()} className={isLooping ? styles.isActive : ""}>
                        <img src="/repeat.svg" alt="repetir" />
                    </button>
                </div>
            </footer>
        </div>
    );
}