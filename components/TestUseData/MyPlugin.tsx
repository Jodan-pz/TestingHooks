import * as React from 'react';
import { Button, SafeAreaView, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useWindow, WindowProps } from '../../hooks/useWindow';
import { View, Text } from '../Themed';
import { useData } from '../../hooks/useData';

const pluginStyle = (window?: WindowProps) => StyleSheet.create(({
  text: {
    textAlign: window?.orientation === 'landscape' ? 'center' : 'right'
  }
}))
export const MyPlugin = () => {
  const { book, books, fetchBooks, fetchBookById } = useData('books')
  const window = useWindow()
  const style = pluginStyle(window);

  React.useEffect(() => { fetchBookById(3); fetchBooks() }, [fetchBookById, fetchBooks])

  console.log('rendering  MyPlugin...')

  return (
    <SafeAreaView>
      <ScrollView>
        <Text style={style.text}>[MyPugin]</Text>
        <Text >Book</Text><Button title="Fetch another book!" onPress={() => fetchBookById(1)} />
        <Text >{JSON.stringify(book, null, 2)}</Text>

        <Text >Books</Text>
        <Text>{JSON.stringify(books, null, 2)}</Text>

        <AltroCompo />
      </ScrollView>
    </SafeAreaView>
  )
}

const AltroCompo = () => {
  const { book, fetchBookById } = useData('books')
  React.useEffect(() => { fetchBookById(2) }, [fetchBookById])

  console.log('rendering  Altro Compo...')
  return (
    <View>
      <Text style={{ textAlign: 'center' }} >Altro Compo</Text>
      <Text >Book</Text><Button title="Fetch another book!" onPress={() => fetchBookById(3)} />
      <Text>{JSON.stringify(book, null, 2)}</Text>
    </View>
  )
}