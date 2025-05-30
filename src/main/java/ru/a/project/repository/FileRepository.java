package ru.a.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.a.project.model.File;

import static javax.swing.text.html.HTML.Tag.SELECT;
import static org.hibernate.grammars.hql.HqlParser.FROM;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {

    @Query(value = "SELECT COUNT(*) FROM file WHERE name LIKE CONCAT(?1, '(%).', ?2) AND room_id=?3", nativeQuery = true)
    Integer countAllByNameAndTypeAndRoomId(String name, String type, Long room_id);

    @Query(value = "SELECT COUNT(*) FROM file WHERE name = ?1 AND room_id =?2 limit 1", nativeQuery = true)
    Integer isExist(String fullName, Long room_id);

    int countByNameAndRoomId(String name, Long roomId);
    int countByNameContainingAndFileTypeTypeAndRoomId(String name, String type, Long roomId);
}
