const { v4: uuidv4 } = require('uuid');
const Ticket = require('../models/Ticket');
const AgentSuggestion = require('../models/AgentSuggestion');
const AuditLog = require('../models/AuditLog');
const Article = require('../models/Article');
const Config=require('../models/Config');
const { llmStub } = require('./llmStub'); // We'll create this next

// This is the main agentic workflow function
const triageTicket = async (ticketId, traceId) => {
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      console.error(`Ticket with ID ${ticketId} not found.`);
      return;
    }

    // 1. Classify the ticket category
    const classifiedResult = await llmStub.classify(ticket.description);
    const { predictedCategory, confidence } = classifiedResult;

    const log1 = new AuditLog({
      ticketId,
      traceId,
      actor: 'system',
      action: 'AGENT_CLASSIFIED',
      meta: { predictedCategory, confidence },
    });
    await log1.save();
    
    // 2. Retrieve relevant KB articles
    // TODO: Replace with a proper keyword search or vector search
    const articles = await Article.find({ 
      $or: [
        { tags: predictedCategory }, // Search by predicted category tag
        { title: new RegExp(ticket.title, 'i') } // Basic keyword search on title
      ]
    }).limit(3);
    const articleIds = articles.map(a => a._id);

    const log2 = new AuditLog({
      ticketId,
      traceId,
      actor: 'system',
      action: 'KB_RETRIEVED',
      meta: { articleIds },
    });
    await log2.save();


    // 3. Draft a suggested reply
    const draftResult = await llmStub.draft(ticket.description, articles);
    const { draftReply, citations } = draftResult;
    
    const log3 = new AuditLog({
      ticketId,
      traceId,
      actor: 'system',
      action: 'DRAFT_GENERATED',
      meta: { draftReply, citations },
    });
    await log3.save();

    // 4. Decision: Auto-close or assign to human
    // TODO: Implement confidence threshold check and auto-close logic
    const config = await Config.findOne();
    const autoCloseEnabled = config ? config.autoCloseEnabled : false;
    const confidenceThreshold = config ? config.confidenceThreshold : 0.8;

    const agentSuggestion = new AgentSuggestion({
      ticketId: ticket._id,
      predictedCategory,
      articleIds: citations,
      draftReply,
      confidence,
      autoClosed: false,
      modelInfo: { provider: 'stub', model: 'v1' },
    });
if (autoCloseEnabled && confidence >= confidenceThreshold) {
      agentSuggestion.autoClosed = true;
      ticket.status = 'resolved';
      await ticket.save();

      const log4 = new AuditLog({
        ticketId,
        traceId,
        actor: 'system',
        action: 'AUTO_CLOSED',
        meta: { reason: 'Confidence met threshold' },
      });
      await log4.save();

    } else {
      ticket.status = 'waiting_human';
      await ticket.save();
      
      const log4 = new AuditLog({
        ticketId,
        traceId,
        actor: 'system',
        action: 'ASSIGNED_TO_HUMAN',
        meta: { reason: 'Confidence below threshold or auto-close disabled' },
      });
      await log4.save();
    }
    
    await agentSuggestion.save();

  } catch (err) {
    console.error('Agent Triage Error:', err.message);
    const errorLog = new AuditLog({
      ticketId,
      traceId,
      actor: 'system',
      action: 'TRIAGE_FAILED',
      meta: { error: err.message },
    });
    await errorLog.save();
  }
};

module.exports = { triageTicket };