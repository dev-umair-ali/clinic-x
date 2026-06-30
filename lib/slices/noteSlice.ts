import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { 
  noteService, 
  type CreateNoteRequest, 
  type UpdateNoteRequest, 
  type NoteQueryParams,
  type Note 
} from "../api/services/noteService";

export interface NoteState {
  notes: Note[];
  note: Note | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  } | null;
  loading: boolean;
  uploading: boolean;
  transcribing: boolean;
  error: string | null;
}

const initialState: NoteState = {
  notes: [],
  note: null,
  pagination: null,
  loading: false,
  uploading: false,
  transcribing: false,
  error: null,
};

// Async thunks for API operations

// Fetch all notes by role
export const fetchAllNotes = createAsyncThunk(
  'notes/fetchAll',
  async ({ role, params }: { role: string; params?: any }, { rejectWithValue }) => {
    try {
      const response = await noteService.getAllNotesByRole(role ,params);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch notes';
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch notes by appointment ID
export const fetchAppointmentNotes = createAsyncThunk(
  'notes/fetchByAppointment',
  async (appointmentId: string, { rejectWithValue }) => {
    try {
      const response = await noteService.getAppointmentNotes(appointmentId);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch appointment notes';
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch a specific note
export const fetchNote = createAsyncThunk(
  'notes/fetchOne',
  async (noteId: string, { rejectWithValue }) => {
    try {
      const response = await noteService.getNote(noteId);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch note';
      return rejectWithValue(errorMessage);
    }
  }
);

// Create a new note
export const createNote = createAsyncThunk(
  'notes/create',
  async (noteData: CreateNoteRequest, { rejectWithValue }) => {
    try {
      const response = await noteService.createNote(noteData);
      return response.data;
    } catch (error: any) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const firstError = Object.values(validationErrors)[0];
        return rejectWithValue(Array.isArray(firstError) ? firstError[0] : 'Validation error');
      }
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      return rejectWithValue(errorMessage || 'Failed to create note');
    }
  }
);

// Update a note
export const updateNote = createAsyncThunk(
  'notes/update',
  async ({ noteId, noteData }: { noteId: string; noteData: UpdateNoteRequest }, { rejectWithValue }) => {
    try {
      const response = await noteService.updateNote(noteId, noteData);
      return response.data;
    } catch (error: any) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const firstError = Object.values(validationErrors)[0];
        return rejectWithValue(Array.isArray(firstError) ? firstError[0] : 'Validation error');
      }
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      return rejectWithValue(errorMessage || 'Failed to update note');
    }
  }
);

// Delete a note
export const deleteNote = createAsyncThunk(
  'notes/delete',
  async (noteId: string, { rejectWithValue, dispatch }) => {
    try {
      await noteService.deleteNote(noteId);
      return noteId;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      return rejectWithValue(errorMessage || 'Failed to delete note');
    }
  }
);

// Upload audio file
export const uploadAudioFile = createAsyncThunk(
  'notes/uploadAudio',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await noteService.uploadAudioFile(formData);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      return rejectWithValue(errorMessage || 'Failed to upload audio file');
    }
  }
);

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
    },
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.unshift(action.payload);
    },
    updateNoteLocal: (state, action: PayloadAction<Note>) => {
      const index = state.notes.findIndex((note) => note._id === action.payload._id);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
    },
    deleteNoteLocal: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note._id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearNote: (state) => {
      state.note = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all notes
    builder
      .addCase(fetchAllNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload.notes;
        state.pagination = action.payload.pagination || null;
        state.error = null;
      })
      .addCase(fetchAllNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch appointment notes
    builder
      .addCase(fetchAppointmentNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload.notes;
        state.pagination = action.payload.pagination || null;
        state.error = null;
      })
      .addCase(fetchAppointmentNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch a specific note
    builder
      .addCase(fetchNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNote.fulfilled, (state, action) => {
        state.loading = false;
        state.note = action.payload;
        state.error = null;
      })
      .addCase(fetchNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create note
    builder
      .addCase(createNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.unshift(action.payload);
        state.error = null;
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update note
    builder
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notes.findIndex((n) => n._id === action.payload._id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
        if (state.note && state.note._id === action.payload._id) {
          state.note = action.payload;
        }
        state.error = null;
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete note
    builder
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = state.notes.filter((note) => note._id !== action.payload);
        if (state.note && state.note._id === action.payload) {
          state.note = null;
        }
        state.error = null;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Upload audio file
    builder
      .addCase(uploadAudioFile.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadAudioFile.fulfilled, (state) => {
        state.uploading = false;
        state.error = null;
      })
      .addCase(uploadAudioFile.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setNotes,
  addNote,
  updateNoteLocal,
  deleteNoteLocal,
  setLoading,
  clearError,
  clearNote,
} = noteSlice.actions;

export default noteSlice.reducer;
