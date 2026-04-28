import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, Bell, User, Download, Upload, Trash2, ChevronRight, X, Ruler } from 'lucide-react';
import { useApp } from '../hooks/useAuth';
import { useInstallPWA } from '../hooks/useInstallPWA';
import { Link } from 'react-router-dom';
import ReminderSettingsForm from '../components/reminder/ReminderSettings';
import GoalSwitcher from '../components/profile/GoalSwitcher';
import { STORAGE_KEYS } from '../constants';
import type { ReminderSettings } from '../types';

const SettingsPage: React.FC = () => {
  const { state, saveReminders, exportUserData, importUserData, logout } = useApp();
  const { user, bodyData, reminders, weightHistory, trainingLogs } = state;
  const { isInstallable, installPWA } = useInstallPWA();

  const [showReminderSettings, setShowReminderSettings] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleSaveReminder = (settings: ReminderSettings) => {
    saveReminders([settings]);
    setShowReminderSettings(false);
  };

  const handleExport = () => {
    const data = exportUserData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitness-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result as string;
      importUserData(data);
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (window.confirm('⚠️ 警告：这将永久删除您的所有身体数据、训练记录和计划。确定要重置吗？')) {
      // 1. 清空所有持久化键
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      // 2. 登出并刷新页面
      logout();
      window.location.href = '/register';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-4 py-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <SettingsIcon size={24} />
          设置
        </h1>
        <p className="text-slate-300 text-sm mt-1">管理你的应用设置和数据</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* User Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{user?.name || user?.username || '用户'}</h3>
              <p className="text-sm text-gray-500">{user?.email || '未设置邮箱'}</p>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </motion.div>

        {/* Edit Body Data Entry */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-xl p-4 shadow-sm"
        >
          <Link to="/body-data" className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Ruler size={20} className="text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">身体指标扫描</h3>
              <p className="text-sm text-gray-500">
                {bodyData ? `当前身高: ${bodyData.height}cm / 体重: ${bodyData.weight}kg` : '尚未填报身体指标'}
              </p>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </Link>
        </motion.div>

        {/* Install PWA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-primary/10 rounded-xl p-4 shadow-sm border border-brand-primary/20"
        >
          <button
            onClick={() => {
              if (isInstallable && installPWA) {
                installPWA();
              } else {
                alert("如果无法一键安装，请点击浏览器地址栏右侧的【安装】图标，或在手机浏览器菜单中选择【添加到主屏幕】。");
              }
            }}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center">
                <Download size={20} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">安装 App 到桌面</h3>
                <p className="text-sm text-brand-primary font-medium">获取原生级体验与离线访问</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-brand-primary" />
          </button>
        </motion.div>

        {/* Reminder Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-sm"
        >
          <button
            onClick={() => setShowReminderSettings(true)}
            className="flex items-center gap-3 w-full"
          >
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Bell size={20} className="text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">打卡提醒</h3>
              <p className="text-sm text-gray-500">
                {reminders[0]?.enabled ? `${reminders[0].time} 提醒` : '未开启'}
              </p>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </motion.div>

        {/* Statistics Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-sm"
        >
          <h3 className="font-medium text-gray-900 mb-3">数据统计</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">体重记录</p>
              <p className="text-lg font-semibold text-gray-900">{weightHistory.length}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">训练次数</p>
              <p className="text-lg font-semibold text-gray-900">{trainingLogs.length}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">BMI</p>
              <p className="text-lg font-semibold text-gray-900">
                {bodyData ? (bodyData.weight / Math.pow(bodyData.height / 100, 2)).toFixed(1) : '--'}
              </p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">健身目标</h4>
            <GoalSwitcher />
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm"
        >
          <h3 className="font-medium text-gray-900 p-4 pb-2">数据管理</h3>

          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
          >
            <Download size={20} className="text-blue-500" />
            <span className="text-gray-700">导出数据</span>
          </button>

          <div className="border-t">
            <label className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <Upload size={20} className="text-green-500" />
              <span className="text-gray-700">导入数据</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          <div className="border-t">
            <button
              onClick={handleClearData}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-red-600"
            >
              <Trash2 size={20} />
              <span>清除所有数据</span>
            </button>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-rose-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                <Trash2 size={20} className="text-rose-500" />
              </div>
              <div>
                <h3 className="font-medium text-rose-600">危险操作</h3>
                <p className="text-xs text-gray-400">清除所有本地缓存并重置</p>
              </div>
            </div>
            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 active:scale-95 transition-all shadow-sm"
            >
              清空并重置
            </button>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center py-4"
        >
          <p className="text-sm text-gray-500">健身 Web 应用 v2.1</p>
          <p className="text-xs text-gray-400 mt-1">AI 驱动 · 极简设计 · 本地存储</p>
        </motion.div>
      </div>

      {/* Reminder Settings Modal */}
      <AnimatePresence>
        {showReminderSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end z-50"
            onClick={() => setShowReminderSettings(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full bg-gray-50 rounded-t-3xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-gray-900">打卡提醒</h3>
                <button
                  onClick={() => setShowReminderSettings(false)}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <ReminderSettingsForm
                settings={reminders[0] || {
                  id: 'rm-1',
                  userId: user?.id || '',
                  enabled: false,
                  time: '08:00',
                  days: [1, 2, 3, 4, 5],
                  message: '时间到啦，该锻炼了！',
                  soundEnabled: true,
                }}
                onSave={handleSaveReminder}
                onCancel={() => setShowReminderSettings(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-5 w-[90%] max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-semibold text-gray-900 mb-2">导出数据</h3>
              <p className="text-sm text-gray-500 mb-4">
                将所有数据导出为 JSON 文件，可用于备份或迁移
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600"
                >
                  取消
                </button>
                <button
                  onClick={handleExport}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white"
                >
                  导出
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;