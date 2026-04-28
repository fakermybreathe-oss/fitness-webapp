import React, { useState, useEffect } from 'react';
import { Bell, Clock, X } from 'lucide-react';
import type { ReminderSettings } from '../../types';
import {
  requestNotificationPermission,
  getNotificationPermission,
} from '../../utils/notificationUtils';

interface ReminderSettingsFormProps {
  settings: ReminderSettings;
  onSave: (settings: ReminderSettings) => void;
  onCancel: () => void;
}

export const ReminderSettingsForm: React.FC<ReminderSettingsFormProps> = ({
  settings,
  onSave,
  onCancel,
}) => {
  const [enabled, setEnabled] = useState(settings.enabled);
  const [time, setTime] = useState(settings.time || '08:00');
  const [days, setDays] = useState<number[]>(settings.days || [1, 2, 3, 4, 5]);
  const [message, setMessage] = useState(settings.message || '时间到啦，该锻炼了！');
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>(
    getNotificationPermission()
  );

  const weekDays = [
    { value: 0, label: '日' },
    { value: 1, label: '一' },
    { value: 2, label: '二' },
    { value: 3, label: '三' },
    { value: 4, label: '四' },
    { value: 5, label: '五' },
    { value: 6, label: '六' },
  ];

  const toggleDay = (day: number) => {
    setDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermissionStatus(granted ? 'granted' : 'denied');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...settings,
      enabled,
      time,
      days,
      message,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">打卡提醒设置</h3>
          <p className="text-sm text-gray-500">设置训练提醒时间</p>
        </div>
        <button
          type="button"
          onClick={() => setEnabled(!enabled)}
          className={`w-12 h-7 rounded-full relative transition-colors ${
            enabled ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              enabled ? 'left-6' : 'left-1'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <>
          {/* Permission Status */}
          {permissionStatus !== 'granted' && (
            <div className="mb-4 p-3 bg-yellow-50 rounded-xl">
              {permissionStatus === 'denied' ? (
                <p className="text-sm text-yellow-700">
                  通知权限被拒绝，请在浏览器设置中允许通知
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  点击授权通知权限
                </button>
              )}
            </div>
          )}

          {/* Time Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-1" />
              提醒时间
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200
                focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                transition-all outline-none"
            />
          </div>

          {/* Days Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              重复日期
            </label>
            <div className="flex gap-2">
              {weekDays.map(day => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                    days.includes(day.value)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              提醒内容
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="设置提醒内容..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200
                focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                transition-all outline-none"
            />
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200
            text-gray-600 font-medium hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 rounded-xl bg-blue-500
            text-white font-medium hover:bg-blue-600 transition-colors"
        >
          保存设置
        </button>
      </div>
    </form>
  );
};

// Simple toast notification component
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type];

  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 ${bgColor} text-white
      px-6 py-3 rounded-full shadow-lg flex items-center gap-2 z-50`}>
      <Bell size={18} />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80">
        <X size={16} />
      </button>
    </div>
  );
};

export default ReminderSettingsForm;