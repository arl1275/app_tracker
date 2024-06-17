import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import LoginPage from './pages/login/login.page';
import GuardiaRoutes from './pages/guardia/guard_navigate';
import EntregadorRoutes from './pages/entregador/EntragadorRoutes.page';
import UserStorage from './storage/user';

export type RootStackParamList = {
  Home: undefined;
  Entregador: undefined;
  Guardia: undefined;
  Admin: undefined;
  Details: { itemId: number };
};

const Stack = createStackNavigator<RootStackParamList>();

function AuthHandler() {
  const { getType } = UserStorage();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const checkUserType = async () => {
    const tipo  :  number = await getType();
    //console.log('valor ::: ' , tipo)
    if (tipo === 2) {
      navigation.navigate('Guardia');
    } else if (tipo === 3) {
      navigation.navigate('Entregador');
    } else {
      navigation.navigate('Home');
    }
  };

  useEffect(() => {
     const intervalId = setInterval(() => {
      checkUserType();
     }, 3000);

     return () => clearInterval(intervalId);
  }, []);

  return null;
}

function IndexPage() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name="Entregador" component={EntregadorRoutes} options={{ headerShown: false }} />
        <Stack.Screen name="Guardia" component={GuardiaRoutes} options={{ headerShown: false }} />
      </Stack.Navigator>
      <AuthHandler />
    </NavigationContainer>
  );
}

export default IndexPage;
