import {
  SettlementExportQuery,
  MonthlyReportExportQuery,
  InventoryExportQuery,
  SalesHistoryExportQuery,
} from "./exports.types.js";

export const settlementExportValidation =
  (
    query: SettlementExportQuery
  ) => {

    const errors: string[] = [];

    /**
     * START DATE
     */
    if (
      query.startDate &&
      isNaN(
        Date.parse(
          query.startDate
        )
      )
    ) {

      errors.push(
        "Invalid startDate"
      );
    }

    /**
     * END DATE
     */
    if (
      query.endDate &&
      isNaN(
        Date.parse(
          query.endDate
        )
      )
    ) {

      errors.push(
        "Invalid endDate"
      );
    }

    /**
     * RANGE LIMIT
     */
    if (
      query.startDate &&
      query.endDate
    ) {

      const start =
        new Date(
          query.startDate
        );

      const end =
        new Date(
          query.endDate
        );

      const diffMs =
        end.getTime() -
        start.getTime();

      const diffDays =
        diffMs /
        (
          1000 *
          60 *
          60 *
          24
        );

      if (
        diffDays > 365
      ) {

        errors.push(
          "Maximum export range is 365 days"
        );
      }
    }

    return errors;
  };

export const monthlyReportExportValidation =
  (
    query: MonthlyReportExportQuery
  ) => {

    const errors: string[] = [];

    /**
     * MONTH
     */
    if (
      query.month
    ) {

      const month =
        Number(query.month);

      if (
        isNaN(month) ||
        month < 1 ||
        month > 12
      ) {

        errors.push(
          "Invalid month"
        );
      }
    }

    /**
     * YEAR
     */
    if (
      query.year
    ) {

      const year =
        Number(query.year);

      if (
        isNaN(year) ||
        year < 2000
      ) {

        errors.push(
          "Invalid year"
        );
      }
    }

    return errors;
  };

export const inventoryExportValidation =
  (
    query: InventoryExportQuery
  ) => {

    const errors: string[] = [];

    /**
     * THRESHOLD
     */
    if (
      query.threshold
    ) {

      const threshold =
        Number(
          query.threshold
        );

      if (
        isNaN(threshold) ||
        threshold < 0
      ) {

        errors.push(
          "Invalid threshold"
        );
      }
    }

    return errors;
  };

export const salesHistoryExportValidation =
  (
    query: SalesHistoryExportQuery
  ) => {

    const errors: string[] = [];

    /**
     * START DATE
     */
    if (
      query.startDate &&
      isNaN(
        Date.parse(
          query.startDate
        )
      )
    ) {

      errors.push(
        "Invalid startDate"
      );
    }

    /**
     * END DATE
     */
    if (
      query.endDate &&
      isNaN(
        Date.parse(
          query.endDate
        )
      )
    ) {

      errors.push(
        "Invalid endDate"
      );
    }

    /**
     * RANGE LIMIT
     */
    if (
      query.startDate &&
      query.endDate
    ) {

      const start =
        new Date(
          query.startDate
        );

      const end =
        new Date(
          query.endDate
        );

      const diffMs =
        end.getTime() -
        start.getTime();

      const diffDays =
        diffMs /
        (
          1000 *
          60 *
          60 *
          24
        );

      if (
        diffDays > 365
      ) {

        errors.push(
          "Maximum export range is 365 days"
        );
      }
    }

    return errors;
  };