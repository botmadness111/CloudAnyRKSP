import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Link,
    Paper,
    Container
} from '@mui/material';
import { authService } from '../../services/api';
import axios from 'axios';

export const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.username.trim()) {
            setError('Введите имя пользователя');
            return;
        }

        if (!formData.password.trim()) {
            setError('Введите пароль');
            return;
        }

        try {
            await authService.login(formData);
            navigate('/rooms');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errorData = err.response?.data;
                if (errorData?.detail) {
                    setError(errorData.detail);
                } else if (err.response?.status === 401) {
                    setError('Неверное имя пользователя или пароль');
                } else if (err.response?.status === 0) {
                    setError('Не удалось подключиться к серверу. Проверьте подключение к интернету');
                } else {
                    setError('Ошибка при входе. Попробуйте позже');
                }
            } else {
                setError('Неизвестная ошибка при входе');
            }
            console.error('Ошибка при входе:', err);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Вход в систему
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Имя пользователя"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={formData.username}
                            onChange={handleChange}
                            error={!!error}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Пароль"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!error}
                            helperText={error}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Войти
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Link component={RouterLink} to="/register" variant="body2">
                                Нет аккаунта? Зарегистрироваться
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}; 