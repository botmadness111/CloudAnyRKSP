import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Paper
} from '@mui/material';
import { roomService } from '../../services/api';
import { Room, User, File } from '../../types';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`room-tabpanel-${index}`}
            aria-labelledby={`room-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export const RoomPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [room, setRoom] = useState<Room | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [users, setUsers] = useState<User[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [openAddUser, setOpenAddUser] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const loadRoomData = React.useCallback(async () => {
        if (!id) return;
        
        try {
            const [roomData, usersData, filesData] = await Promise.all([
                roomService.getRooms().then(rooms => rooms.find(r => r.id === Number(id))),
                roomService.getRoomUsers(Number(id)),
                roomService.getRoomFiles(Number(id))
            ]);

            if (roomData) {
                setRoom(roomData);
                setUsers(usersData);
                setFiles(filesData);
            }
        } catch (err) {
            console.error('Ошибка при загрузке данных комнаты:', err);
        }
    }, [id]);

    useEffect(() => {
        loadRoomData();
    }, [loadRoomData]);

    const handleAddUser = async () => {
        if (!newUsername.trim()) {
            setError('Имя пользователя не может быть пустым');
            return;
        }

        try {
            await roomService.addUser({ username: newUsername, roomId: Number(id) });
            setOpenAddUser(false);
            setNewUsername('');
            setError('');
            loadRoomData();
        } catch (err) {
            setError('Ошибка при добавлении пользователя');
        }
    };

    const handleRemoveUser = async (userId: number) => {
        try {
            await roomService.removeUser(userId, Number(id));
            loadRoomData();
        } catch (err) {
            console.error('Ошибка при удалении пользователя:', err);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && id) {
            try {
                await roomService.uploadFile(file, Number(id));
                loadRoomData();
            } catch (err) {
                console.error('Ошибка при загрузке файла:', err);
            }
        }
    };

    const handleFileDownload = async (fileId: number, fileName: string) => {
        try {
            const blob = await roomService.downloadFile(fileId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Ошибка при скачивании файла:', err);
        }
    };

    if (!room) {
        return <Typography>Загрузка...</Typography>;
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h4" sx={{ p: 2 }}>
                    {room.name}
                </Typography>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                    <Tab label="Файлы" />
                    <Tab label="Пользователи" />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <Box sx={{ mb: 2 }}>
                    <input
                        accept="*/*"
                        style={{ display: 'none' }}
                        id="file-upload"
                        type="file"
                        onChange={handleFileUpload}
                    />
                    <label htmlFor="file-upload">
                        <Button
                            variant="contained"
                            component="span"
                            startIcon={<CloudUploadIcon />}
                        >
                            Загрузить файл
                        </Button>
                    </label>
                </Box>

                <List>
                    {files.map((file) => (
                        <Paper key={file.id} sx={{ mb: 1 }}>
                            <ListItem>
                                <ListItemText
                                    primary={file.name}
                                    secondary={`Размер: ${file.size_kb} KB, Загрузок: ${file.downloads}`}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        onClick={() => handleFileDownload(file.id, file.name)}
                                    >
                                        <CloudDownloadIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </Paper>
                    ))}
                </List>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Box sx={{ mb: 2 }}>
                    <Button
                        variant="contained"
                        onClick={() => setOpenAddUser(true)}
                    >
                        Добавить пользователя
                    </Button>
                </Box>

                <List>
                    {users.map((user) => (
                        <Paper key={user.id} sx={{ mb: 1 }}>
                            <ListItem>
                                <ListItemText
                                    primary={user.name}
                                    secondary={user.email}
                                />
                                {room.admin.id !== user.id && (
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleRemoveUser(user.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                )}
                            </ListItem>
                        </Paper>
                    ))}
                </List>
            </TabPanel>

            <Dialog open={openAddUser} onClose={() => setOpenAddUser(false)}>
                <DialogTitle>Добавить пользователя</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Имя пользователя"
                        fullWidth
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        error={!!error}
                        helperText={error}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddUser(false)}>Отмена</Button>
                    <Button onClick={handleAddUser} variant="contained">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}; 