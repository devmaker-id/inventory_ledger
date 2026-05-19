import ExcelJS from "exceljs";

export const createWorkbook =
  () => {

    const workbook =
      new ExcelJS.Workbook();

    workbook.creator =
      "Inventory Ledger";

    workbook.created =
      new Date();

    return workbook;
  };