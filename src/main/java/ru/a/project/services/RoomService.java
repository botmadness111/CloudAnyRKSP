package ru.a.project.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.a.project.exception.room.UserAlreadyExistsInRoomException;
import ru.a.project.model.FileType;
import ru.a.project.model.Room;
import ru.a.project.model.User;
import ru.a.project.repository.RoomRepository;
import ru.a.project.util.ByteArrayResourceWithFilename;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Transactional(readOnly = true)
@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final FileTypeService fileTypeService;
    private final UserService userService;
    private final FileService fileService;

    @Autowired
    public RoomService(RoomRepository roomRepository, FileTypeService fileTypeService, UserService userService, FileService fileService) {
        this.roomRepository = roomRepository;
        this.fileTypeService = fileTypeService;
        this.userService = userService;
        this.fileService = fileService;
    }

    public Room findById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
    }

    public List<Room> findAll() {
        return roomRepository.findAll();
    }

    @Transactional()
    public Room createRoom(String name, User admin) {

        Room roomCreated = roomRepository.save(new Room(
                null,
                name,
                Collections.emptyList(),
                Collections.emptyList(),
                admin
        ));

        admin.addAdminRoom(roomCreated);
        admin.addRoom(roomCreated);

        roomCreated.setAdmin(admin);
        roomCreated.addUser(admin);

        return roomCreated;
    }

    @Transactional
    public ByteArrayResourceWithFilename downloadFile(Long fileId) throws IOException {
        ru.a.project.model.File file = fileService.findById(fileId);

        Path path = Paths.get(file.getPath() + "/" + file.getName());

        byte[] data = Files.readAllBytes(path);

        ByteArrayResourceWithFilename resource = ByteArrayResourceWithFilename.create(data, file.getName());

        file.setDownloads(file.getDownloads() + 1);
        fileService.save(file);

        return resource;
    }

    @Transactional
    public ru.a.project.model.File uploadFile(MultipartFile multipatFile, Long roomId, Long userId, String description) {
        try (InputStream inputStream = multipatFile.getInputStream()) {

            String currentDirectory = System.getProperty("user.dir");
            File directory = new File(currentDirectory, "storage");

            if (!directory.exists()) {
                directory.mkdir();
            }

            currentDirectory = System.getProperty("user.dir") + "/storage";
            directory = new File(currentDirectory, String.valueOf(roomId));

            if (!directory.exists()) {
                directory.mkdir();
            }


            //занести в бд

            Optional<Room> roomOptional = roomRepository.findById(roomId);

            if (roomOptional.isEmpty()) {
                throw new RuntimeException("не найдена команта с id: " + roomId);
            }

            Room room = roomOptional.get();


            User user = userService.findById(userId);

            System.out.println(Objects.requireNonNull(multipatFile.getOriginalFilename()));
            String[] fileSplit = Objects.requireNonNull(multipatFile.getOriginalFilename()).split("\\.");
            String type = fileSplit[1];
            String nameWithoutType = fileSplit[0];


            FileType fileType = fileTypeService.findFileTypeByType(type);
            String fileName = multipatFile.getOriginalFilename();

            int cntNameStartWithFileName = 0;

            if (fileService.isExist(fileName, roomId) == 1)
                cntNameStartWithFileName = 1;

            int cntTmp = fileService.countAllByName(nameWithoutType, type, roomId);
            if (cntTmp > 0)
                cntNameStartWithFileName = cntTmp + 1;

            if (cntNameStartWithFileName > 0) fileName = nameWithoutType + "(" + cntNameStartWithFileName + ")." + type;

            ru.a.project.model.File file = ru.a.project.model.File.builder()
                    .fileType(fileType)
                    .room(room)
                    .sizeKb((int) multipatFile.getSize())
                    .user(user)
                    .path(directory.getPath())
                    .description(description)
                    .name(fileName)
                    .downloads(0)
                    .build();

            room.addFile(file);
            user.addFile(file);


            FileOutputStream fileOutputStream = new FileOutputStream(directory.getPath() + "/" + fileName);

            fileOutputStream.write(inputStream.readAllBytes());

            fileOutputStream.close();

            return fileService.save(file);
        } catch (IOException e) {
            throw new RuntimeException("не удалось загрузить файл: " + multipatFile.getName());
        }
    }

    public boolean existsRoomByRoomIdAndUserId(Long roomId, Long userId) {
        return roomRepository.existsRoomByRoomIdAndUserId(roomId, userId);
    }

    @Transactional
    public User addUser(String username, Long roomId) {
        User user = userService.findByUsername(username);
        Room room = findById(roomId);

        if (existsRoomByRoomIdAndUserId(roomId, user.getId())) {
            throw new UserAlreadyExistsInRoomException("user с username " + username + " уже добавлен в комнату " + room.getName());
        }

        room.addUser(user);
        user.addRoom(room);

        userService.save(user);
        save(room);

        return user;
    }

    @Transactional
    public User removeUser(Long userId, Long roomId) {
        User user = userService.findById(userId);
        Room room = findById(roomId);

        user.removeRoom(room);
        room.removeUser(user);

        save(room);
        userService.save(user);

        return user;
    }

    public void removeUserFromRoom(Long userId, Long roomId) {
        Room room = findById(roomId);
        User user = userService.findById(userId);
        room.removeUser(user);
        roomRepository.save(room);
    }

    public Room save(Room room) {
        return roomRepository.save(room);
    }

    public void delete(Long id) {
        roomRepository.deleteById(id);
    }

    public void addUserToRoom(Long userId, Long roomId) {
        Room room = findById(roomId);
        User user = userService.findById(userId);
        room.addUser(user);
        roomRepository.save(room);
    }

    public List<Room> findRoomsByUserId(Long userId) {
        return roomRepository.findRoomsByUserId(userId);
    }

    public List<Room> findRoomsByAdminId(Long adminId) {
        return roomRepository.findRoomsByAdminId(adminId);
    }
}
