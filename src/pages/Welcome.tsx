import React, { useState } from 'react';
//pegando os elementos visuais de react native
import { 
    SafeAreaView, 
    Text, 
    Image, 
    TouchableOpacity, 
    StyleSheet,
    Dimensions,
    View
} from "react-native";
import { Entypo, Feather } from '@expo/vector-icons'

import wateringImg from '../assets/watering.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts'
import { useNavigation } from '@react-navigation/core';

export function Welcome(){

    const navigation = useNavigation();
    function handleStart(){
        navigation.navigate('UserIdentification')
    }
    
    return(
        //view é como se fosse uma div
        //flex box é nativo e default no react native
        //o safeareaview já leva em consideracao o cabecalho do celular e demais detalhes
        <SafeAreaView style={styles.constainer}>
            <View style={styles.wrapper}>
                <Text style={styles.title}>
                    Gerencie {'\n'} 
                    suas plantas de{'\n'}
                    forma fácil
                </Text>
                <Image 
                    source={wateringImg} 
                    style={styles.image}
                    resizeMode="contain"
                />

                <Text style={styles.subtitle}>
                    Não esqueça mais de regar suas plantas. 
                    Nós cuidamos de lembrar você sempre que {'\n'} precisar.
                </Text>

                <TouchableOpacity 
                    style={styles.button} 
                    activeOpacity={0.7}
                    onPress={handleStart}
                >
                    <Text> 
                        <Feather 
                            name="chevron-right" 
                            style={styles.buttonIcon} 
                        />
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    constainer: {
        //flex 1 = dizer que ocupa a aula todo
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 20
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.heading,
        marginTop: 38,
        fontFamily: fonts.heading,
        lineHeight: 34
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 18,
        paddingHorizontal: 20,
        color: colors.heading,
        fontFamily: fonts.text
    },
    button: {
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 10,
        height: 56,
        width: 56
    },
    buttonIcon: {
        color: colors.white,
        fontSize: 32
    },
    image: {
        //pegando a dimensao da janela por completa e multiplicando o width por 0.7
        height: Dimensions.get('window').width * 0.7
    },
})