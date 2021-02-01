package de.adorsys.ledgers.oba.rest.server.resource.exception.resolver;

import de.adorsys.ledgers.oba.service.api.domain.exception.ObaErrorCode;
import org.springframework.http.HttpStatus;

import java.util.EnumMap;
import java.util.Map;

import static de.adorsys.ledgers.oba.service.api.domain.exception.ObaErrorCode.NOT_FOUND;
import static de.adorsys.ledgers.oba.service.api.domain.exception.ObaErrorCode.*;
import static org.springframework.http.HttpStatus.*;

public class AisExceptionStatusResolver {
    private static final Map<ObaErrorCode, HttpStatus> container = new EnumMap<>(ObaErrorCode.class);

    static {
        //400 Block
        container.put(AIS_BAD_REQUEST, BAD_REQUEST);

        //401 Block
        container.put(ACCESS_FORBIDDEN, FORBIDDEN);
        //404 Block
        container.put(NOT_FOUND, HttpStatus.NOT_FOUND);

        //500 Block
        container.put(CONNECTION_ERROR, INTERNAL_SERVER_ERROR);
        container.put(CONVERSION_EXCEPTION, INTERNAL_SERVER_ERROR);

        container.put(AUTH_EXPIRED, HttpStatus.UNAUTHORIZED);
        container.put(LOGIN_FAILED, HttpStatus.UNAUTHORIZED);
    }

    private AisExceptionStatusResolver() {
    }

    public static HttpStatus resolveHttpStatusByCode(ObaErrorCode code) {
        return container.get(code);
    }
}
