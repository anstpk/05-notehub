import React from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import css from './App.module.css';

const App = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Дебаунс для пошуку (вимоги курсу)
  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); // Скидаємо на першу сторінку при новому пошуку
  }, 300);

  // Отримання даних через TanStack Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes(page, 12, search),
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={(e) => handleSearch(e.target.value)} />
        
        {/* Пагінація рендериться, тільки якщо сторінок більше 1 */}
        {data && data.totalPages > 1 && (
          <Pagination 
            pageCount={data.totalPages} 
            currentPage={page} 
            onPageChange={(data) => setPage(data.selected + 1)} 
          />
        )}
        
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main>
        {isLoading && <p>Loading notes...</p>}
        {isError && <p>Error loading notes. Please try again later.</p>}
        
        {/* NoteList тепер не приймає onDelete, він сам керує видаленням */}
        {data && data.notes.length > 0 && (
          <NoteList notes={data.notes} />
        )}

        {data && data.notes.length === 0 && !isLoading && (
          <p>No notes found.</p>
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default App;