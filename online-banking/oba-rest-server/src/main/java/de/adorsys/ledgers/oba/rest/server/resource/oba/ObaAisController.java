package de.adorsys.ledgers.oba.rest.server.resource.oba;

import de.adorsys.ledgers.middleware.api.domain.account.AccountDetailsTO;
import de.adorsys.ledgers.middleware.api.domain.account.TransactionTO;
import de.adorsys.ledgers.middleware.api.domain.payment.PaymentTO;
import de.adorsys.ledgers.middleware.client.rest.PaymentRestClient;
import de.adorsys.ledgers.oba.rest.api.resource.oba.ObaAisApi;
import de.adorsys.ledgers.oba.service.api.service.AisService;
import de.adorsys.ledgers.util.domain.CustomPageImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

import static de.adorsys.ledgers.oba.rest.api.resource.oba.ObaAisApi.BASE_PATH;

@Slf4j
@RestController
@RequestMapping(BASE_PATH)
@RequiredArgsConstructor
public class ObaAisController implements ObaAisApi {
    private final AisService aisService;
    private final PaymentRestClient paymentRestClient;

    @Override
    @PreAuthorize("#userLogin == authentication.principal.login")
    public ResponseEntity<List<AccountDetailsTO>> accounts(String userLogin) {
        return ResponseEntity.ok(aisService.getAccounts(userLogin));
    }

    @Override
    public ResponseEntity<AccountDetailsTO> account(String accountId) {
        return ResponseEntity.ok(aisService.getAccount(accountId));
    }

    @Override
    public ResponseEntity<List<TransactionTO>> transactions(String accountId, LocalDate dateFrom, LocalDate dateTo) {
        return ResponseEntity.ok(aisService.getTransactions(accountId, dateFrom, dateTo));
    }

    @Override
    public ResponseEntity<CustomPageImpl<TransactionTO>> transactions(String accountId, LocalDate dateFrom, LocalDate dateTo, int page, int size) {
        return ResponseEntity.ok(aisService.getTransactions(accountId, dateFrom, dateTo, page, size));
    }

    @Override
    public ResponseEntity<CustomPageImpl<PaymentTO>> getPendingPeriodicPayments(int page, int size) {
        return paymentRestClient.getPendingPeriodicPaymentsPaged(page, size);
    }

    @Override
    public ResponseEntity<CustomPageImpl<PaymentTO>> getAllPayments(int page, int size) {
        return paymentRestClient.getAllPaymentsPaged(page, size);
    }
}
