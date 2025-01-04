package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.dto.PostDeliveryRequest;
import com.app.poultry_hatchery_management_app.dto.PostSupplierRequest;
import com.app.poultry_hatchery_management_app.dto.PutDeliveryRequest;
import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.repository.AddressRepository;
import com.app.poultry_hatchery_management_app.repository.DeliveryRepository;
import com.app.poultry_hatchery_management_app.repository.ProductTypeRepository;
import com.app.poultry_hatchery_management_app.repository.SupplierRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductTypeRepository productTypeRepository;
    private final AddressRepository addressRepository;

    public List<Delivery> getAllDeliveries() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();

            return deliveryRepository.findByOrganisationId(user.getOrganisation().getId());
        }
        return null;
    }

    public List<Delivery> getAllLeftOverDeliveries() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();

            return deliveryRepository.findAllLeftOvers(user.getOrganisation().getId());
        }
        return null;
    }

    public Optional<Delivery> getDeliveryById(UUID id) {
        return deliveryRepository.findById(id);
    }

    public List<Delivery> getDeliveriesBySupplierId(UUID supplierId) {
        return deliveryRepository.findBySupplierId(supplierId);
    }

    public List<String> getAllProductTypes() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            User user = (User) authentication.getPrincipal();

            List<ProductType> types = productTypeRepository.findAllByOrganisationId(user.getOrganisation().getId());
            return types.stream().map(ProductType::getName).collect(Collectors.toList());
        }
        return List.of();
    }

    public Optional<Delivery> postDelivery(PostDeliveryRequest request) {
        Optional<Supplier> supplier = supplierRepository.findById(request.supplierId());
        Optional<ProductType> type = productTypeRepository.findByName(request.productType());
        if (supplier.isPresent()) {
            if (type.isPresent()) {
                Delivery newDelivery = Delivery.builder()
                        .dateTime(LocalDateTime.now())
                        .supplier(supplier.get())
                        .quantity(request.quantity())
                        .productType(type.get())
                        .build();
                deliveryRepository.save(newDelivery);

                return Optional.of(newDelivery);
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid product type");
            }
        }
        return Optional.empty();
    }

    public Optional<Delivery> putDelivery(PutDeliveryRequest request) {
        Optional<Delivery> delivery = deliveryRepository.findById(request.deliveryId());
        Optional<ProductType> type = productTypeRepository.findByName(request.productType());
        if (type.isPresent()) {
            if (delivery.isPresent()) {
                delivery.get().setQuantity(request.quantity());
                deliveryRepository.save(delivery.get());

                return delivery;
            }
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid product type");
        }
        return Optional.empty();
    }

    public void deleteDelivery(UUID id) {
        deliveryRepository.deleteById(id);
    }

/////////////////////////////////////////////////////////////
/////////////////// S U P P L I E R S //////////////////////

    public List<Supplier> getAllSuppliers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();
            return supplierRepository.findAllByOrganisationId(user.getOrganisation().getId());
        }
        return null;
    }

    public Optional<Supplier> postSupplier(PostSupplierRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();

            Address address = Address.builder()
                    .city(request.city())
                    .street(request.street())
                    .number(request.number())
                    .postalCode(request.postalCode())
                    .build();
            addressRepository.save(address);

            Supplier supplier = Supplier.builder()
                    .name(request.firstName())
                    .surname(request.lastName())
                    .WNI(request.wni())
                    .address(address)
                    .organisation(user.getOrganisation())
                    .build();
            supplierRepository.save(supplier);

            return Optional.of(supplier);
        }
        return Optional.empty();
    }
}
