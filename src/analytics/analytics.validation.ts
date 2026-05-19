import {
  SalesChartQuery,
  DailyReportQuery,
  MonthlyReportQuery,
  LowStockQuery,
  RecentTransactionQuery,
} from "./analytics.types.js";

export const salesChartValidation =
  (
    query: SalesChartQuery
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

    return errors;
  };

export const dailyReportValidation =
  (
    query: DailyReportQuery
  ) => {

    const errors: string[] = [];

    /**
     * DATE
     */
    if (
      query.date &&
      isNaN(
        Date.parse(
          query.date
        )
      )
    ) {

      errors.push(
        "Invalid date"
      );
    }

    return errors;
  };

export const monthlyReportValidation =
  (
    query: MonthlyReportQuery
  ) => {

    const errors: string[] = [];

    /**
     * MONTH
     */
    if (query.month) {

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
    if (query.year) {

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

export const lowStockValidation =
  (
    query: LowStockQuery
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

export const recentTransactionValidation =
  (
    query: RecentTransactionQuery
  ) => {

    const errors: string[] = [];

    /**
     * LIMIT
     */
    if (
      query.limit
    ) {

      const limit =
        Number(query.limit);

      if (
        isNaN(limit) ||
        limit < 1
      ) {

        errors.push(
          "Invalid limit"
        );
      }
    }

    return errors;
  };