import { create } from 'xmlbuilder2';
import type { DBDocument } from '../types/document';

type FatturaPAOptions = {
  isSplitPayment?: boolean;
  isReverseCharge?: boolean;
};

export function mapDocumentToFatturaPAXml(doc: DBDocument, options: FatturaPAOptions = {}): string {
  const {
    recipient,
    recipientVATNumber,
    editorName,
    editorEmail,
    editorPhone,
    totalNet,
    totalTax,
    totalGross,
    taxType,
    date,
    publishedId,
    name,
  } = doc;

  const xml = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('p:FatturaElettronica', {
      versione: 'FPR12',
      'xmlns:p': 'http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2',
      'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xsi:schemaLocation': 'http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2 Schema_VFPR12_v1.2.3.xsd'
    })
      .ele('FatturaElettronicaHeader')
        .ele('DatiTrasmissione')
          .ele('IdTrasmittente')
            .ele('IdPaese').txt('IT').up()
            .ele('IdCodice').txt('12345678901').up()
          .up()
          .ele('ProgressivoInvio').txt('00001').up()
          .ele('FormatoTrasmissione').txt('FPR12').up()
          .ele('CodiceDestinatario').txt('0000000').up()
          .ele('PECDestinatario').txt(editorEmail).up()
        .up()
        .ele('CedentePrestatore')
          .ele('DatiAnagrafici')
            .ele('IdFiscaleIVA')
              .ele('IdPaese').txt('IT').up()
              .ele('IdCodice').txt('12345678901').up()
            .up()
            .ele('Anagrafica')
              .ele('Denominazione').txt(editorName).up()
            .up()
            .ele('RegimeFiscale').txt('RF01').up()
          .up()
          .ele('Sede')
            .ele('Indirizzo').txt('Via di esempio 1').up()
            .ele('CAP').txt('00100').up()
            .ele('Comune').txt('Roma').up()
            .ele('Provincia').txt('RM').up()
            .ele('Nazione').txt('IT').up()
          .up()
          .ele('Contatti')
            .ele('Telefono').txt(editorPhone).up()
            .ele('Email').txt(editorEmail).up()
          .up()
        .up()
        .ele('CessionarioCommittente')
          .ele('DatiAnagrafici')
            .ele('IdFiscaleIVA')
              .ele('IdPaese').txt(recipientVATNumber.substring(0, 2)).up()
              .ele('IdCodice').txt(recipientVATNumber.substring(2)).up()
            .up()
            .ele('Anagrafica')
              .ele('Denominazione').txt(recipient.name).up()
            .up()
          .up()
          .ele('Sede')
            .ele('Indirizzo').txt(recipient.street || 'N/A').up()
            .ele('CAP').txt(recipient.zipCode || '00000').up()
            .ele('Comune').txt(recipient.city || 'N/A').up()
            .ele('Provincia').txt('XX').up()
            .ele('Nazione').txt('IT').up()
          .up()
        .up()
      .up()
      .ele('FatturaElettronicaBody')
        .ele('DatiGenerali')
          .ele('DatiGeneraliDocumento')
            .ele('TipoDocumento').txt('TD01').up()
            .ele('Divisa').txt('EUR').up()
            .ele('Data').txt(date.split('T')[0]).up()
            .ele('Numero').txt(publishedId || 'N/A').up()
            .ele('ImportoTotaleDocumento').txt(totalGross.toFixed(2)).up()
            .ele('Causale').txt(name).up()
          .up()
        .up()
        .ele('DatiBeniServizi')
          .ele('DettaglioLinee')
            .ele('NumeroLinea').txt('1').up()
            .ele('Descrizione').txt('Prestazione edile').up()
            .ele('Quantita').txt('1.00').up()
            .ele('PrezzoUnitario').txt(totalNet.toFixed(2)).up()
            .ele('PrezzoTotale').txt(totalNet.toFixed(2)).up()
            .ele('AliquotaIVA').txt('22.00').up()
            .ele('Natura', options.isReverseCharge ? { _text: 'N6.1' } : undefined).up()
          .up()
          .ele('DatiRiepilogo')
            .ele('AliquotaIVA').txt('22.00').up()
            .ele('ImponibileImporto').txt(totalNet.toFixed(2)).up()
            .ele('Imposta').txt(options.isReverseCharge || options.isSplitPayment ? '0.00' : totalTax.toFixed(2)).up()
            .ele('Natura', options.isReverseCharge ? { _text: 'N6.1' } : undefined).up()
            .ele('EsigibilitaIVA').txt(options.isSplitPayment ? 'S' : 'I').up()
            .ele('RiferimentoNormativo')
              .txt(options.isReverseCharge ? 'Art. 17, comma 6, DPR 633/72' : undefined)
            .up()
          .up()
        .up()
        .ele('DatiPagamento')
          .ele('CondizioniPagamento').txt('TP02').up()
          .ele('DettaglioPagamento')
            .ele('ModalitaPagamento').txt('MP05').up()
            .ele('DataScadenzaPagamento')
              .txt(new Date(new Date(date).setDate(new Date(date).getDate() + 30)).toISOString().split('T')[0])
            .up()
            .ele('ImportoPagamento').txt(totalGross.toFixed(2)).up()
          .up()
        .up()
      .up()
    .up();

  return xml.end({ prettyPrint: true });
}