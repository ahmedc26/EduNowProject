package project.learn.Entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@DynamicUpdate
@EntityListeners(AuditingEntityListener.class)
@Table(name = "Level")
public class Level {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idLevel;
    private String name_Level;
    @Enumerated(EnumType.STRING)
    @Column(name = "level_type")
    private LevelType level_Type;


    @OneToMany(mappedBy = "level", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("level")
    private List<Subject> subjects;


}
