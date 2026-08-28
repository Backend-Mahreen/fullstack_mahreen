const express = require('express');
const router = express.Router();
const { runQuery } = require('../../../config/database');
const { sendSuccess } = require('../../../utils/response');
const { asyncHandler, countWhere, sumColumn, groupCount } = require('../_helpers');

const consultationsRouter = require('./consultations');
const ordersRouter = require('./orders');
const transactionsRouter = require('./transactions');
const packagesRouter = require('./packages');

/**
 * GET /api/admin/tanya-mahreen/stats
 */
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const [
      totalConsultations,
      pendingConsultations,
      scheduledConsultations,
      completedConsultations,
      cancelledConsultations,
      totalOrders,
      pendingOrders,
      inProgressOrders,
      completedOrders,
      totalTransactions,
      paidTransactions,
      pendingTransactions,
      failedTransactions,
      paidRevenue,
      pendingRevenue,
      orderValue,
      interestBreakdown,
      serviceKeyBreakdown,
      tierBreakdown,
      monthlyRevenue,
      monthlyConsultations,
    ] = await Promise.all([
      countWhere('consultations'),
      countWhere('consultations', " WHERE status = 'pending'"),
      countWhere('consultations', " WHERE status = 'scheduled'"),
      countWhere('consultations', " WHERE status = 'completed'"),
      countWhere('consultations', " WHERE status = 'cancelled'"),
      countWhere('service_orders'),
      countWhere('service_orders', " WHERE status = 'pending'"),
      countWhere('service_orders', " WHERE status = 'in_progress'"),
      countWhere('service_orders', " WHERE status = 'completed'"),
      countWhere('transactions'),
      countWhere('transactions', " WHERE UPPER(status) = 'PAID'"),
      countWhere('transactions', " WHERE UPPER(status) = 'PENDING'"),
      countWhere('transactions', " WHERE UPPER(status) IN ('FAILED','CANCELLED')"),
      sumColumn('transactions', 'amount', " WHERE UPPER(status) = 'PAID'"),
      sumColumn('transactions', 'amount', " WHERE UPPER(status) = 'PENDING'"),
      sumColumn('service_orders', 'total_price'),
      groupCount('consultations', 'service_interest'),
      groupCount('service_orders', 'service_key'),
      groupCount('service_orders', 'tier'),
      runQuery(
        `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COALESCE(SUM(amount), 0) AS revenue, COUNT(*) AS count
         FROM transactions WHERE UPPER(status) = 'PAID' GROUP BY month ORDER BY month ASC LIMIT 12`,
      ),
      runQuery(
        `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
         FROM consultations GROUP BY month ORDER BY month ASC LIMIT 12`,
      ),
    ]);

    sendSuccess(res, {
      consultations: {
        total: totalConsultations,
        pending: pendingConsultations,
        scheduled: scheduledConsultations,
        completed: completedConsultations,
        cancelled: cancelledConsultations,
        conversionRate:
          totalConsultations > 0
            ? Math.round((completedConsultations / totalConsultations) * 100)
            : 0,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        inProgress: inProgressOrders,
        completed: completedOrders,
        totalValue: orderValue,
      },
      transactions: {
        total: totalTransactions,
        paid: paidTransactions,
        pending: pendingTransactions,
        failed: failedTransactions,
        paidRevenue,
        pendingRevenue,
        averageValue: paidTransactions > 0 ? Math.round(paidRevenue / paidTransactions) : 0,
      },
      interestBreakdown: interestBreakdown.map((r) => ({
        interest: r.label || 'Lainnya',
        count: Number(r.count),
      })),
      serviceKeyBreakdown: serviceKeyBreakdown.map((r) => ({
        serviceKey: r.label,
        count: Number(r.count),
      })),
      tierBreakdown: tierBreakdown.map((r) => ({ tier: r.label, count: Number(r.count) })),
      monthlyRevenue: monthlyRevenue.map((r) => ({
        month: r.month,
        revenue: Number(r.revenue),
        count: Number(r.count),
      })),
      monthlyConsultations: monthlyConsultations.map((r) => ({
        month: r.month,
        count: Number(r.count),
      })),
    });
  }),
);

router.use('/consultations', consultationsRouter);
router.use('/orders', ordersRouter);
router.use('/transactions', transactionsRouter);
router.use('/packages', packagesRouter);

module.exports = router;
