import React from 'react';
import Routes from './src/routes'


import AppLoading from 'expo-app-loading'
import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost'

export default function App(){
  const [fontsLoaded ] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });

  //verificando se a fonta já está carregada
  if (!fontsLoaded)
  //enquanto a fonte nao foi carregada mostra a página de splash (logo)
    return <AppLoading />

  return (
    <Routes />
  )
}
