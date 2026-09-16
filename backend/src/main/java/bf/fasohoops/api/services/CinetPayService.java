package bf.fasohoops.api.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class CinetPayService {

    @Value("${cinetpay.apikey}")
    private String apikey;

    @Value("${cinetpay.siteid}")
    private String siteId;

    @Value("${cinetpay.notify-url}")
    private String notifyUrl;

    @Value("${cinetpay.return-url}")
    private String returnUrl;

    public Map<String, Object> initierPaiement(String planNom, int montant, String telephone, String userEmail) {
        String transactionId = "TX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Map<String, Object> response = new HashMap<>();
        response.put("transactionId", transactionId);
        response.put("plan", planNom);
        response.put("montant", montant);
        response.put("devise", "XOF");
        response.put("telephone", telephone);
        response.put("userEmail", userEmail);
        response.put("status", "INITIALISE");
        response.put("paymentUrl", "https://checkout.cinetpay.com/payment/" + transactionId);
        return response;
    }
}
