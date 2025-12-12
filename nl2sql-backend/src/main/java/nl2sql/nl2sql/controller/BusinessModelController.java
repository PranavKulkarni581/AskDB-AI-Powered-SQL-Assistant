package nl2sql.nl2sql.controller;

import nl2sql.nl2sql.dto.BusinessModelRequest;
import nl2sql.nl2sql.dto.BusinessModelResponse;
import nl2sql.nl2sql.service.BusinessModelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/business-model")
public class BusinessModelController {

    private final BusinessModelService businessModelService;

    public BusinessModelController(BusinessModelService businessModelService) {
        this.businessModelService = businessModelService;
    }

    @PostMapping
    public ResponseEntity<BusinessModelResponse> generateSchema(@RequestBody BusinessModelRequest request) {
        BusinessModelResponse response = businessModelService.generateSchema(request);
        return ResponseEntity.ok(response);
    }
}
