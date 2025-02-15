package de.adorsys.psd2.sandbox.tpp.rest.server.service;

import de.adorsys.ledgers.middleware.api.domain.account.AccountBalanceTO;
import de.adorsys.ledgers.middleware.api.domain.general.RecoveryPointTO;
import de.adorsys.ledgers.middleware.api.domain.general.RevertRequestTO;
import de.adorsys.ledgers.middleware.api.domain.payment.PaymentTO;
import de.adorsys.ledgers.middleware.api.domain.um.UploadedDataTO;
import de.adorsys.ledgers.middleware.client.mappers.PaymentMapperTO;
import de.adorsys.ledgers.middleware.client.rest.DataRestClient;
import de.adorsys.ledgers.middleware.client.rest.UserMgmtStaffRestClient;
import de.adorsys.psd2.sandbox.tpp.cms.api.service.CmsDbNativeService;
import de.adorsys.psd2.sandbox.tpp.rest.server.exception.TppException;
import de.adorsys.psd2.sandbox.tpp.rest.server.mapper.BalanceMapper;
import de.adorsys.psd2.sandbox.tpp.rest.server.model.AccountBalance;
import de.adorsys.psd2.sandbox.tpp.rest.server.model.DataPayload;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.Objects.requireNonNull;

@Slf4j
@Service
@RequiredArgsConstructor
public class RestExecutionService {
    private final DataRestClient dataRestClient;
    private final BalanceMapper balanceMapper;
    private final PaymentMapperTO paymentTOMapper;
    private final UserMgmtStaffRestClient userMgmtStaffRestClient;
    private final CmsDbNativeService cmsDbNativeService;


    public void updateLedgers(DataPayload payload) {
        if (!payload.isValidPayload()) {
            throw new TppException("Payload data is invalid", 400);
        }
        dataRestClient.uploadData(initialiseDataSets(payload));
    }

    @SuppressWarnings("PMD:PrematureDeclaration")
    public void revert(RevertRequestTO revertRequest) {
        // If users are present within this branch - get their logins (PSU IDs) and clean the ledgers and CMS DB with logins and timestamp.
        List<String> logins = userMgmtStaffRestClient.getBranchUserLogins().getBody();
        RecoveryPointTO point = dataRestClient.getPoint(revertRequest.getRecoveryPointId()).getBody();

        userMgmtStaffRestClient.revertDatabase(revertRequest);
        cmsDbNativeService.revertDatabase(logins, requireNonNull(point).getRollBackTime());
    }

    private UploadedDataTO initialiseDataSets(DataPayload payload) {
        List<PaymentTO> paymentTOs = payload.getPayments().stream()
                                         .map(this::performMapping)
                                         .collect(Collectors.toList());
        return new UploadedDataTO(payload.getUsers(),
                                  payload.getAccountByIban(),
                                  toAccountBalanceTO(payload.getBalancesByIban()),
                                  paymentTOs,
                                  payload.isGeneratePayments(),
                                  payload.getBranch());
    }

    @SneakyThrows
    private PaymentTO performMapping(PaymentTO payment) {
        String paymentString = paymentTOMapper.getMapper().writeValueAsString(payment);
        return paymentTOMapper.toAbstractPayment(paymentString, "SINGLE", payment.getPaymentProduct());
    }

    private Map<String, AccountBalanceTO> toAccountBalanceTO(Map<String, AccountBalance> balancesByIban) {
        return balancesByIban.entrySet().stream()
                   .collect(Collectors.toMap(Map.Entry::getKey, e -> balanceMapper.toAccountBalanceTO(e.getValue())));
    }
}
