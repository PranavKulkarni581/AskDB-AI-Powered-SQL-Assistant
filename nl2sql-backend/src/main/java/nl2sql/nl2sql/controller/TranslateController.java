package nl2sql.nl2sql.controller;

import nl2sql.nl2sql.dto.TranslateRequest;
import nl2sql.nl2sql.dto.TranslateResponse;
import nl2sql.nl2sql.service.TranslateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/translate")
public class TranslateController {

    private final TranslateService translateService;

    public TranslateController(TranslateService translateService) {
        this.translateService = translateService;
    }

    @PostMapping
    public ResponseEntity<TranslateResponse> translate(@RequestBody TranslateRequest request) {
        TranslateResponse response = translateService.translate(request);
        return ResponseEntity.ok(response);
    }


    // ✅ Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("OK");
    }
}
