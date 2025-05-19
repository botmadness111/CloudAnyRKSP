package ru.a.project.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.a.project.model.File;
import ru.a.project.repository.FileRepository;

import java.util.Optional;

@Transactional(readOnly = true)
@Service
public class FileService {
    private final FileRepository fileRepository;

    @Autowired
    public FileService(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    public File findById(Long id) {
        return fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + id));
    }

    @Transactional
    public File save(File file) {
        return fileRepository.save(file);
    }

    public int isExist(String name, Long roomId) {
        return fileRepository.countByNameAndRoomId(name, roomId);
    }

    public int countAllByName(String name, String type, Long roomId) {
        return fileRepository.countByNameContainingAndFileTypeTypeAndRoomId(name, type, roomId);
    }
}
