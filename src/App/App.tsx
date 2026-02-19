import React from 'react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes, deleteNote } from '../services/noteService';
import NoteList from '../components/NoteList/NoteList';
import SearchBox from '../components/SearchBox/SearchBox';
import Pagination from '../components/Pagination/Pagination';
import Modal from '../components/Modal/Modal';
import NoteForm from '../components/NoteForm/NoteForm';
import css from './App.module.css';

const App = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Дебаунс для пошуку
  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); // Скидаємо на першу сторінку при пошуку
  }, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes(page, 12, search),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={(e) => handleSearch(e.target.value)} />
        {data && data.totalPages > 1 && (
          <Pagination 
            pageCount={data.totalPages} 
            onPageChange={(selected) => setPage(selected + 1)} 
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main>
        {isLoading && <p>Loading...</p>}
        {data && data.notes.length > 0 && (
          <NoteList notes={data.notes} onDelete={(id) => deleteMutation.mutate(id)} />
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