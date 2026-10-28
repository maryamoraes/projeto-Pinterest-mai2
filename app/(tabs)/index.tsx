import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState<any>(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function buscarCep() {
    setErro('');
    setEndereco(null);

    if (cep.length !== 8) {
      setErro('Digite um CEP com 8 números.');
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

      const dados = await resposta.json();

      if (dados.erro) {
        setErro('CEP não encontrado.');
        return;
      }

      setEndereco(dados);
    } catch (e) {
      setErro('Não foi possível consultar o CEP.');
    } finally {
      setCarregando(false);
    }
  }

  async function descobrirLocalizacao() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        alert('Permissão de localização negada!');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    } catch (e) {
      alert('Não foi possível obter a localização.');
    }
  }

  function abrirDetalhes() {
    router.push({
      pathname: '/detalhes',
      params: {
        titulo: 'Quadro Encantado',
        descricao: 'Uma pintura colorida com elementos de conto de fadas',
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Pressable style={styles.topButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Pressable style={styles.topButton} onPress={descobrirLocalizacao}>
          <Ionicons name="location" size={24} color="#fff" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Imagem */}
        <View style={styles.imageCard}>
          <Image
            source={require('../../assets/images/quadro.jpg')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Divisor */}
        <View style={styles.divider} />

        <Text style={styles.shareTitle}>...</Text>

        {/* Botão ver detalhes */}
        <Pressable onPress={abrirDetalhes} style={styles.detalhesButton}>
          <Text style={styles.detalhesButtonText}>Ver detalhes</Text>
        </Pressable>

        {/* Botão ver no mapa (só aparece com localização) */}
        {latitude !== null && longitude !== null && (
          <Pressable
            style={styles.detalhesButton}
            onPress={() =>
              Linking.openURL(
                `https://www.google.com/maps?q=${latitude},${longitude}`,
              )
            }
          >
            <Text style={styles.detalhesButtonText}>Ver no mapa</Text>
          </Pressable>
        )}

        {/* Busca de CEP */}
        <TextInput
          style={styles.input}
          placeholder="Ex: 93510000"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={cep}
          onChangeText={setCep}
          maxLength={8}
        />

        <Pressable
          style={[styles.detalhesButton, carregando && { opacity: 0.6 }]}
          onPress={buscarCep}
          disabled={carregando}
        >
          <Text style={styles.detalhesButtonText}>
            {carregando ? 'Buscando...' : 'Buscar CEP'}
          </Text>
        </Pressable>

        {erro !== '' && <Text style={styles.erroTexto}> X {erro}</Text>}

        {endereco && (
          <View style={styles.enderecoCard}>
            <Text style={styles.enderecoTitulo}> Endereço encontrado</Text>

            <Text style={styles.enderecoTexto}>CEP: {endereco.cep}</Text>
            <Text style={styles.enderecoTexto}>Rua: {endereco.logradouro}</Text>
            <Text style={styles.enderecoTexto}>Bairro: {endereco.bairro}</Text>
            <Text style={styles.enderecoTexto}>Cidade: {endereco.localidade}</Text>
            <Text style={styles.enderecoTexto}>Estado: {endereco.uf}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    zIndex: 10,
  },
  topButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  imageCard: {
    width: 280,
    aspectRatio: 1,
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 10,
    position: 'relative',
    backgroundColor: '#111',
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#555',
  },
  activeDot: {
    backgroundColor: '#fff',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#222',
    marginVertical: 20,
  },
  shareTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 20,
  },
  detalhesButton: {
    backgroundColor: '#ff3333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 10,
  },
  detalhesButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    marginBottom: 10,
  },
  erroTexto: {
    color: '#ff6666',
    fontSize: 16,
    marginTop: 10,
  },
  enderecoCard: {
    width: '90%',
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
  },
  enderecoTitulo: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  enderecoTexto: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 4,
  },
});