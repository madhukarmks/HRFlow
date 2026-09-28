package com.hrflow.entity;
import jakarta.persistence.*;import lombok.*;
@Entity @Getter @Setter @NoArgsConstructor @Table(name="departments") public class Department { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id; @Column(nullable=false,unique=true) String name; String description; boolean active=true; Long headEmployeeId; }
