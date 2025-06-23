import { firestore } from '@/config/firebase';
import { QueryConstraint, collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

const useFetchData = <T>(
    collectionName: string,
    contraints: QueryConstraint[] = []
) => {

    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!collectionName) return;
        const collectionRef = collection(firestore, collectionName);
        const queryRef = query(collectionRef, ...contraints);

        const unsub = onSnapshot(queryRef, (snapshot)=> {
            const fetchData = snapshot.docs.map(doc => {
                return {
                    id : doc.id,
                    ...doc.data()
                }
            }) as T[];
            setData(fetchData);
            setLoading(false);
        },(error) => {
            console.log("error fetching data : ", error);
            setError(error.message);
            setLoading(false);
        })

        return ()=> unsub();
    }, []);

    return {data, loading, error};
}

export default useFetchData

const styles = StyleSheet.create({})