import { router } from 'expo-router';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';

import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { db } from '../firebaseConfig';

export default function DetalhesScreen() {
  const [pastas, setPastas] = useState<any[]>([]);
  const [nomePasta, setNomePasta] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const listarPastas = async () => {
    try {
      const snap = await getDocs(collection(db, 'pastas'));
      const lista: any[] = [];
      snap.forEach((d) => lista.push({ id: d.id, ...d.data() }));
      setPastas(lista);
    } catch (error) {
      console.error('Erro ao listar:', error);
      Alert.alert('Erro', 'Não foi possível carregar as pastas');
    }
  };

  const salvarPasta = async () => {
    if (!nomePasta.trim()) {
      Alert.alert('Atenção', 'Digite o nome da pasta');
      return;
    }
    try {
      if (editandoId) {
        await updateDoc(doc(db, 'pastas', editandoId), {
          nome: nomePasta.trim(),
        });
      } else {
        await addDoc(collection(db, 'pastas'), { nome: nomePasta.trim() });
      }
      setNomePasta('');
      setEditandoId(null);
      listarPastas();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível salvar a pasta');
    }
  };

 const excluirPasta = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'pastas', id));
      listarPastas();
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

  useEffect(() => {
    listarPastas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Salve seusfavoritos aqui!</Text>

      <View style={styles.pastasBox}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma nova pasta"
          placeholderTextColor="#999"
          value={nomePasta}
          onChangeText={setNomePasta}
        />

        <TouchableOpacity style={styles.salvarButton} onPress={salvarPasta}>
          <Text style={styles.backButtonText}>
            {editandoId ? 'Atualizar Pasta' : 'Salvar Pasta'}
          </Text>
        </TouchableOpacity>

        <FlatList
          data={pastas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.nomePasta}>📁 {item.nome}</Text>
              <TouchableOpacity
                onPress={() => {
                  setNomePasta(item.nome);
                  setEditandoId(item.id);
                }}
              >
                <Text style={styles.editar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => excluirPasta(item.id, item.nome)}
              >
                <Text style={styles.excluir}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.vazio}>Nenhuma pasta criada ainda.</Text>
          }
        />
      </View>

      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },

  text: {
    color: '#fff',
    fontSize: 18,
  },

  backButton: {
    backgroundColor: '#ff3333ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
  },

  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  pastasBox: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },

  salvarButton: {
    backgroundColor: '#ff3333ff',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 15,
  },

  item: {
    backgroundColor: '#1a1a1a',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  nomePasta: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },

  editar: {
    color: '#4da3ff',
    fontWeight: 'bold',
  },

  excluir: {
    color: '#ff3333',
    fontWeight: 'bold',
  },
  
  vazio: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});