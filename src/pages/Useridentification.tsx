import React, { useState } from 'react';

import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
    KeyboardAvoidingView,
    Alert,
    Platform
} from 'react-native';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'

export function UserIdentification(){
    //isfocused pra saber se o foco esta no input
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    
    const [name, setName] = useState<string>();    const navigation = useNavigation();
    async function handleSubmit(){
        if(!name)
            return Alert.alert('Me diz como chamar você 🥺');
        
        try {
            //salvando no dispositivo do usuario o nome que ele digitou
            //passando a key que quero que se chame esse dado para recuperar depois e o valor dele
            //como esse salvamento nao é na hora, colocamos um async await para garantir esse salvamento antes de eu prosseguir
            await AsyncStorage.setItem('@plantmanager:user', name);
            navigation.navigate('Confirmation')
            
        } catch {
            Alert.alert('Não foi possível salvar o seu nome 😢');
        }
    }

    function handleInputBlur(){
        setIsFocused(false);
        //se caso ele sair do input e tiver conteudo no name ele continua verdinho
        setIsFilled(!!name);
    }
    function handleInputFocus(){
        setIsFocused(true);
    }
    function handleInputChange(value: string){
        //transformando esse conteudo em um booleano
        //se tem conteudo é true, se nao tiver é false
        setIsFilled(!!value);
        setName(value);
    }

    return(
        <SafeAreaView style={styles.container}>
            {/* Esse keyboard quando eu habilitar o teclado meu layout sobe */}
            <KeyboardAvoidingView 
                style={styles.container}
                //colocando um comportamento que se a plataforma for ios coloca um padding
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.content}>
                    <View style={styles.form}>
                        <View style={styles.header}>
                            <Text style={styles.emoji}>
                                {/* Apertei control + command + barra espaco */}
                                {isFilled ? '😄' : '😃' }
                            </Text>
                            <Text style={styles.title}>
                                Como podemos {'\n'} chamar você?
                            </Text>

                        </View>
                        <TextInput 
                            // passando mais de um estilo
                            style={[
                                styles.input,
                                (isFocused || isFilled) && {borderColor: colors.green}
                            ]}
                            placeholder="Digite um nome"
                            onBlur={handleInputBlur}
                            onFocus={handleInputFocus}
                            onChangeText={handleInputChange}
                        />
                        <View style={styles.footer}>
                            <Button 
                                title="Confirmar"
                                onPress={handleSubmit}
                            />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    content: {
        flex: 1,
        width: '100%'
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 54,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center'
    },
    emoji: {
        fontSize: 44
    },
    input: {
        borderBottomWidth: 1,
        borderColor: colors.gray,
        color: colors.heading,
        width: '100%',
        fontSize: 18,
        marginTop: 50,
        padding: 10,
        textAlign: 'center'
    },
    title: {
        fontSize: 24,
        lineHeight: 32,
        textAlign: 'center',
        color: colors.heading,
        fontFamily: fonts.heading,
        marginTop: 20
    },
    footer: {
        marginTop: 40,
        width: '100%',
        paddingHorizontal: 20,
    },
})