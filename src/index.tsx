import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Modal, Alert } from 'react-native';
import { EntregadorIndexView } from './pages/entregador/EntregadorMain.view';
import { MainGuardView } from './pages/guardia/GuardMainView';
import LoginPage from './pages/login/login.page';
import isConnectedToInternet from './utils/network_conn';
import UserStorage from './storage/user';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  Entregador: undefined,
  Guardia: undefined;
  Admin: undefined,
  Details: { itemId: number };
};

function IndexPage() {
  const [ isconn , setIsconn] = useState<boolean>(false);
  const Stack = createStackNavigator<RootStackParamList>();
  const { getType } = UserStorage();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={LoginPage} options={{ headerShown  : false}} />
        <Stack.Screen name="Entregador" component={ EntregadorIndexView } options={{ headerShown  : false}}/> 
        <Stack.Screen name="Guardia" component={ MainGuardView} options={{ headerShown  : false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default IndexPage;