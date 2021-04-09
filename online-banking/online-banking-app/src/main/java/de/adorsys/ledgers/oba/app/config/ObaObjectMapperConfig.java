package de.adorsys.ledgers.oba.app.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import de.adorsys.ledgers.oba.rest.server.config.mapper.CmsPaymentDeserializer;
import de.adorsys.ledgers.oba.rest.server.config.mapper.CmsSinglePaymentDeserializer;
import de.adorsys.psd2.consent.api.pis.BaseCmsPayment;
import de.adorsys.psd2.consent.api.pis.CmsSinglePayment;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Configuration
@RequiredArgsConstructor
public class ObaObjectMapperConfig {
    private final ObjectMapper objectMapper;

    @PostConstruct
    public void postConstruct() {
        SimpleModule module = new SimpleModule();
        module.addDeserializer(BaseCmsPayment.class, new CmsPaymentDeserializer(objectMapper))
            .addDeserializer(CmsSinglePayment.class, new CmsSinglePaymentDeserializer(objectMapper));
        objectMapper.registerModule(module)
            .registerModule(new JavaTimeModule());
    }
}
