import axios from 'axios';
import { Note, NoteTag } from '../types/note';

const noteApi = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalNotes: number;
  totalPages: number;
  currentPage: number;
}

export const fetchNotes = async (page = 1, perPage = 12, search = ''): Promise<FetchNotesResponse> => {
  const { data } = await noteApi.get<FetchNotesResponse>('/notes', {
    params: { page, perPage, search },
  });
  return data;
};

export const createNote = async (note: Omit<Note, 'id' | 'createdAt'>): Promise<Note> => {
  const { data } = await noteApi.post<Note>('/notes', note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await noteApi.delete<Note>(`/notes/${id}`);
  return data;
};