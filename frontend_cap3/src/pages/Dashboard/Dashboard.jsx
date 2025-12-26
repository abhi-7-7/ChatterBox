import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import Sidebar from '../../components/Sidebar';
import DashNavbar from './DashNavbar';
import CoreAnalytics from './CoreAnalytics';
import WeeklyEngagement from './WeeklyEngagement';
import WeeklyInsight from './WeeklyInsight';
import RecentChatsSection from './RecentChatsSection';
import AIInsightScheduling from './AIInsightScheduling';
import QuickActions from './QuickActions';
import { chatAPI } from '../../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [theme] = useState(
    () => localStorage.getItem('chatterbox-theme') || 'light'
  );

  const [dashboardStats, setDashboardStats] = useState({
    totalMessages: 0,
    activeUsers: 0,
    groups: 0,
    totalChats: 0,
    messageGrowth: 0,
    userGrowth: 0
  });

  const [engagementData, setEngagementData] = useState({
    days: [],
    bars: [],
    messages: [],
    users: []
  });

  const [recentChats, setRecentChats] = useState([]);
  const [weeklyInsights, setWeeklyInsights] = useState([]);
  const [aiReminder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const statsRes = await chatAPI.getDashboardStats();
      const stats = statsRes?.data?.data || {};

      const chatsRes = await chatAPI.getMyChats({ limit: 1000 });
      const allChats = chatsRes?.data?.chats || [];

      const uniqueUsers = new Set();
      allChats.forEach(chat =>
        chat.participants?.forEach(p => uniqueUsers.add(p.userId))
      );

      setDashboardStats({
        totalMessages: stats.totalMessages || 0,
        activeUsers: uniqueUsers.size || 0,
        groups: stats.groups || 0,
        totalChats: stats.totalChats || 0,
        messageGrowth: 14,
        userGrowth: 14
      });

      if (stats.graph) {
        setEngagementData({
          days: stats.graph.days || [],
          bars: stats.graph.bars || [],
          messages: stats.graph.messages || [],
          users: stats.graph.users || []
        });
      }

      const recentRes = await chatAPI.getMyChats({ limit: 10 });
      setRecentChats(recentRes?.data?.chats?.slice(0, 3) || []);

      setWeeklyInsights(['Messages increased', 'Engagement trending up']);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex">
        <Sidebar theme={theme} />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar theme={theme} />

      {/* DASHBOARD */}
      <div className="flex-1 flex flex-col overflow-hidden pl-8">

        <DashNavbar theme={theme} />

        <div className="flex-1 overflow-y-auto py-12">
          <div
            className="
              mx-auto
              w-full
              max-w-[1520px]
              2xl:max-w-[1600px]
              px-10
              space-y-14
            "
          >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
                {error}
              </div>
            )}

            <CoreAnalytics stats={dashboardStats} theme={theme} />

            {/* WEEKLY ENGAGEMENT + INSIGHTS */}
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_1.3fr] gap-12">
              <WeeklyEngagement
                theme={theme}
                engagementData={engagementData}
              />
              <WeeklyInsight
                theme={theme}
                insights={weeklyInsights}
                stats={dashboardStats}
              />
            </div>

            {/* RECENT CHATS + AI INSIGHTS */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1.2fr] gap-12">
              <RecentChatsSection
                chats={recentChats}
                theme={theme}
                onViewAll={() => navigate('/chat')}
              />
              <AIInsightScheduling
                theme={theme}
                aiReminder={aiReminder}
              />
            </div>

            <QuickActions
              theme={theme}
              onNewChat={() => navigate('/chat')}
              onCreateGroup={() => navigate('/chat')}
              onCommunity={() => navigate('/chat')}
              onContacts={() => navigate('/chat')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
