package com.hrflow.entity;
import jakarta.persistence.*;import lombok.*;import java.time.*;
@Entity @Table(name="users",indexes=@Index(name="idx_user_email",columnList="email")) @Getter @Setter @NoArgsConstructor
public class User { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id; @Column(nullable=false,unique=true) String email; @Column(nullable=false) String passwordHash; @Enumerated(EnumType.STRING) @Column(nullable=false) Role role; @Column(nullable=false) boolean enabled=true; Instant createdAt=Instant.now(); }
