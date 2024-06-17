import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import axios from 'axios';
import db_dir from '../config/db';

const isConnectedToInternet = async (): Promise<boolean> => {
  try {
    const result = await axios.get(db_dir + "/");
    if(result.status === 200){
      //console.log('esta conectado ....')
      return true;
    }else{
      return false;
    }
  } catch (error) {
    //console.error('Error checking internet connectivity');
    return false;
  }
};

export default isConnectedToInternet;

