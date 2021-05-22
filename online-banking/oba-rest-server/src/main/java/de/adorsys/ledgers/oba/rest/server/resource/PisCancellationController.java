package de.adorsys.ledgers.oba.rest.server.resource;

import de.adorsys.ledgers.middleware.api.domain.payment.TransactionStatusTO;
import de.adorsys.ledgers.middleware.api.domain.sca.GlobalScaResponseTO;
import de.adorsys.ledgers.middleware.api.domain.sca.OpTypeTO;
import de.adorsys.ledgers.middleware.client.rest.AuthRequestInterceptor;
import de.adorsys.ledgers.oba.rest.api.resource.PisCancellationApi;
import de.adorsys.psd2.sandbox.auth.MiddlewareAuthentication;
import de.adorsys.ledgers.oba.service.api.domain.PaymentAuthorizeResponse;
import de.adorsys.ledgers.oba.service.api.domain.PaymentWorkflow;
import de.adorsys.ledgers.oba.service.api.domain.exception.ObaErrorCode;
import de.adorsys.ledgers.oba.service.api.domain.exception.ObaException;
import de.adorsys.ledgers.oba.service.api.service.CommonPaymentService;
import de.adorsys.ledgers.oba.service.api.service.TokenAuthenticationService;
import feign.FeignException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

import static de.adorsys.ledgers.oba.rest.api.resource.PisCancellationApi.BASE_PATH;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(BASE_PATH)
@Api(value = BASE_PATH, tags = "PSU PIS Cancellation. Provides access to online banking payment functionality")
public class PisCancellationController implements PisCancellationApi {
    private final CommonPaymentService paymentService;
    private final XISControllerService xisService;
    private final HttpServletResponse response;
    private final ResponseUtils responseUtils;
    private final MiddlewareAuthentication middlewareAuth;
    private final AuthRequestInterceptor authInterceptor;
    private final TokenAuthenticationService authenticationService;

    @Override
    @ApiOperation(value = "Identifies the user by login an pin. Return sca methods information")
    public ResponseEntity<PaymentAuthorizeResponse> login(String encryptedPaymentId, String authorisationId, String login, String pin) {
        PaymentWorkflow workflow = paymentService.identifyPayment(encryptedPaymentId, authorisationId, null);
        if (workflow.getPaymentStatus().equals(TransactionStatusTO.RCVD.name())) {
            throw ObaException.builder()
                .devMessage(String.format("Cancellation of Payment id: %s is not possible thought OnlineBanking as it's status is RECEIVED, cancellation of this payment is only possible though EMBEDDED route", encryptedPaymentId))
                .obaErrorCode(ObaErrorCode.LOGIN_FAILED)
                .build();
        }
        xisService.checkFailedCount(encryptedPaymentId);

        // Authorize
        try {
            GlobalScaResponseTO ledgersResponse = authenticationService.login(login, pin, authorisationId);
            workflow.processSCAResponse(ledgersResponse);
            AuthUtils.checkIfUserInitiatedOperation(ledgersResponse, workflow.getPaymentResponse().getPayment().getPsuIdDatas());
            workflow = paymentService.initiatePaymentOpr(workflow, login, OpTypeTO.CANCEL_PAYMENT);
        } catch (FeignException | ObaException e) {
            xisService.resolveFailedLoginAttempt(encryptedPaymentId, workflow.paymentId(), login, workflow.authId(), OpTypeTO.PAYMENT);
        }
        return xisService.resolvePaymentWorkflow(workflow);
    }

    @Override
    public ResponseEntity<PaymentAuthorizeResponse> selectMethod(String encryptedPaymentId, String authorisationId, String scaMethodId) {
        return xisService.selectScaMethod(encryptedPaymentId, authorisationId, scaMethodId);
    }

    @Override
    public ResponseEntity<PaymentAuthorizeResponse> authorisePayment(String encryptedPaymentId, String authorisationId, String authCode) {

        String psuId = AuthUtils.psuId(middlewareAuth);
        try {
            PaymentWorkflow identifyPaymentWorkflow = paymentService.identifyPayment(encryptedPaymentId, authorisationId, middlewareAuth.getBearerToken());
            PaymentWorkflow authorizeCancelPaymentWorkflow = paymentService.authorizePaymentOpr(identifyPaymentWorkflow, psuId, authCode, OpTypeTO.CANCEL_PAYMENT);

            log.info("Confirmation code: {}", authorizeCancelPaymentWorkflow.getAuthResponse().getAuthConfirmationCode());
            return ResponseEntity.ok(authorizeCancelPaymentWorkflow.getAuthResponse());
        } finally {
            authInterceptor.setAccessToken(null);
        }
    }

    @Override
    public ResponseEntity<PaymentAuthorizeResponse> pisDone(String encryptedPaymentId, String authorisationId, boolean isOauth2Integrated, String authConfirmationCode) {
        String psuId = AuthUtils.psuId(middlewareAuth);
        String redirectUrl = paymentService.resolveRedirectUrl(encryptedPaymentId, authorisationId, isOauth2Integrated, psuId, middlewareAuth.getBearerToken(), authConfirmationCode);
        return responseUtils.redirect(redirectUrl, response);
    }
}

