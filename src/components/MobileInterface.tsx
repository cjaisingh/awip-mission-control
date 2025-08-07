import React, { useState, useEffect, useRef, memo } from 'react';
import { FaSatellite, FaBars, FaChartLine, FaComments, FaCog, FaCircle, FaRobot, FaPaperPlane } from 'react-icons/fa';
import { useSystemMetrics } from '../hooks/useSystemMetrics';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { useChat } from '../hooks/useChat';

type Panel = 'dashboard' | 'chat' | 'system';
type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface SystemStatus {
  database: boolean;
  github: boolean;
  agent20: boolean;
}

const MobileInterface: React.FC = memo(() => {
  const [showMenu, setShowMenu] = useState(false);
  const [activePanel, setActivePanel] = useState<Panel>('dashboard');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
  const systemMetrics = useSystemMetrics();
  const { systemStatus } = useSystemStatus();
  const { messages, sendMessage: sendChatMessage } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendChatMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      {/* Mobile Header */}
      <header className="backdrop-blur-lg bg-white/10 border-b border-white/20 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaSatellite className="text-blue-400 text-xl" />
            <h1 className="text-lg font-bold">AWIP Control</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected'
                  ? 'bg-green-400'
                  : connectionStatus === 'connecting'
                  ? 'bg-yellow-400'
                  : 'bg-red-400'
              }`}
            />
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <FaBars className="text-xl" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="mt-4 space-y-2">
            <button
              onClick={() => {
                setActivePanel('dashboard');
                setShowMenu(false);
              }}
              className={`w-full text-left p-3 rounded-lg backdrop-blur-lg bg-white/10 min-h-[44px] ${
                activePanel === 'dashboard' ? 'bg-blue-500/30' : ''
              }`}
            >
              <FaChartLine className="inline mr-3" /> Dashboard
            </button>
            <button
              onClick={() => {
                setActivePanel('chat');
                setShowMenu(false);
              }}
              className={`w-full text-left p-3 rounded-lg backdrop-blur-lg bg-white/10 min-h-[44px] ${
                activePanel === 'chat' ? 'bg-blue-500/30' : ''
              }`}
            >
              <FaComments className="inline mr-3" /> Agent Chat
            </button>
            <button
              onClick={() => {
                setActivePanel('system');
                setShowMenu(false);
              }}
              className={`w-full text-left p-3 rounded-lg backdrop-blur-lg bg-white/10 min-h-[44px] ${
                activePanel === 'system' ? 'bg-blue-500/30' : ''
              }`}
            >
              <FaCog className="inline mr-3" /> System
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="p-4 pb-20">
        {activePanel === 'dashboard' && (
          <div className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="backdrop-blur-lg bg-white/10 rounded-xl p-4">
                <div className="text-sm text-gray-300">CPU Usage</div>
                <div className="text-2xl font-bold">{systemMetrics.cpu}%</div>
                <div className="text-xs text-gray-400">Current</div>
              </div>
              <div className="backdrop-blur-lg bg-white/10 rounded-xl p-4">
                <div className="text-sm text-gray-300">Memory Usage</div>
                <div className="text-2xl font-bold">{systemMetrics.memory}%</div>
                <div className="text-xs text-gray-400">Current</div>
              </div>
              <div className="backdrop-blur-lg bg-white/10 rounded-xl p-4">
                <div className="text-sm text-gray-300">Network</div>
                <div className="text-2xl font-bold">{systemMetrics.network}%</div>
                <div className="text-xs text-gray-400">Traffic</div>
              </div>
              <div className="backdrop-blur-lg bg-white/10 rounded-xl p-4">
                <div className="text-sm text-gray-300">Disk</div>
                <div className="text-2xl font-bold">{systemMetrics.disk}%</div>
                <div className="text-xs text-gray-400">Usage</div>
              </div>
            </div>

            {/* System Status */}
            <div className="backdrop-blur-lg bg-white/10 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-3">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Database</span>
                  <div className="flex items-center space-x-2">
                    <FaCircle
                      className={`text-xs ${
                        systemStatus.database ? 'text-green-500' : 'text-red-500'
                      }`}
                    />
                    <span className="text-sm">
                      {systemStatus.database ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>GitHub API</span>
                  <div className="flex items-center space-x-2">
                    <FaCircle
                      className={`text-xs ${
                        systemStatus.github ? 'text-green-500' : 'text-red-500'
                      }`}
                    />
                    <span className="text-sm">
                      {systemStatus.github ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Agent 20</span>
                  <div className="flex items-center space-x-2">
                    <FaCircle
                      className={`text-xs ${
                        systemStatus.agent20 ? 'text-green-500' : 'text-red-500'
                      }`}
                    />
                    <span className="text-sm">
                      {systemStatus.agent20 ? 'Operational' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePanel === 'chat' && (
          <div className="space-y-4">
            {/* Chat Header */}
            <div className="backdrop-blur-lg bg-white/10 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <FaRobot className="text-white" />
                </div>
                <div>
                  <div className="font-semibold">Agent 20</div>
                  <div className="text-sm text-gray-300">Online</div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="backdrop-blur-lg bg-white/10 rounded-xl p-4 h-64 overflow-y-auto"
            >
              <div className="space-y-3">
                {messages.map((message: ChatMessage) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-xl ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      <div className="text-sm">{message.text}</div>
                      <div className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="backdrop-blur-lg bg-white/10 rounded-xl p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 min-h-[44px]"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 rounded-lg px-4 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        )}

        {activePanel === 'system' && (
          <div className="space-y-4">
            {/* System settings content */}
            <div className="backdrop-blur-lg bg-white/10 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-3">System Settings</h3>
              {/* Add system settings content here */}
            </div>
          </div>
        )}
      </main>
    </div>
  );
});

MobileInterface.displayName = 'MobileInterface';

export default MobileInterface; 