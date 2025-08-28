package project.learn.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.learn.Entity.Subject;
import project.learn.Entity.Topic;
import project.learn.Service.FileStorageService;
import project.learn.Service.TopicService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class TopicController {

    @Autowired
    private TopicService topicService;

    private final ObjectMapper objectMapper;

    private final FileStorageService fileStorageService;



    @PostMapping("/add-topic")
    public Topic addTopic(@RequestBody Topic topic) {
        return topicService.saveTopic(topic);
    }
    @PostMapping(value = "/add-topic-with-file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Topic addTopicWithFile(
            @RequestParam("topic") String topicJson,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            System.out.println("Received JSON: " + topicJson); 

            Topic topic = objectMapper.readValue(topicJson, Topic.class);

           
            System.out.println("Topic name: " + topic.getName_Topic());
            System.out.println("Subject: " + topic.getSubject());
            if (topic.getSubject() != null) {
                System.out.println("Subject ID: " + topic.getSubject().getIdSubject());
            } else {
                System.out.println("Subject is null!");
            }

            return topicService.saveTopicWithFile(topic, file);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process topic with file", e);
        }
    }
    @GetMapping("/getAllTopics")
    public List<Topic> getAllTopics() {
        return topicService.findAllTopics();
    }

    @DeleteMapping("/Delete-topic")
    public void deleteTopic(@RequestBody Topic topic) {
        topicService.deleteTopic(topic);
    }

    @GetMapping("/get-topic/{idTopic}")
    public Topic getTopicById(@PathVariable("idTopic") int idTopic) {
        return topicService.findTopicById(idTopic);
    }

    @GetMapping("/download/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {

            Resource resource = fileStorageService.loadFileAsResource(filename);

            String contentType = "application/octet-stream";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (Exception e) {
            throw new RuntimeException("Could not download the file: " + filename, e);
        }
    }
    @GetMapping("/view/{filename:.+}")
    public ResponseEntity<Resource> viewFile(@PathVariable String filename) {
        try {
            Resource resource = fileStorageService.loadFileAsResource(filename);

            String contentType = getContentType(filename);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (Exception e) {
            throw new RuntimeException("Could not view the file: " + filename, e);
        }
    }

    private String getContentType(String filename) {
        if (filename.toLowerCase().endsWith(".pdf")) {
            return "application/pdf";
        } else if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filename.toLowerCase().endsWith(".png")) {
            return "image/png";
        } else if (filename.toLowerCase().endsWith(".txt")) {
            return "text/plain";
        } else if (filename.toLowerCase().endsWith(".html")) {
            return "text/html";
        }
        return "application/octet-stream";
    }
}


