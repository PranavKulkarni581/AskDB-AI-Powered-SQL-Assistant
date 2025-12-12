package nl2sql.nl2sql.controller;

import nl2sql.nl2sql.dto.*;
import nl2sql.nl2sql.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // enable frontend requests
public class ApiController {

    @Autowired
    private DatabaseService dbConnectionService;

    @Autowired
    private TranslateService translateService;

    @Autowired
    private ExecuteService executeService;

    // ✅ 1. Test connection
    @PostMapping("/connect")
    public ApiResponse connect(@RequestBody DatabaseConnectionRequest req) {
        boolean ok = dbConnectionService.testConnection(
                req.host(), req.port(), req.database(), req.username(), req.password()
        );
        return new ApiResponse(ok, ok ? "Connected successfully" : "Connection failed", null, null);
    }

    // ✅ 2. Translate natural language → SQL
//    @PostMapping("/translate")
//    public TranslateResponse translate(@RequestBody TranslateRequest req) {
//        return translateService.translate(req);
//    }

    // ✅ 3. Execute SQL on database
    @PostMapping("/execute")
    public ExecuteResponse execute(@RequestBody ExecuteRequest req) {
        return executeService.executeQuery(req);
    }
}
