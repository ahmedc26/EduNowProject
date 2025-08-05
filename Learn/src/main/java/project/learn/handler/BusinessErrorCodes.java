package project.learn.handler;

import lombok.Getter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_IMPLEMENTED;

public enum BusinessErrorCodes {

    NO_CODE(0, NOT_IMPLEMENTED,"No Code" ),
    INCORRECT_CURRENT_PASSWORD(300, BAD_REQUEST,"Current Password Incorrect"),
    NEW_PASSWORD_DOES_NOT_MATCH(301, BAD_REQUEST,"New Password Does Not Match"),
    ACCOUNT_LOCKED(302,HttpStatus.FORBIDDEN,"User account is locked"),
    ACCOUNT_DISABLED(303,HttpStatus.FORBIDDEN,"User account is disabled"),
    BAD_CREDENTIALS(400, BAD_REQUEST,"Bad Credentials"),
    ;


    @Getter
    private final int code;
    @Getter
    private final String description;
    @Getter
    private final HttpStatus httpStatus;

    BusinessErrorCodes(int code, HttpStatus httpStatus, String description) {
        this.code = code;
        this.description = description;
        this.httpStatus = httpStatus;
    }
}
