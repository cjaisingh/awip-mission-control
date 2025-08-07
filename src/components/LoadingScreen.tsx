import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoadingScreenProps {
  status?: string;
  redirectDelay?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  status = 'Dashboard Initializing...',
  redirectDelay = 10000
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, redirectDelay);

    return () => clearTimeout(timer);
  }, [navigate, redirectDelay]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
      <div className="text-center max-w-2xl p-8">
        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-8" />
        <h1 className="text-3xl font-bold mb-4">🚀 AWIP Mission Control</h1>
        <div className="text-xl mb-4">{status}</div>
        <div className="text-sm opacity-80 leading-relaxed">
          The AWIP Mission Control Dashboard is being prepared.<br />
          Please wait while we configure the monitoring systems.<br /><br />
          <strong>Status:</strong> Deployment Complete<br />
          <strong>Repository:</strong>{' '}
          <a
            href="https://github.com/cjaisingh/awip-mission-control"
            className="text-white hover:text-gray-200 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Repository
          </a>
          <br />
          <strong>Note:</strong> Configure API credentials in repository secrets for full functionality.
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 