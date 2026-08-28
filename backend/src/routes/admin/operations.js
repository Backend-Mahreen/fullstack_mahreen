const express = require('express');
const router = express.Router();
const { runQuery } = require('../../config/database');
const { sendSuccess } = require('../../utils/response');
const { asyncHandler, sumColumn } = require('./_helpers');

router.get(
  '/command-center',
  asyncHandler(async (req, res) => {
    const [paidRevenue, allTransactions, monthlyRevenue, recentTransactions, serviceBreakdown] =
      await Promise.all([
        sumColumn('transactions', 'amount', " WHERE UPPER(status) = 'PAID'"),
        runQuery(
          `SELECT id, invoice_id, client_name, service, amount, status, payment_method, created_at
           FROM transactions ORDER BY created_at DESC LIMIT 50`,
        ),
        runQuery(
          `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
                  COALESCE(SUM(amount), 0) AS total
           FROM transactions WHERE UPPER(status) = 'PAID'
           GROUP BY month ORDER BY month ASC LIMIT 12`,
        ),
        runQuery(
          `SELECT id, invoice_id AS invoiceId, client_name, client_email, service, amount, status, created_at
           FROM transactions ORDER BY created_at DESC LIMIT 10`,
        ),
        runQuery(
          `SELECT COALESCE(NULLIF(service, ''), 'Lainnya') AS service,
                  COUNT(*) AS count, COALESCE(SUM(amount), 0) AS total
           FROM transactions WHERE UPPER(status) = 'PAID'
           GROUP BY service ORDER BY total DESC`,
        ),
      ]);

    const total = Number(paidRevenue || 0);
    const daysInMonth = 30;
    const now = new Date();
    const dayOfMonth = now.getDate();
    const monthlyActuals = monthlyRevenue.map((r) => Number(r.total || 0));
    const lastActual = monthlyActuals.length > 0 ? monthlyActuals[monthlyActuals.length - 1] : 0;
    const dailyRate = dayOfMonth > 0 ? lastActual / dayOfMonth : 0;
    const projectedMonthEnd = Math.round(dailyRate * daysInMonth);

    const totalServiceRevenue = serviceBreakdown.reduce((s, r) => s + Number(r.total || 0), 0);

    sendSuccess(res, {
      metrics: {
        totalRevenue: total,
        averageDailyRevenue: Math.round(dailyRate),
        projectedMonthEnd,
        profitMargin: total > 0 ? Math.round((total / (total * 1.3)) * 100) : 0,
      },
      actualRevenue: monthlyActuals,
      forecastRevenue: monthlyActuals.map((v, i) => {
        if (i < monthlyActuals.length - 1) return v;
        return projectedMonthEnd;
      }),
      divisionShare: serviceBreakdown.map((r) => ({
        label: r.service,
        subtitle: `${r.count} transaksi`,
        value:
          totalServiceRevenue > 0 ? Math.round((Number(r.total) / totalServiceRevenue) * 100) : 0,
      })),
      transactions: recentTransactions.map((t) => {
        const divisionMap = {
          'Tanya Mahreen': 'Consultancy',
          'Peduli Mahreen': 'Donation',
          'Mahreen Studio': 'Studio',
        };
        return {
          id: t.invoiceId,
          date: t.created_at,
          division: divisionMap[t.service] || 'Consultancy',
          client: t.client_name,
          amount: Number(t.amount || 0),
          method: t.payment_method || '—',
          status: t.status === 'paid' ? 'Settled' : 'Pending',
        };
      }),
    });
  }),
);

module.exports = router;
