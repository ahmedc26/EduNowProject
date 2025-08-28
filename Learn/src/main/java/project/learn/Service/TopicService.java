package project.learn.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.learn.Entity.Subject;
import project.learn.Entity.Topic;
import project.learn.Repository.SubjectRepo;
import project.learn.Repository.TopicRepo;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@Service
public class TopicService {

    @Autowired
    private TopicRepo topicRepo;
    @Autowired
    private SubjectRepo subjectRepo;
    @Autowired
    private FileStorageService fileStorageService;

    public Topic saveTopic(Topic topic) {
        return topicRepo.save(topic);
    }

    public Topic saveTopicWithFile(Topic topic, MultipartFile file) {
        try {
            // Ensure the subject exists and is properly associated
            if (topic.getSubject() != null && topic.getSubject().getIdSubject() != 0) {
                Subject subject = subjectRepo.findById(topic.getSubject().getIdSubject())
                        .orElseThrow(() -> new RuntimeException("Subject not found with id: " + topic.getSubject().getIdSubject()));
                topic.setSubject(subject);
            } else {
                throw new RuntimeException("Subject ID is required");
            }

            if (file != null && !file.isEmpty()) {
                String storedFilename = fileStorageService.storeFile(file);
                topic.setFileName(file.getOriginalFilename());
                topic.setFileType(file.getContentType());
                topic.setFilePath(storedFilename);
            }
            return topicRepo.save(topic);
        } catch (Exception e) {
            // Clean up file if saving fails
            if (topic.getFilePath() != null) {
                fileStorageService.deleteFile(topic.getFilePath());
            }
            throw new RuntimeException("Failed to save topic with file", e);
        }
    }



    public void deleteTopic(Topic topic) {
        if (topic.getFilePath() != null) {
            fileStorageService.deleteFile(topic.getFilePath());
        }
        topicRepo.delete(topic);
    }
    public Topic findTopicById(long id) {
        topicRepo.findById(id).orElseThrow(() -> new RuntimeException("Topic not found with id: " + id));
        return topicRepo.findById(id).get();
    }
    public List<Topic> findAllTopics() {
        return topicRepo.findAll();
    }
    public Topic EditTopic(Topic topic) {
        return topicRepo.save(topic);
    }

}
