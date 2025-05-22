export const sampleInvoicePayload = {
  fattura_elettronica_header: {
    dati_trasmissione: {
      codice_destinatario: "1234567"
    },
    cedente_prestatore: {
      dati_anagrafici: {
        id_fiscale_iva: {
          id_paese: "IT",
          id_codice: "12345678901"
        },
        anagrafica: {
          denominazione: "Test Supplier"
        },
        regime_fiscale: "RF01"
      },
      sede: {
        indirizzo: "Via Test, 123",
        cap: "20145",
        comune: "Milano",
        provincia: "MI",
        nazione: "IT"
      }
    },
    cessionario_committente: {
      dati_anagrafici: {
        id_fiscale_iva: {
          id_paese: "IT",
          id_codice: "09876543211"
        },
        anagrafica: {
          denominazione: "Your Company Name"
        }
      },
      sede: {
        indirizzo: "Via Example, 456",
        cap: "20145",
        comune: "Milano",
        provincia: "MI",
        nazione: "IT"
      }
    }
  },
  fattura_elettronica_body: [{
    dati_generali: {
      dati_generali_documento: {
        tipo_documento: "TD01",
        divisa: "EUR",
        data: new Date().toISOString().split('T')[0],
        numero: "TEST-2025-001"
      }
    },
    dati_beni_servizi: {
      dettaglio_linee: [{
        numero_linea: 1,
        descrizione: "Test Product",
        prezzo_unitario: "100.00",
        prezzo_totale: "100.00",
        aliquota_iva: "22.00"
      }],
      dati_riepilogo: [{
        aliquota_iva: "22.00",
        imponibile_importo: "100.00",
        imposta: "22.00"
      }]
    }
  }]
};