import * as React from 'react';
import { Button, SafeAreaView, ScrollView, useWindowDimensions } from 'react-native';
import { View, Text } from '../Themed';
import { useData } from '../../hooks/useData';

export const MyPluginContext = () => {
  const { book, books, fetchBooks, fetchBookById } = useData('books', { scope: 'plugin' })
  const window = useWindowDimensions();

  React.useEffect(() => { fetchBookById(3); fetchBooks() }, [fetchBookById, fetchBooks])

  console.log('rendering  MyPluginContext...')

  return (
    <SafeAreaView>
      <ScrollView>
        <Text>{JSON.stringify(window, null, 2)}</Text>
        <Text style={{ textAlign: 'center' }} >[MyPuginContext]</Text>
        <Text >Book</Text><Button title="Fetch another book!" onPress={() => fetchBookById(1)} />
        <Text>{JSON.stringify(book, null, 2)}</Text>
        {!book?.error && book?.value && <Text>Year: {book.value.year}</Text>}

        <Text >Books</Text>
        <Text>{JSON.stringify(books, null, 2)}</Text>

        <AltroCompo />
      </ScrollView>
    </SafeAreaView>
  )
}

const AltroCompo = () => {
  const { book } = useData('books',{ scope: 'plugin' })

  console.log('rendering  Altro Compo...')
  return (
    <View>
      <Text style={{ textAlign: 'center' }} >Altro Compo</Text>
      <Text >Book</Text>
      <Text>{JSON.stringify(book, null, 2)}</Text>
    </View>
  )
}