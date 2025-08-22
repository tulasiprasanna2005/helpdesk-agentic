const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const AgentSuggestion = require('../models/AgentSuggestion');
const AuditLog = require('../models/AuditLog');
const { auth, adminAuth } = require('../middleware/auth');
const { triageTicket } = require('../agent/triage');

// @route   POST /api/tickets
// @desc    Create a new ticket and trigger triage
// @access  User
router.post('/', auth, async (req, res) => {
  const { title, description, category } = req.body;
  const traceId = uuidv4();
  try {
    const newTicket = new Ticket({
      title,
      description,
      category,
      createdBy: req.user.id,
      status: 'open',
    });
    const ticket = await newTicket.save();
    const log = new AuditLog({
      ticketId: ticket._id,
      traceId,
      actor: 'user',
      action: 'TICKET_CREATED',
      meta: { title, description },
    });
    await log.save();
    triageTicket(ticket._id, traceId);
    res.status(201).json({ 
      msg: 'Ticket created and triage initiated',
      ticketId: ticket._id,
      traceId: traceId 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/tickets
// @desc    Get all tickets (filter by status/my tickets)
// @access  Authenticated (User, Agent, Admin)
router.get('/', auth, async (req, res) => {
  try {
    const { status, myTickets } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (myTickets === 'true') filter.createdBy = req.user.id;
    const tickets = await Ticket.find(filter).populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/tickets/:id
// @desc    Get a single ticket with its suggestion and audit log
// @access  Authenticated (User, Agent, Admin)
router.get('/:id', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignee', 'name email');
    if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });
    const suggestion = await AgentSuggestion.findOne({ ticketId: req.params.id });
    const auditLogs = await AuditLog.find({ ticketId: req.params.id }).sort({ timestamp: 1 });
    res.json({ ticket, suggestion, auditLogs });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/tickets/:id/reply
// @desc    Agent sends a reply to a ticket
// @access  Agent/Admin
router.post('/:id/reply', [auth, adminAuth], async (req, res) => {
  try {
    const { draftReply } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });
    
    // Update ticket status to 'resolved' and update a reply in a way
    // that it becomes a conversation
    const traceId = uuidv4();
    ticket.status = 'resolved';
    ticket.updatedAt = Date.now();
    await ticket.save();
    
    const log = new AuditLog({
      ticketId: ticket._id,
      traceId,
      actor: 'agent',
      action: 'REPLY_SENT',
      meta: { reply: draftReply, by: req.user.id },
    });
    await log.save();

    res.json({ msg: 'Reply sent and ticket resolved' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});

// @route   POST /api/tickets/:id/assign
// @desc    Assign a ticket to a user (e.g., agent)
// @access  Admin/Agent
router.post('/:id/assign', [auth, adminAuth], async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });
    
    const traceId = uuidv4();
    ticket.assignee = req.user.id;
    ticket.status = 'waiting_human';
    ticket.updatedAt = Date.now();
    await ticket.save();
    
    const log = new AuditLog({
      ticketId: ticket._id,
      traceId,
      actor: 'agent',
      action: 'ASSIGNED_TO_HUMAN',
      meta: { assignee: req.user.id },
    });
    await log.save();
    
    res.json({ msg: 'Ticket assigned successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;