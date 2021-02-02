import * as React from 'react';
import { Button, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { createStyleBuilder, useStyles } from '../../hooks/useStyles';
import { View, Text } from '../Themed';

import { useBookData } from './useBookData';

const myBuilder = createStyleBuilder(opts => ({
  text: {
    textAlign: (opts.orientation === 'landscape') ? 'center' : 'left'
  }
}))

export const MyPlugin = () => {
  const { book, books, fetchBooks, fetchBookById } = useBookData()
  const { style } = useStyles(myBuilder)

  React.useEffect(() => { fetchBookById(3); fetchBooks() }, [fetchBookById, fetchBooks])

  console.log('rendering  MyPlugin...')

  return (
    <SafeAreaView>
      <ScrollView>
        <Text style={style.text} >[MyPugin]</Text>
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
  const { book, fetchBookById } = useBookData()
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