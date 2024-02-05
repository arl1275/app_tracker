import NetInfo, {NetInfoState} from '@react-native-community/netinfo';

const isConnectedToInternet = async (): Promise<boolean> => {
  try {
    const connectionInfo: NetInfoState = await NetInfo.fetch();
    return connectionInfo.isConnected ?? false;
  } catch (error) {
    console.error('Error checking internet connectivity:', error);
    return false;
  }
};

export default isConnectedToInternet;

