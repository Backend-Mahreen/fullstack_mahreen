const express = require('express');
const router = express.Router();

const dashboardRoutes = require('./dashboard');
const newsroomRoutes = require('./newsroom');
const notificationsRoutes = require('./notifications');
const consultationsRoutes = require('./consultations');
const invoicesRoutes = require('./invoices');
const streamRoutes = require('./stream');
const donationsRoutes = require('./donations');
const csrApplicationsRoutes = require('./csr-applications');
const internshipApplicationsRoutes = require('./internship-applications');
const studioOrdersRoutes = require('./studio-orders');
const certificatesRoutes = require('./certificates');
const supportTicketsRoutes = require('./support-tickets');

/**
 * Router khusus client portal.
 * Seluruh endpoint di bawahnya bersifat user-scoped: data difilter
 * berdasarkan `req.user.id` dari access token, bukan parameter request.
 */
router.use('/dashboard', dashboardRoutes);
router.use('/newsroom', newsroomRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/dashboard/consultations', consultationsRoutes);
router.use('/invoices', invoicesRoutes);
router.use('/stream', streamRoutes);
router.use('/donations', donationsRoutes);
router.use('/csr-applications', csrApplicationsRoutes);
router.use('/internship-applications', internshipApplicationsRoutes);
router.use('/studio-orders', studioOrdersRoutes);
router.use('/certificates', certificatesRoutes);
router.use('/support-tickets', supportTicketsRoutes);

module.exports = router;
