package de.adorsys.ledgers.xs2a.test.ctk.redirect;

import java.net.MalformedURLException;

import de.adorsys.ledgers.oba.rest.api.exception.PaymentAuthorizeException;
import org.junit.Test;
import org.springframework.http.ResponseEntity;

import de.adorsys.ledgers.middleware.api.domain.payment.TransactionStatusTO;
import de.adorsys.ledgers.middleware.api.domain.sca.ScaStatusTO;
import de.adorsys.ledgers.oba.rest.api.domain.PaymentAuthorizeResponse;
import de.adorsys.psd2.model.PaymentInitationRequestResponse201;
import de.adorsys.psd2.model.TransactionStatus;

public class SinglePaymentRedirectOneScaMethodIT extends AbstractSinglePaymentRedirect {

	@Test
	public void test_create_payment() throws MalformedURLException, PaymentAuthorizeException {
		// Initiate Payment
		PaymentInitationRequestResponse201 initiatedPayment = paymentInitService.initiatePayment();
		String paymentId = initiatedPayment.getPaymentId();

		// Login User
		ResponseEntity<PaymentAuthorizeResponse> loginResponseWrapper = paymentInitService.login(initiatedPayment);
		paymentInitService.validateResponseStatus(loginResponseWrapper.getBody(), ScaStatusTO.SCAMETHODSELECTED, TransactionStatusTO.ACCP);
		paymentInitService.checkTxStatus(paymentId, TransactionStatus.ACCP);

		ResponseEntity<PaymentAuthorizeResponse> authCodeResponseWrapper = paymentInitService.authCode(loginResponseWrapper);
		paymentInitService.validateResponseStatus(authCodeResponseWrapper.getBody(), ScaStatusTO.FINALISED, TransactionStatusTO.ACSP);
		paymentInitService.checkTxStatus(paymentId, TransactionStatus.ACSP);
	}
}
