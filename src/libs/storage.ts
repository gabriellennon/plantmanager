import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';


export interface PlantProps {
    id: string;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: [string];
    frequency: {
      times: number;
      repeat_every: string;
    },
    dateTimeNotification: Date,
}

interface StoragePlantProps {
    [id: string]: {
        data: PlantProps;
    }
}

export async function savePlant(plant: PlantProps) : Promise<void>{
    try {
        const data = await AsyncStorage.getItem('@plantmanager:plants');
        //o tipo dele deve ser igual ao de storageplantprops
        const oldPlants = data ? (JSON.parse(data) as StoragePlantProps) : {};

        const newPlant = {
            [plant.id]: {
                data: plant
            }
        }

        await AsyncStorage.setItem('@plantmanager:plants', JSON.stringify({
            //pegando o que ja existia e adicionando a nova planta
            ...newPlant,
            ...oldPlants
        }))
    } catch (error) {
        //passando o erro pra frente, e ai se eu quiser tratar o erro eu trato na tela que aparecer
        throw new Error(error);
    }
}

export async function loadPlant() : Promise<PlantProps[]>{
    try {
        const data = await AsyncStorage.getItem('@plantmanager:plants');
        //o tipo dele deve ser igual ao de storageplantprops
        const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

        //percorrendo cada key das minha plantas e fazendo o map
        const plantsSorted = Object
        .keys(plants)
        .map((plant) => {
            return {
                ...plants[plant].data,
                hour: format(new Date(plants[plant].data.dateTimeNotification), 'HH:mm')
            }
        })
        .sort((a, b) => 
            Math.floor(
                new Date(a.dateTimeNotification).getTime() / 1000 -
                Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
            )
        )

        return plantsSorted;
    } catch (error) {
        //passando o erro pra frente, e ai se eu quiser tratar o erro eu trato na tela que aparecer
        throw new Error(error);
    }
}