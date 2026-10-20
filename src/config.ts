// Planilha do diário de dev (Google Sheets). Para o site conseguir ler, ela precisa estar
// compartilhada como "Qualquer pessoa com o link: leitor".
// Enquanto não estiver acessível, o site mostra as entradas de src/data/diario.json.
const DIARIO_SHEET_ID = '1oUjqygpBNCzVSRZNQCVvsZhPCyQSByIz_H7HBDg2-Fg'

export const DIARIO_CSV_URL = DIARIO_SHEET_ID
  ? `https://docs.google.com/spreadsheets/d/${DIARIO_SHEET_ID}/gviz/tq?tqx=out:csv`
  : ''
