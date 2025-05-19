package ru.a.project.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @ManyToMany
    @JoinTable(
        name = "user_room",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "room_id")
    )
    private List<Room> rooms = new ArrayList<>();

    @OneToMany(mappedBy = "admin")
    private List<Room> adminRooms = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<File> files = new ArrayList<>();

    public void addRoom(Room room) {
        if (rooms == null) {
            rooms = new ArrayList<>();
        }
        rooms.add(room);
    }

    public void removeRoom(Room room) {
        if (rooms != null) {
            rooms.remove(room);
        }
    }

    public void addAdminRoom(Room room) {
        if (adminRooms == null) {
            adminRooms = new ArrayList<>();
        }
        adminRooms.add(room);
    }

    public void removeAdminRoom(Room room) {
        if (adminRooms != null) {
            adminRooms.remove(room);
        }
    }

    public void addFile(File file) {
        if (files == null) {
            files = new ArrayList<>();
        }
        files.add(file);
    }

    public void removeFile(File file) {
        if (files != null) {
            files.remove(file);
        }
    }
}
