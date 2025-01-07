package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.model.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.AreaReference;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFTable;
import org.apache.poi.xssf.usermodel.XSSFTableStyleInfo;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@AllArgsConstructor
@Service
public class RaportService {

    private final CandlingService candlingService;
    private final NestingLoadedDeliveriesService nestingLoadedDeliveriesService;
    private final RejectionService rejectionService;
    private final HatchingService hatchingService;
    private final EmergenceService emergenceService;

    public byte[] generateRaport(UUID nestingId) throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            XSSFSheet sheet = workbook.createSheet("Karta lęgów");
            ///////////////////////




            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("data dostawy   ");
            headerRow.createCell(1).setCellValue("il. dostarczonych jaj   ");
            headerRow.createCell(2).setCellValue("data nakładu   ");
            headerRow.createCell(3).setCellValue("dostawca   ");

            headerRow.createCell(4).setCellValue("nakład - brakujące   ");
            headerRow.createCell(5).setCellValue("nakład - stłuczone   ");
            headerRow.createCell(6).setCellValue("nakład - inne   ");
            headerRow.createCell(7).setCellValue("nakład - razem odrzucono   ");
            headerRow.createCell(8).setCellValue("nakład - razem nałożono   ");

            List<Candling> candlingAmount = this.candlingService.getCandlingByNestingId(nestingId);
            for(int i = 1; i <= candlingAmount.size(); i++) {
                int lastCell = headerRow.getLastCellNum();
                headerRow.createCell(lastCell).setCellValue(i + " świetlenie - brak zarodka   ");
                headerRow.createCell(lastCell+1).setCellValue(i + " świetlenie - zamarły zarodek   ");
                headerRow.createCell(lastCell+2).setCellValue(i + " świetlenie - stłuczone   ");
                headerRow.createCell(lastCell+3).setCellValue(i + " świetlenie - inne   ");
                headerRow.createCell(lastCell+4).setCellValue(i + " świetlenie - zapłodnione   ");
                headerRow.createCell(lastCell+5).setCellValue(i + " świetlenie - w sumie odrzucono   ");
            }

            int lastCell = headerRow.getLastCellNum();

            headerRow.createCell(lastCell).setCellValue("przekład - stłuczone   ");
            headerRow.createCell(lastCell+1).setCellValue("przekład - inne   ");
            headerRow.createCell(lastCell+2).setCellValue("przekład - razem przełożono   ");

            headerRow.createCell(lastCell+3).setCellValue("wylęg - niewyklute   ");
            headerRow.createCell(lastCell+4).setCellValue("wylęg - wybrakowane   ");
            headerRow.createCell(lastCell+5).setCellValue("wylęg - inne   ");
            headerRow.createCell(lastCell+6).setCellValue("wylęg - zdrowe   ");
            headerRow.createCell(lastCell+7).setCellValue("wylęg - procent z nałożonych   ");
            headerRow.createCell(lastCell+8).setCellValue("wylęg - procent z klujnika   ");
            headerRow.createCell(lastCell+9).setCellValue("wylęg - data   ");


            List<NestingLoadedDeliveries> nld = nestingLoadedDeliveriesService.getAllNestingLoadedDeliveriesByNestingId(nestingId);
            for(int i = 0; i < nld.size(); i++) {
                Row dataRow = sheet.createRow(i+1);
                dataRow.createCell(0).setCellValue(nld.get(i).getDelivery().getDateTime().toLocalDate().toString());
                dataRow.createCell(1).setCellValue(nld.get(i).getDelivery().getQuantity().toString());
                dataRow.createCell(2).setCellValue(nld.get(i).getNesting().getDateTime().toLocalDate().toString());
                dataRow.createCell(3).setCellValue(nld.get(i).getDelivery().getSupplier().getSurname());

                int finalI1 = i;
                List<Rejection1> rejection1s = rejectionService.getAllRejections1ByNestingId(nestingId).stream()
                        .filter(item -> item.getNestingLoadedDeliveries().equals(nld.get(finalI1)))
                        .toList();

                int nestingTMP1 = rejection1s.stream()
                        .filter(item -> item.getCause().equals(RejectionCause.BRAK))
                        .mapToInt(Rejection1::getQuantity)
                        .sum();
                dataRow.createCell(4).setCellValue(nestingTMP1);

                int nestingTMP2 = rejection1s.stream()
                        .filter(item -> item.getCause().equals(RejectionCause.STLUCZKA))
                        .mapToInt(Rejection1::getQuantity)
                        .sum();
                dataRow.createCell(5).setCellValue(nestingTMP2);

                int nestingTMP3 = rejection1s.stream()
                        .filter(item -> item.getCause().equals(RejectionCause.INNE))
                        .mapToInt(Rejection1::getQuantity)
                        .sum();
                dataRow.createCell(6).setCellValue(nestingTMP3);

                int nestingTMP4 = rejection1s.stream()
                        .mapToInt(Rejection1::getQuantity)
                        .sum();
                dataRow.createCell(7).setCellValue(nestingTMP4);

                dataRow.createCell(8).setCellValue(nld.get(i).getQuantity() - nestingTMP4);


                List<Candling> allCandlingsFromNesting = this.candlingService.getCandlingByNestingId(nestingId).stream()
                        .sorted(Comparator.comparingInt(Candling::getCandlingNumber))
                        .toList();
                for(int x = 0; x < allCandlingsFromNesting.size(); x++) {
                    List<Rejection2> rejections = rejectionService.getAllRejections2ByCandlingId(allCandlingsFromNesting.get(x).getId());

                    int finalI = i;
                    List<Rejection2> rejectionsByNLD = rejections.stream()
                            .filter(item -> item.getNestingLoadedDeliveries().getDelivery().equals(nld.get(finalI).getDelivery()))
                            .toList();

                    lastCell = dataRow.getLastCellNum();

                    int tmp1 = rejectionsByNLD.stream()
                            .filter(item -> item.getCause().equals(RejectionCause.BRAK_ZARODKA))
                            .mapToInt(Rejection2::getQuantity)
                            .sum();
                    dataRow.createCell(lastCell).setCellValue(tmp1);

                    int tmp2 = rejectionsByNLD.stream()
                            .filter(item -> item.getCause().equals(RejectionCause.ZAMARLY_ZARODEK))
                            .mapToInt(Rejection2::getQuantity)
                            .sum();
                    dataRow.createCell(lastCell+1).setCellValue(tmp2);

                    int tmp3 = rejectionsByNLD.stream()
                            .filter(item -> item.getCause().equals(RejectionCause.STLUCZKA))
                            .mapToInt(Rejection2::getQuantity)
                            .sum();
                    dataRow.createCell(lastCell+2).setCellValue(tmp3);

                    int tmp4 = rejectionsByNLD.stream()
                            .filter(item -> item.getCause().equals(RejectionCause.INNE))
                            .mapToInt(Rejection2::getQuantity)
                            .sum();
                    dataRow.createCell(lastCell+3).setCellValue(tmp4);

                    int tmp5 = rejectionsByNLD.stream()
                            .filter(item -> ! item.getCause().equals(RejectionCause.BRAK_ZARODKA))
                            .mapToInt(Rejection2::getQuantity)
                            .sum();
                    dataRow.createCell(lastCell+4).setCellValue(tmp5);
                    //todo: fix

                    int tmp6 = rejectionsByNLD.stream()
                            .mapToInt(Rejection2::getQuantity)
                            .sum();
                    dataRow.createCell(lastCell+5).setCellValue(tmp6);


                }

                lastCell = dataRow.getLastCellNum();
                Optional<Hatching> hatchingOptional = hatchingService.getHatchingByNestingId(nestingId);
                Hatching hatching = hatchingOptional.get();

                int finalI2 = i;
                int rej3TMP1 = rejectionService.getAllRejections3ByNestingId(nestingId).stream()
                        .filter(item -> item.getHatchingLoadedDeliveries().getDelivery().equals(nld.get(finalI2).getDelivery()))
                        .filter(item -> item.getCause().equals(RejectionCause.STLUCZKA))
                        .mapToInt(Rejection3::getQuantity)
                        .sum();
                dataRow.createCell(lastCell).setCellValue(rej3TMP1);

                int rej3TMP2 = rejectionService.getAllRejections3ByNestingId(nestingId).stream()
                        .filter(item -> item.getHatchingLoadedDeliveries().getDelivery().equals(nld.get(finalI2).getDelivery()))
                        .filter(item -> item.getCause().equals(RejectionCause.INNE))
                        .mapToInt(Rejection3::getQuantity)
                        .sum();
                dataRow.createCell(lastCell+1).setCellValue(rej3TMP2);


                int currentHatchingResultQuantity = hatchingService.getAllHatchingResultsByHatchingId(hatching.getId()).stream()
                        .filter(item -> item.getHatchingLoadedDeliveries().getDelivery().equals(nld.get(finalI2).getDelivery()))
                        .mapToInt(HatchingResult::getQuantity)
                        .sum();

                int initialHatchingResultQuantity = currentHatchingResultQuantity + rejectionService.getAllRejections4ByNestingId(nestingId).stream()
                        .filter(item -> item.getHatchingResult().getHatchingLoadedDeliveries().getDelivery().equals(nld.get(finalI2).getDelivery()))
                        .mapToInt(Rejection4::getQuantity)
                        .sum();

                int initialHatchingQuantity = initialHatchingResultQuantity + rejectionService.getAllRejections3ByNestingId(nestingId).stream()
                        .filter(item -> item.getHatchingLoadedDeliveries().getDelivery().equals(nld.get(finalI2).getDelivery()))
                        .mapToInt(Rejection3::getQuantity)
                        .sum();

                dataRow.createCell(lastCell+2).setCellValue(initialHatchingQuantity);



                // hatching final stage //////////////////////////////////////////

//                List<HatchingResult> hrAll = hatchingService.getAllHatchingResultsByHatchingId(hatching.getId());
//
//                Optional<HatchingResult> hrByNLDOpt = hrAll.stream()
//                        .filter(item -> item.getHatchingLoadedDeliveries().getDelivery().equals(nld.get(finalI2).getDelivery()))
//                        .findAny();
//
//                if (hrByNLDOpt.isPresent()) {
//                    HatchingResult hrByNLD = hrByNLDOpt.get();
//
//                    int nesRes1 = rejectionService.getAllRejections4ByNestingId(nestingId).stream()
//                            .filter(item -> item.getHatchingResult().equals(hrByNLD))
//                            .filter(item -> item.getCause().equals(RejectionCause.NIEWYKLUTE))
//                            .mapToInt(Rejection4::getQuantity)
//                            .sum();
//                    headerRow.createCell(lastCell+3).setCellValue(nesRes1);
//
//                    int nesRes2 = rejectionService.getAllRejections4ByNestingId(nestingId).stream()
//                            .filter(item -> item.getHatchingResult().equals(hrByNLD))
//                            .filter(item -> item.getCause().equals(RejectionCause.WYBRAKOWANE))
//                            .mapToInt(Rejection4::getQuantity)
//                            .sum();
//                    headerRow.createCell(lastCell+4).setCellValue(nesRes2);
//
//                    int nesRes3 = rejectionService.getAllRejections4ByNestingId(nestingId).stream()
//                            .filter(item -> item.getHatchingResult().equals(hrByNLD))
//                            .filter(item -> item.getCause().equals(RejectionCause.INNE))
//                            .mapToInt(Rejection4::getQuantity)
//                            .sum();
//                    headerRow.createCell(lastCell+5).setCellValue(nesRes3);
//
//
//                    headerRow.createCell(lastCell+6).setCellValue(hrByNLD.getQuantity());
//
//                    headerRow.createCell(lastCell+7).setCellValue((double) (hrByNLD.getQuantity() * 100) /nld.get(finalI2).getQuantity());
//
//                    headerRow.createCell(lastCell+8).setCellValue((double) (hrByNLD.getQuantity() * 100) /initialHatchingResultQuantity);
//
//                    Emergence emergence = emergenceService.getEmergenceByNestingId(nestingId).get();
//                    headerRow.createCell(lastCell+9).setCellValue(emergence.getDateTime().toLocalDate().toString());
//                }
            }


            ///////////////////////
            for (int i = 0; i < headerRow.getLastCellNum(); i++) {
                sheet.autoSizeColumn(i);
            }

            try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                workbook.write(out);
                return out.toByteArray();
            }
        }
    }
}
