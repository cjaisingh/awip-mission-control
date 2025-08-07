import { useState, useEffect } from 'react';
import { agentManager } from '../services/langchainConfig';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      await agentManager.initializeAgent(newSessionId);
      setSessionId(newSessionId);
    };

    initSession();
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !sessionId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Use LangChain agent to process the message
      const result = await agentManager.executeAgent(text, sessionId);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: result.output || 'I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const getConversationHistory = async () => {
    if (!sessionId) return [];
    return await agentManager.getConversationHistory(sessionId);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    getConversationHistory,
    sessionId
  };
}; 