package com.app.poultry_hatchery_management_app.controller;


import com.app.poultry_hatchery_management_app.service.RaportService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("api/v1/raport")
public class RaportController {

    private final RaportService excelService;


    @GetMapping("")
    public ResponseEntity<byte[]> getExcelFile(@RequestParam UUID nestingId) {
        try {
            byte[] excelFile = excelService.generateRaport(nestingId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=example.xlsx")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(excelFile);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }


}
