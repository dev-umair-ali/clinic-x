import api from '../axios';

export interface CreateNoteRequest {
    title: string;
    patientId: string;
    appointmentId?: string;
    audioFileUrl?: string;
    transcription?: string;
    summary?: string;
    status: "transcribed" | "pending";
    fileSize?: string;
    duration?: string;
}

export interface UpdateNoteRequest {
    title?: string;
    patientId?: string;
    appointmentId?: string;
    audioFileUrl?: string;
    transcription?: string;
    summary?: string;
    status?: "transcribed" | "pending";
    fileSize?: string;
    duration?: string;
}

export interface Note {
    _id: string;
    title: string;
    rawText: string;
    audioTranscriptUrl: string;
    patientRef: string | {
        _id: string;
        firstName: string;
        lastName: string;
        [key: string]: any;
    };
    appointmentRef?: string | {
        _id: string;
        service: string;
        date: string;
        [key: string]: any;
    };
    appointmentId?: string;
    audioFileUrl?: string;
    transcription?: string;
    summary?: string;
    status: "transcribed" | "pending";
    fileSize?: string;
    duration?: string;
    doctorRef?: string | {
        _id: string;
        firstName: string;
        lastName: string;
        [key: string]: any;
    };
    doctorId?: string;
    clinicRef?: string | {
        _id: string;
        name: string;
        [key: string]: any;
    };
    clinicId?: string;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface NoteResponse {
    success: boolean;
    data: Note;
    message?: string;
}

export interface NotesListResponse {
    success: boolean;
    notes: Note[];
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
    message?: string;
}

export interface NoteQueryParams {
    search?: string;
    status?: "transcribed" | "pending";
    patientId?: string;
    appointmentId?: string;
    page?: number;
    limit?: number;
}

export const noteService = {
    // Create a new note
    async createNote(noteData: CreateNoteRequest): Promise<NoteResponse> {
        const response = await api.post<NoteResponse>('/doctor/notes/create', noteData);
        return response.data;
    },

    // Get all notes by role (doctor)
    async getAllNotesByRole(role: string, params?: any): Promise<NotesListResponse> {
        const queryParams = new URLSearchParams();
        if (params?.doctorId) queryParams.append('doctorRef', params.doctorId);
        if (params?.clinicId) queryParams.append('clinicRef', params.clinicId);
        if (params?.patientId) queryParams.append('patientId', params.patientId);
        if (params?.appointmentId) queryParams.append('appointmentId', params.appointmentId);

        const queryString = queryParams.toString();
        const url = queryString
            ? `/${role}/notes/all?${queryString}`
            : `/${role}/notes/all`;

        const response = await api.get<NotesListResponse>(url);
        return response.data;
    },

    // Get notes by appointment ID
    async getAppointmentNotes(appointmentId: string): Promise<NotesListResponse> {
        const response = await api.get<NotesListResponse>(`/doctor/notes/appointment/${appointmentId}`);
        return response.data;
    },

    // Get a specific note by ID
    async getNote(noteId: string): Promise<NoteResponse> {
        const response = await api.get<NoteResponse>(`/doctor/notes/${noteId}`);
        return response.data;
    },

    // Update a note
    async updateNote(noteId: string, noteData: UpdateNoteRequest): Promise<NoteResponse> {
        const response = await api.put<NoteResponse>(`/doctor/notes/update/${noteId}`, noteData);
        return response.data;
    },

    // Delete a note
    async deleteNote(noteId: string): Promise<{ success: boolean; message?: string }> {
        const response = await api.delete<{ success: boolean; message?: string }>(`/doctor/notes/delete/${noteId}`);
        return response.data;
    },

    // Upload audio file
    async uploadAudioFile(formData: FormData): Promise<{ success: boolean; audioUrl: string; fileSize: string; duration?: string }> {
        const response = await api.post<{ success: boolean; audioUrl: string; fileSize: string; duration?: string }>(
            '/doctor/notes/upload-audio',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    // Transcribe audio
    async transcribeAudio(noteId: string): Promise<NoteResponse> {
        const response = await api.post<NoteResponse>(`/doctor/notes/transcribe/${noteId}`);
        return response.data;
    },
};
