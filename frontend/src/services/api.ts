import axios from 'axios';
import { LoginRequest, RegisterRequest, CreateRoomRequest, AddUserRequest, Room, File, User } from '../types';

const API_URL = 'http://localhost:8081/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Добавляем перехватчик для установки токена
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    async login(data: LoginRequest): Promise<void> {
        try {
            console.log('Отправка запроса на вход:', {
                url: `${API_URL}/auth/login`,
                data: { ...data, password: '***' } // скрываем пароль в логах
            });
            
            const response = await api.post('/auth/login', {
                username: data.username,
                password: data.password
            });
            
            console.log('Ответ сервера:', {
                status: response.status,
                headers: response.headers,
                data: response.data
            });

            const { token } = response.data;
            if (!token) {
                throw new Error('Токен не получен от сервера');
            }
            
            localStorage.setItem('token', token);
            console.log('Токен успешно сохранен');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Ошибка при входе:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    message: error.message,
                    config: {
                        url: error.config?.url,
                        method: error.config?.method,
                        headers: error.config?.headers
                    }
                });
            } else {
                console.error('Неизвестная ошибка при входе:', error);
            }
            throw error;
        }
    },

    async register(data: RegisterRequest): Promise<void> {
        try {
            const response = await api.post('/auth/register', data);
            console.log('Успешная регистрация:', response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Ошибка при регистрации:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
            }
            throw error;
        }
    },

    logout(): void {
        localStorage.removeItem('token');
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }
};

export const roomService = {
    async getRooms(): Promise<Room[]> {
        const response = await api.get('/rooms');
        return response.data;
    },

    async createRoom(data: { name: string }): Promise<Room> {
        const response = await api.post('/rooms', data);
        return response.data;
    },

    async getRoomUsers(roomId: number): Promise<User[]> {
        const response = await api.get(`/rooms/${roomId}/users`);
        return response.data;
    },

    async addUser(data: { username: string; roomId: number }): Promise<void> {
        await api.post(`/rooms/${data.roomId}/users`, { username: data.username });
    },

    async removeUser(userId: number, roomId: number): Promise<void> {
        await api.delete(`/rooms/${roomId}/users/${userId}`);
    },

    async getRoomFiles(roomId: number): Promise<File[]> {
        const response = await api.get(`/rooms/${roomId}/files`);
        return response.data;
    },

    async uploadFile(file: globalThis.File, roomId: number): Promise<void> {
        const formData = new FormData();
        formData.append('file', file);
        await api.post(`/rooms/${roomId}/files`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    async downloadFile(fileId: number): Promise<Blob> {
        const response = await api.get(`/files/${fileId}/download`, {
            responseType: 'blob'
        });
        return response.data;
    }
}; 