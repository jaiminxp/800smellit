import {
  SyntheticEvent,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import Table from '@/components/Table'
import { toast } from 'react-toastify'
import gramophoneImg from '@/assets/gramophone.png'
import { Musician } from '@/types'
import { GameContext } from '@/context/gameContext'
import { MUSIC_BUILDING_SEQUENCE } from '@/constants/textures'
import { createQueryString } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { musicianService } from '@/services'
import MusicFilter from './music-filter'

function PlayMusic() {
  const [searchQuery, setSearchQuery] = useState<string>()
  const [selectedMusicianId, setSelectedMusicianId] = useState<string>()
  const createQueryStringCb = useCallback(createQueryString, [])
  const songs = useRef<HTMLAudioElement[]>([])
  const { game } = useContext(GameContext)

  const {
    data: musicians,
    error,
    isLoading,
  } = useQuery(['search-musicians', searchQuery], () =>
    musicianService.search(searchQuery)
  )

  const selectedMusician =
    musicians &&
    musicians.find((musician) => musician._id === selectedMusicianId)

  if (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('Something went wrong during fetching musicians')
    }
  }

  let bgMusic: Phaser.Sound.BaseSound
  if (game) {
    bgMusic = game.sound.get(MUSIC_BUILDING_SEQUENCE)
  }

  // checks if any audio in the list is playing
  const isPlaying = (audioList: HTMLAudioElement[]) => {
    return audioList.some((audio) => !audio.paused)
  }

  return (
    <div className="overflow-scroll bg-music-elevator-ui bg-full bg-no-repeat flex justify-center absolute top-[4%] left-[3%] text-white w-[75%] max-h-[95%] p-5 pb-10 pl-9 flex-col">
      <h1 className="text-center text-3xl mb-5 font-bold">Play Music</h1>
      <div className="flex justify-between gap-5 min-h-[300px] overflow-auto m-2">
        <MusicFilter
          onSubmit={(values) => setSearchQuery(createQueryStringCb(values))}
        />

        <div className="overflow-auto w-8/12">
          {isLoading ? (
            <div className="flex-1 text-center bg-gray-gradient h-min p-8 m-2">
              <h3 className="text-2xl">Loading...</h3>
            </div>
          ) : musicians && musicians.length > 0 ? (
            <Table
              data={musicians}
              imageIndex={0}
              linkIndex={5}
              artistLinkIndex={1}
              artistLinkIdField="id"
              displayFields={[
                'logo.url',
                'name',
                'band',
                'fullAddress',
                'genre',
                'website',
              ]}
              columns={[
                'BAND LOGO',
                'ARTIST',
                'BAND',
                'ORIGIN',
                'GENRE',
                'WEBSITE',
              ]}
              onRowClick={(musician: Musician) =>
                setSelectedMusicianId(musician._id)
              }
            />
          ) : (
            <div className="flex-1 text-center bg-gray-gradient h-min p-8 m-2">
              <h3 className="text-2xl">
                No musicians found for selected filters
              </h3>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-4 mt-2">
        <img src={gramophoneImg} className="h-[300px] w-4/12" />
        <div className="bg-gray-gradient p-5 rounded-2xl">
          {selectedMusician ? (
            <>
              <div className="flex gap-5">
                <img
                  className="w-10 h-10"
                  src={selectedMusician?.logo?.url}
                  alt=""
                />
                <h3 className="text-2xl text-center mb-5">
                  Artist: {selectedMusician.name}
                </h3>
              </div>
              {selectedMusician &&
                selectedMusician.songs &&
                selectedMusician.songs.map((song, i) => (
                  <div
                    key={song._id}
                    className="flex items-center mb-2 justify-between gap-5"
                  >
                    <span>Song {i}</span>
                    <audio
                      ref={(e) => (songs.current[i] = e as HTMLAudioElement)}
                      onPlay={() => {
                        bgMusic.pause()
                      }}
                      onPause={(e: SyntheticEvent) => {
                        const clip = e.target as HTMLAudioElement

                        if (!clip.seeking && !isPlaying(songs.current)) {
                          // resume if all songs are paused
                          bgMusic.resume()
                        }
                      }}
                      src={song.url}
                      controls
                    />
                  </div>
                ))}
            </>
          ) : (
            <p>Select an artist to view their songs</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlayMusic
