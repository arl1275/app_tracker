const success = '../../assets/sound/success.mp3';
import SoundPlayer from "react-native-sound-player";

export const play_sound = ( state : boolean) => {
  try {
    SoundPlayer.playSoundFile( state ? 'success' : 'error',  'mp3');
  } catch (err) {
    console.log('error al reproducir')
  }
};


