// ChatInterface.js
import React, { useState, useRef, useEffect } from 'react';
import useAuth  from '../store/UseAuth';
import axios from 'axios';

const ChatInterface = () => {
  const {checkAuth,isCheckingAuth,authUser,logout,isLogout}=useAuth()
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [abortController, setAbortController] = useState(new AbortController());
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatModelName = (model) => {
    const [provider, name] = model.split('/');
    return `${provider.charAt(0).toUpperCase() + provider.slice(1)} ${name.split('-')[0].toUpperCase()}`;
  };

  const handleStop = () => {
    abortController.abort();
    setIsLoading(false);
    setMessages(prev => [...prev, {
      content: '⏹️ Response generation stopped',
      isBot: true,
      error: true
    }]);
    setAbortController(new AbortController());
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    // Add your logout logic here
    if(!isLogout){
      logout()
      navigate('/')
     
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const newController = new AbortController();
      setAbortController(newController);
      
      const userMessage = { content: input, isBot: false };
      setMessages(prev => [...prev, userMessage]);

      const response = await axios.post(
        'http://localhost:3000/api/ml/judgeAndGenerate',
        { prompt: input },
        { signal: newController.signal }
      );

      const botMessage = {
        content: response.data.bestResponse,
        isBot: true,
        model: response.data.chosenModel,
        candidates: response.data.candidates,
        responseTime: response.data.responseTime
      };

      setMessages(prev => [...prev, botMessage]);
      setInput('');
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('API Error:', error);
        setMessages(prev => [...prev, {
          content: '⚠️ Failed to get response. Please try again.',
          isBot: true,
          error: true
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatContent = (text) => {
    return text.split('\n\n').map((section, sectionIdx) => {
      const lines = section.split('\n').filter(l => l.trim());
      return (
        <div key={sectionIdx} className="mb-3">
          {lines.map((line, lineIdx) => {
            if (line.startsWith('**')) {
              const cleanLine = line.replace(/\*\*/g, '');
              return <h6 key={lineIdx} className="fw-bold mb-2">{cleanLine}</h6>;
            } else if (line.startsWith('* ')) {
              const cleanLine = line.replace(/^\* /, '');
              return (
                <div key={lineIdx} className="d-flex align-items-start ms-3 mb-1">
                  <span className="me-2">•</span>
                  <span>{cleanLine}</span>
                </div>
              );
            }
            return <p key={lineIdx} className="mb-2">{line}</p>;
          })}
        </div>
      );
    });
  };

  return (
    <div className={`h-100 d-flex flex-column ${isDarkMode ? 'bg-dark text-white' : 'bg-white'}`}>
      {/* Header Controls */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <div className="d-flex gap-2">
          {isLoading && (
            <button 
              className={`btn btn-danger btn-sm ${isDarkMode ? 'text-white' : ''}`}
              onClick={handleStop}
            >
              <i className="fas fa-stop me-2"></i>
              Stop
            </button>
          )}
          <button 
            className={`btn btn-sm ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt me-2"></i>
            Logout
          </button>
        </div>
        
        <button 
          className={`btn btn-sm ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
          onClick={toggleDarkMode}
        >
          <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow-1 overflow-auto p-3">
        {messages.map((msg, index) => (
          <div key={index} className={`d-flex ${msg.isBot ? '' : 'justify-content-end'} mb-3`}>
            <div 
              className={`rounded p-3 position-relative ${
                msg.isBot 
                  ? isDarkMode ? 'bg-secondary text-white' : 'bg-light' 
                  : isDarkMode ? 'bg-primary text-white' : 'bg-primary text-white'
              }`}
              style={{ maxWidth: 'min(85%, 800px)' }}
            >
              {msg.isBot && (
                <div className="d-flex flex-wrap align-items-center mb-2 gap-2">
                  <div className="d-flex align-items-center">
                    <i className={`fas fa-microchip ${isDarkMode ? 'text-light' : 'text-muted'} fs-6 me-2`}></i>
                    <small className={`${isDarkMode ? 'text-light' : 'text-muted'} fw-medium`}>
                      {formatModelName(msg.model)}
                      <span className="mx-2">•</span>
                      <span className="text-success">{msg.responseTime}ms</span>
                    </small>
                  </div>
                  
                  <div className="d-flex gap-1 flex-wrap">
                    {msg.candidates?.map((model, idx) => (
                      <span 
                        key={idx}
                        className={`badge ${model === msg.model ? 'bg-success' : isDarkMode ? 'bg-light text-dark' : 'bg-secondary'} py-1 px-2`}
                        style={{ fontSize: '0.65rem' }}
                      >
                        {model.split('/')[1].split('-')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className={msg.isBot && !isDarkMode ? 'text-dark' : 'text-white'}>
                {formatContent(msg.content)}
              </div>
              
              {msg.isBot && (
                <div className="position-absolute top-0 start-0 translate-middle">
                  <span className="bg-success text-white rounded-circle p-1 d-flex">
                    <i className="fas fa-check fs-6"></i>
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className={`border-top p-3 ${isDarkMode ? 'bg-dark' : ''}`}>
        <div className="input-group">
          <input
            type="text"
            className={`form-control ${isDarkMode ? 'bg-secondary text-white border-dark' : ''}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your question..."
            disabled={isLoading}
          />
          <button 
            className={`btn ${isLoading ? 'btn-danger' : 'btn-primary'}`} 
            type={isLoading ? 'button' : 'submit'}
            onClick={isLoading ? handleStop : null}
            disabled={!input.trim() && !isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-stop me-2"></i>
                Stop
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane me-2"></i>
                Send
              </>
            )}
          </button>
        </div>
        <small className={`mt-2 d-block ${isDarkMode ? 'text-light' : 'text-muted'}`}>
          Press Enter to send • Responses take 2-5 seconds
        </small>
      </form>
    </div>
  );
};

export default ChatInterface;