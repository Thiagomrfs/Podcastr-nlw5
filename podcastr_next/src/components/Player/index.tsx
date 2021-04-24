import { useContext, useRef, useEffect } from 'react';
import { PlayerContext } from '../../contexts/playerContext';

import Image from 'next/image';
import Slider from 'rc-slider'

import 'rc-slider/assets/index.css'
import styles from './styles.module.scss';

export function Player() {
    const { episodeList, currentEpisodeIndex, isPlaying, togglePlay, setPlayState } = useContext(PlayerContext);

    const episode = episodeList[currentEpisodeIndex];
    const audioRef = useRef<HTMLAudioElement>(null);

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
                    <span>00:00</span>

                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    
                    <span>00:00</span>
                </div>

                { episode && (
                    <audio 
                        src={episode.url}
                        ref={audioRef}
                        onPlay={() => setPlayState(true)}
                        onPause={() => setPlayState(false)}
                        autoPlay/>
                    )}

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode}>
                        <img src="/shuffle.svg" alt="embaralhar"/>
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/play-previous.svg" alt="tocar anterior"/>
                    </button>
                    <button type="button" className={styles.playButton} disabled={!episode} onClick={() => togglePlay()}>
                        { isPlaying ? (
                            <img src="/pause.svg" alt="pausar"/>
                        ) : (
                            <img src="/play.svg" alt="tocar"/>
                        )}
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/play-next.svg" alt="tocar próxima"/>
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/repeat.svg" alt="repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    );
}