import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import ShowIndexView from './pages/guardia/guardia_main_view';
import { EntregadorIndexView } from './pages/entregador/EntregadorMain.view';
import { MainGuardView } from './components/GuardComponents/GuardMainView';
//test

//test

function IndexPage() {
  const [page, setPage] = useState("");


  return (
    <View style={{ display: 'flex', backgroundColor: 'white' }}>
      <View style={{ width: '100%', height: '100%', alignSelf: 'center' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
          <Text onPress={() => setPage('GUARDIA')} style={{ color: 'black' }}>GUARDIA</Text>
          <Text onPress={() => setPage('ENTREGADOR')} style={{ color: 'black' }}>ENTREGADOR</Text>
        </View>
        {page === "GUARDIA" ? <MainGuardView /> : null}
        {page === "ENTREGADOR" ? <EntregadorIndexView /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  navItems: {
    marginHorizontal: 10,
  },
  navLink: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue', // You can set your desired text color here
  },
});

export default IndexPage;