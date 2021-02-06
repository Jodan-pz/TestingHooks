// import * as React from 'react';
import { useCallback } from "react"
import { DataPolicy, DefaultDataPolicy } from "../../context/dataContext"
import { useStateManager } from "../../useStateManager"


// --------------------------------------------------------------------------------------------------
// sample data
// --------------------------------------------------------------------------------------------------
type Book = {
    id: number,
    title: string,
    year: number
}

const Books: Array<Book> = [{ id: 1, title: 'prova', year: 2010 }, { id: 2, title: 'ceppa', year: 2021 }, { id: 3, title: 'gungu', year: 2012 }]

const getBookByIdPromise = (id: number) => new Promise<Book | undefined>((res, rej) => setTimeout(() => {
    if ((Math.floor(Math.random() * 10) + 1) % 2 !== 0) rej(new Error('Miiii!'))
    else res(Books.find(b => b.id === id))
}, (Math.floor(Math.random() * 2) + 1) * 1000))

const getBooksPromise = () => new Promise<Book[]>(res => setTimeout(() => {
    res(Books)
}, (Math.floor(Math.random() * 10) + 1) * 1000))

export const useBookDataLayer = (dataPolicy: DataPolicy) => {
    const _book = useStateManager('book', dataPolicy, getBookByIdPromise)
    const _books = useStateManager('books', dataPolicy, getBooksPromise)
    return (
        {
            book: _book.retrieve(),
            books: _books.retrieve(),
            fetchBooks: useCallback(_books.fetch, []),
            fetchBookById: useCallback(_book.fetch, [])
        }
    )
}