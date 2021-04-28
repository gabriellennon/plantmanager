import React, { useEffect, useState } from 'react';
import { 
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    //renderiza listas na tela
    FlatList
} from 'react-native';
import fonts from '../assets/fonts';
import { EnviromentButton } from '../components/EnviromentButton';

import { Header } from '../components/Header';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Load } from '../components/Loading';
import api from '../services/api';
import colors from '../styles/colors';

//tipando o que vai vir de dentro da api
interface EnviromentProps {
    key: string,
    title: string
}
interface PlantProps {
    id: string;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: [string];
    frequency: {
      times: number;
      repeat_every: string;
    }
}

export function PlantSelect(){
    //adicionando estados
    const [enviroments, setEnvirtoments] = useState<EnviromentProps[]>([]);
    const [plants, setPlants] = useState<PlantProps[]>([]);
    const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
    //adicionando estado de selecionado e por padrao vai ser all
    const [enviromentSelected, setEnviromentSelected] = useState('all');
    const [loading, setLoading] = useState(true);
    //lidando com a paginacao
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    function handleEnviromentSelected(environment: string){
        setEnviromentSelected(environment);

        if(environment == 'all')
            return setFilteredPlants(plants);
        //caso nao seja o todos
        const filtered = plants.filter(plant => 
            //se a planta tiver o ambiente que contem o ambiente que to querendo filtrar
            plant.environments.includes(environment)
        );

        setFilteredPlants(filtered);
    }

    async function fetchPlants(){
        const { data } = await api.get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);
        //se nao tem nada para carregar
        if(!data)
            return setLoading(true)
        
        if(page > 1){
            //pegando os dados que foram armazenados anteriormente e juntando com o que ta chegando de dados
            setPlants(oldValue => [...oldValue, ...data])
            setFilteredPlants(oldValue => [...oldValue, ...data])
        }else{
            setPlants(data);
            setFilteredPlants(data);

        }

        setLoading(false);
        setLoadingMore(false);
    }

    //quando o usuario chegar no final da pagina eu carrego mais dados
    function handleFetchMore(distance: number) {
        if(distance < 1)
            return;
        
        setLoadingMore(true);
        setPage(oldValue => oldValue + 1);
        fetchPlants();
        
    }

    //na hora que a tela é montada ele é carregado antes da tela
    useEffect(() => {
        //como essa minha busca na api vai depender de internet e outros fatores, coloco o asyn e await
        //para garantir que ele vai aguardar minha api retornar os dados
        async function fetchEnviroment(){
            //nesse contexto o ? quer dizer que vou adicionar parametro
            //ordenacao esta sendo feito pela lib json que favoritei, parametros _sort ordenar pelo titlo e em forma ascendente order=asc
            const { data } = await api.get('plants_environments?_sort=title&_order=asc');
            setEnvirtoments([
                {
                key: 'all',
                title: 'Todos'
                },
                //despejando o resto tudo
                ... data
            ])
        }

        fetchEnviroment();
    }, [])

    useEffect(() => {
        fetchPlants();
    })

    if(loading)
        return <Load />

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />
                <Text style={styles.title}>
                    Em qual ambiente
                </Text>
                <Text style={styles.subtitle}>
                    você quer colocar sua planta?
                </Text>
            </View>
            <View>
                <FlatList 
                    data={enviroments}
                    keyExtractor={(item) => String(item.key)}
                    renderItem={({ item }) => (
                        <EnviromentButton 
                            title={item.title}
                            active={item.key === enviromentSelected}
                            onPress={() => handleEnviromentSelected(item.key)}
                        />

                    )}
                    horizontal
                    //desabilitando a indicacao de rolacao (barrinha) que aparece, é tipo quando coloco o  overflow
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                />
            </View>
            <View style={styles.plants}>
                <FlatList
                    data={filteredPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <PlantCardPrimary 
                            data={item}  
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    //lista vai ser redenrizada em 2 colunas
                    numColumns={2}
                    //quando o usuario chegar ao final de 10% da tela
                    onEndReachedThreshold={0.1}
                    //quando isso acima acontece eu  pego a distancia do final e passo pra minha function
                    onEndReached={({ distanceFromEnd }) => 
                        handleFetchMore(distanceFromEnd)
                    }
                    ListFooterComponent={
                        //se loadingmore for true ele aparece
                        loadingMore
                        ? <ActivityIndicator color={colors.green} />
                        : <></>
                    }
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: 30
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        fontWeight: 'bold',
        lineHeight: 20,
        marginTop: 15
    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading
    },
    enviromentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        marginLeft: 32,
        marginVertical:32
    },
    plants: {
        //ocupa todo o resto que sobrar da tela
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center'
    },
})