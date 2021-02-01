package de.adorsys.ledgers.oba.service.api.service;

import de.adorsys.ledgers.oba.service.api.domain.ConsentReference;
import de.adorsys.ledgers.oba.service.api.domain.ConsentType;

/**
 * Defines how to reference a consent.
 *
 * @author fpo
 */
public interface ConsentReferencePolicy {

    /**
     * Produces The consent reference based on the inbound URL parameter. I sure, just store those url parameters
     * so we can keep them in a consent cookie.
     * <p>
     * The inbound url will contain either an ais consentId or the pis paymentId. We call any of them an encrypted consent id.
     *
     * @param redirectId:        the redirect id.
     * @param consentType:       the type of consent requested payment, account information, cancelation.
     * @param encryptedConsentId the encrypted consent id
     * @return a holder of the consent references
     */
    ConsentReference fromURL(String redirectId, ConsentType consentType, String encryptedConsentId);

    /**
     * Produces a consent reference from a web request. Given encryptedConsentId and authorizationId are matched
     * against the values stored in the cookie.
     *
     * @param encryptedConsentId : the encrypted consent id from the request url
     * @param authorizationId    : the authorization id from the request url
     * @param cookieString       : the cookie string associated with the request.
     * @param strict             : if strict, the authorization id will be validated.
     * @return a holder of the consent references
     */
    ConsentReference fromRequest(String encryptedConsentId, String authorizationId, String cookieString, boolean strict);
}
