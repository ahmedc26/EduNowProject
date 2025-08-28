package project.learn.Entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
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
@Table(name = "Subject")
@EntityListeners(AuditingEntityListener.class)
public class Subject {

    public String getName_Subject() {
        return name_Subject;
    }

    public void setName_Subject(String name_Subject) {
        this.name_Subject = name_Subject;
    }

    public long getIdSubject() {
        return idSubject;
    }

    public void setIdSubject(long idSubject) {
        this.idSubject = idSubject;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id_subject")
    private long idSubject;
    private String name_Subject;


    @ManyToOne
    @JoinColumn(name = "idLevel")
    private Level level;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Topic> topics;

}
