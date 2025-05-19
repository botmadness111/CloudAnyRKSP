package ru.a.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.a.project.model.Room;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Room r JOIN r.users u WHERE r.id = ?1 AND u.id = ?2")
    boolean existsRoomByRoomIdAndUserId(Long roomId, Long userId);

    @Query("SELECT r FROM Room r JOIN r.users u WHERE u.id = ?1")
    List<Room> findRoomsByUserId(Long userId);

    @Query("SELECT r FROM Room r WHERE r.admin.id = ?1")
    List<Room> findRoomsByAdminId(Long adminId);
}