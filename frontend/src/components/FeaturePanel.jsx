// FeaturePanel.js
import React from 'react';

const FeaturePanel = () => {
  return (
    <div className="d-flex flex-column h-100">
      <div className="mb-4">
        <h2 className="text-primary mb-4">
          <i className="fas fa-robot me-2"></i>
         Consist AI:LLM Stabilizer
        </h2>
        
        <div className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">
              <i className="fas fa-cogs me-2 text-primary"></i>
              How It Works
            </h5>
            <ol className="list-group list-group-numbered">
              <li className="list-group-item border-0">
                Your question is sent to multiple AI models simultaneously
              </li>
              <li className="list-group-item border-0">
                Responses are evaluated by Gemini Flash
              </li>
              <li className="list-group-item border-0">
                Best response is selected in real-time
              </li>
            </ol>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">
              <i className="fas fa-microchip me-2 text-primary"></i>
              AI Models Used
            </h5>
            <div className="list-group">
              <div className="list-group-item border-0">
                <i className="fab fa-meta me-2"></i>
                <strong>Llama 3</strong> - 70B parameter model
              </div>
              <div className="list-group-item border-0">
                <i className="fab fa-google me-2"></i>
                <strong>Gemma</strong> - Google's lightweight model
              </div>
              <div className="list-group-item border-0">
                <i className="fas fa-brain me-2"></i>
                <strong>DeepSeek</strong> - Specialized distillation model
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto alert alert-info small">
        <i className="fas fa-lightbulb me-2"></i>
        Tip: Selected model shown with <span className="badge bg-success">green badge</span>, 
        others in <span className="badge bg-secondary">gray</span>
      </div>
    </div>
  );
};

export default FeaturePanel;