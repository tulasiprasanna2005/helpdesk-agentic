const llmStub = {
  // Simple heuristic-based classification
  classify: (text) => {
    let predictedCategory = 'other';
    let confidence = 0.5;
    if (text.toLowerCase().includes('refund') || text.toLowerCase().includes('invoice') || text.toLowerCase().includes('payment')) {
      predictedCategory = 'billing';
      confidence = 0.8;
    } else if (text.toLowerCase().includes('error') || text.toLowerCase().includes('bug') || text.toLowerCase().includes('stack')) {
      predictedCategory = 'tech';
      confidence = 0.9;
    } else if (text.toLowerCase().includes('shipment') || text.toLowerCase().includes('delivery') || text.toLowerCase().includes('package')) {
      predictedCategory = 'shipping';
      confidence = 0.85;
    }
    return Promise.resolve({ predictedCategory, confidence });
  },

  // Templated reply with KB titles
  draft: (text, articles) => {
    const citations = articles.map(a => a._id);
    let draftReply = "Hello,\n\nThank you for reaching out. Based on your issue, here are some relevant articles that might help:\n";
    articles.forEach((article, index) => {
      draftReply += `\n${index + 1}. ${article.title}`;
    });
    draftReply += `\n\nIf this doesn't resolve your issue, a human agent will be in touch shortly.`;
    return Promise.resolve({ draftReply, citations });
  },
};

module.exports = { llmStub };