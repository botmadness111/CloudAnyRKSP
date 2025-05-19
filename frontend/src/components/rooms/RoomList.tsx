import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Button, 
    Card, 
    CardContent, 
    Typography, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { roomService } from '../../services/api';
import { Room } from '../../types';
import AddIcon from '@mui/icons-material/Add';

export const RoomList: React.FC = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            const data = await roomService.getRooms();
            setRooms(data);
        } catch (err) {
            console.error('Ошибка при загрузке комнат:', err);
        }
    };

    const handleCreateRoom = async () => {
        if (!newRoomName.trim()) {
            setError('Название комнаты не может быть пустым');
            return;
        }

        try {
            await roomService.createRoom({ name: newRoomName });
            setOpenDialog(false);
            setNewRoomName('');
            setError('');
            loadRooms();
        } catch (err) {
            setError('Ошибка при создании комнаты');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Мои комнаты</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                >
                    Создать комнату
                </Button>
            </Box>

            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)'
                },
                gap: 3
            }}>
                {rooms.map((room) => (
                    <Card 
                        key={room.id}
                        sx={{ 
                            height: '100%',
                            cursor: 'pointer',
                            '&:hover': {
                                boxShadow: 6
                            }
                        }}
                        onClick={() => navigate(`/room/${room.id}`)}
                    >
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {room.name}
                            </Typography>
                            <Typography color="textSecondary">
                                Администратор: {room.admin.name}
                            </Typography>
                            <Typography color="textSecondary">
                                Пользователей: {room.users.length}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Создать новую комнату</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Название комнаты"
                        fullWidth
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        error={!!error}
                        helperText={error}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
                    <Button onClick={handleCreateRoom} variant="contained">
                        Создать
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}; 