import React, { useState, useRef, useEffect } from 'react';

const MoveAIChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [showWelcome, setShowWelcome] = useState(true);
  
  const chatMessagesRef = useRef(null);
  const textareaRef = useRef(null);
  
  const WEBHOOK_URL = "https://nickmos.app.n8n.cloud/webhook/d5b682ad-6f96-4b31-88d0-bea73068495c";

  const exampleQuestions = [
    "What was our revenue in June 2024?",
    "How many leads did we generate this month?",
    "What is our current CAC?",
    "Show me our conversion rates"
  ];

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'rgba(10, 22, 40, 0.95)',
      backdropFilter: 'blur(10px)',
      borderLeft: '1px solid rgba(74, 144, 226, 0.2)',
      borderRight: '1px solid rgba(74, 144, 226, 0.2)',
    },
    header: {
      background: 'linear-gradient(90deg, rgba(74, 144, 226, 0.1) 0%, rgba(74, 144, 226, 0.05) 100%)',
      padding: '24px 30px',
      borderBottom: '1px solid rgba(74, 144, 226, 0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    sphereIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 30%, #4A90E2, #2563eb, #1e40af)',
      position: 'relative',
      overflow: 'hidden',
    },
    sphereHighlight: {
      position: 'absolute',
      top: '8px',
      left: '8px',
      width: '12px',
      height: '12px',
      background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent)',
      borderRadius: '50%',
    },
    logoText: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#ffffff',
      letterSpacing: '2px',
    },
    subtitle: {
      color: '#4A90E2',
      fontSize: '14px',
      fontWeight: '500',
    },
    chatMessages: {
      flex: 1,
      overflowY: 'auto',
      padding: '24px 30px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    welcomeContainer: {
      textAlign: 'center',
      padding: '40px 20px',
    },
    welcomeTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#4A90E2',
      marginBottom: '12px',
    },
    welcomeText: {
      color: 'rgba(255, 255, 255, 0.7)',
      marginBottom: '24px',
    },
    exampleQuestions: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      justifyContent: 'center',
    },
    exampleButton: {
      background: 'rgba(74, 144, 226, 0.1)',
      border: '1px solid rgba(74, 144, 226, 0.3)',
      color: '#4A90E2',
      padding: '8px 16px',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.3s ease',
    },
    messageContainer: {
      display: 'flex',
      gap: '12px',
      maxWidth: '80%',
    },
    messageUser: {
      alignSelf: 'flex-end',
      flexDirection: 'row-reverse',
      marginLeft: 'auto',
    },
    messageAssistant: {
      alignSelf: 'flex-start',
      marginRight: 'auto',
    },
    avatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '14px',
      flexShrink: 0,
    },
    avatarUser: {
      background: 'linear-gradient(135deg, #4A90E2, #2563eb)',
      color: 'white',
    },
    avatarAssistant: {
      background: 'linear-gradient(135deg, #1a2332, #2d3748)',
      border: '2px solid #4A90E2',
      color: '#4A90E2',
    },
    messageContent: {
      padding: '16px 20px',
      borderRadius: '18px',
      backdropFilter: 'blur(10px)',
      lineHeight: '1.5',
      maxWidth: '600px',
    },
    messageContentUser: {
      background: 'linear-gradient(135deg, #4A90E2, #2563eb)',
      border: 'none',
      color: 'white',
    },
    messageContentAssistant: {
      background: 'rgba(26, 35, 50, 0.9)',
      border: '1px solid rgba(74, 144, 226, 0.3)',
      color: '#ffffff',
    },
    messageContentError: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      color: '#ef4444',
    },
    typingIndicator: {
      display: isLoading ? 'flex' : 'none',
      alignItems: 'center',
      gap: '8px',
      color: '#4A90E2',
      fontStyle: 'italic',
      padding: '10px 0',
    },
    typingDots: {
      display: 'flex',
      gap: '4px',
    },
    dot: {
      width: '6px',
      height: '6px',
      background: '#4A90E2',
      borderRadius: '50%',
    },
    inputContainer: {
      padding: '24px 30px',
      background: 'rgba(26, 35, 50, 0.8)',
      borderTop: '1px solid rgba(74, 144, 226, 0.3)',
      backdropFilter: 'blur(10px)',
    },
    inputWrapper: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-end',
    },
    textarea: {
      flex: 1,
      background: 'rgba(10, 22, 40, 0.9)',
      border: '2px solid rgba(74, 144, 226, 0.3)',
      borderRadius: '24px',
      padding: '16px 24px',
      color: '#ffffff',
      fontSize: '16px',
      resize: 'none',
      minHeight: '56px',
      maxHeight: '120px',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
    },
    sendButton: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #4A90E2, #2563eb)',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      flexShrink: 0,
    },
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      }
    }, 100);
  };

  const formatMessage = (text) => {
    if (typeof text !== 'string') {
      text = String(text);
    }
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/€(\d+(?:,\d{3})*(?:\.\d{2})?)/g, '<strong style="color: #4A90E2;">€$1</strong>')
      .replace(/(\d+(?:\.\d+)?%)/g, '<strong style="color: #4A90E2;">$1</strong>')
      .replace(/\n/g, '<br>');
  };

  const sendMessage = async (messageText = null) => {
    const message = messageText || inputValue.trim();
    if (!message || isLoading) return;

    setInputValue('');
    setShowWelcome(false);
    setIsLoading(true);

    const userMessage = { content: message, sender: 'user', id: Date.now() };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          sessionId: sessionId,
          userId: 'web-user',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed JSON:', data);
      } catch (parseError) {
        console.log('Not JSON, treating as text:', responseText);
        const assistantMessage = {
          content: responseText || 'No response received',
          sender: 'assistant',
          id: Date.now() + 1
        };
        setMessages(prev => [...prev, assistantMessage]);
        return;
      }

      let aiResponse = data;
      if (typeof data === 'object') {
        aiResponse = data.output || data.text || data.response || data.message || JSON.stringify(data, null, 2);
      }

      const assistantMessage = {
        content: aiResponse,
        sender: 'assistant',
        id: Date.now() + 1
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        sender: 'assistant',
        id: Date.now() + 1,
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    adjustTextareaHeight();
  };

  const handleExampleClick = (question) => {
    setInputValue(question);
    sendMessage(question);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.sphereIcon} className="animate-pulse-custom">
          <div style={styles.sphereHighlight}></div>
        </div>
        <div>
          <div style={styles.logoText}>MOVE</div>
          <div style={styles.subtitle}>AI Business Analytics</div>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={chatMessagesRef} style={styles.chatMessages} className="chat-scrollbar">
        {/* Welcome Message */}
        {showWelcome && (
          <div style={styles.welcomeContainer}>
            <div style={styles.welcomeTitle}>Welcome to MOVE AI Analytics</div>
            <p style={styles.welcomeText}>Ask me anything about your business performance, sales data, or financial metrics.</p>
            <div style={styles.exampleQuestions}>
              {exampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(question)}
                  style={styles.exampleButton}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(74, 144, 226, 0.2)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(74, 144, 226, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              ...styles.messageContainer,
              ...(message.sender === 'user' ? styles.messageUser : styles.messageAssistant)
            }}
            className="animate-slide-in"
          >
            {/* Avatar */}
            <div style={{
              ...styles.avatar,
              ...(message.sender === 'user' ? styles.avatarUser : styles.avatarAssistant)
            }}>
              {message.sender === 'user' ? 'U' : 'AI'}
            </div>

            {/* Message Content */}
            <div style={{
              ...styles.messageContent,
              ...(message.sender === 'user' 
                ? styles.messageContentUser 
                : message.isError 
                ? styles.messageContentError 
                : styles.messageContentAssistant)
            }}>
              <div 
                dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
              />
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        <div style={styles.typingIndicator}>
          <span>AI is analyzing</span>
          <div style={styles.typingDots}>
            <div style={styles.dot} className="typing-dot"></div>
            <div style={styles.dot} className="typing-dot"></div>
            <div style={styles.dot} className="typing-dot"></div>
          </div>
        </div>
      </div>

      {/* Input Container */}
      <div style={styles.inputContainer}>
        <div style={styles.inputWrapper}>
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about sales, revenue, leads, conversion rates..."
            style={styles.textarea}
            rows="1"
            disabled={isLoading}
            onFocus={(e) => {
              e.target.style.borderColor = '#4A90E2';
              e.target.style.boxShadow = '0 0 20px rgba(74, 144, 226, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(74, 144, 226, 0.3)';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!inputValue.trim() || isLoading}
            style={{
              ...styles.sendButton,
              opacity: (!inputValue.trim() || isLoading) ? 0.5 : 1,
              cursor: (!inputValue.trim() || isLoading) ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!e.target.disabled) {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 0 20px rgba(74, 144, 226, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.target.disabled) {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22,2 15,22 11,13 2,9"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveAIChat;
