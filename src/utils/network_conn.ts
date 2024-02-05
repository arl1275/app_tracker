import NetInfo from '@react-native-community/netinfo';

const checkInternetConnection = async () => {
  const netInfoState = await NetInfo.fetch();
  return netInfoState.isConnected;
};

export default checkInternetConnection;
