package project.learn.Service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
@Service
public class FileStorageService {
        private final Path fileStorageLocation;

        public FileStorageService() {
            this.fileStorageLocation = Paths.get("uploads")
                    .toAbsolutePath()
                    .normalize();

            try {
                Files.createDirectories(this.fileStorageLocation);
            } catch (Exception ex) {
                throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
            }
        }

        public String storeFile(MultipartFile file) {
            try {
                // Generate unique filename
                String originalFileName = file.getOriginalFilename();
                String fileExtension = "";
                if (originalFileName != null && originalFileName.contains(".")) {
                    fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
                }
                String fileName = UUID.randomUUID().toString() + fileExtension;

                // Copy file to the target location
                Path targetLocation = this.fileStorageLocation.resolve(fileName);
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

                return fileName;
            } catch (IOException ex) {
                throw new RuntimeException("Could not store file. Please try again!", ex);
            }
        }

        public Resource loadFileAsResource(String fileName) {
            try {
                Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
                Resource resource = new UrlResource(filePath.toUri());

                if (resource.exists()) {
                    return resource;
                } else {
                    throw new RuntimeException("File not found: " + fileName);
                }
            } catch (MalformedURLException ex) {
                throw new RuntimeException("File not found: " + fileName, ex);
            }
        }

        public void deleteFile(String fileName) {
            try {
                Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
                Files.deleteIfExists(filePath);
            } catch (IOException ex) {
                throw new RuntimeException("Could not delete file: " + fileName, ex);
            }
        }

        public Path getFileStorageLocation() {
            return fileStorageLocation;
        }
    }