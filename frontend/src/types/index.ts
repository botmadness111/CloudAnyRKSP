export interface User {
    id: number;
    username: string;
    email: string;
    name: string;
}

export interface Room {
    id: number;
    name: string;
    admin: User;
    users: User[];
}

export interface File {
    id: number;
    name: string;
    size_kb: number;
    downloads: number;
    uploaded_by: User;
    uploaded_at: string;
}

export interface FileType {
    id: number;
    name: string;
    type: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    name: string;
}

export interface CreateRoomRequest {
    name: string;
}

export interface AddUserRequest {
    username: string;
    roomId: number;
} 