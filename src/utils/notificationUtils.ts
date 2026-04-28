/**
 * 通知工具函数
 * 从 ReminderSettings.tsx 抽离，避免 react-refresh/only-export-components 警告
 */

/** 请求浏览器通知权限，返回是否授权成功 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

/** 发送系统通知 */
export const sendNotification = (title: string, body: string) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
    });
  }
};

/** 检测当前浏览器是否支持通知 API */
export const checkNotificationSupport = (): boolean => {
  return 'Notification' in window;
};

/** 获取当前通知权限状态 */
export const getNotificationPermission = (): NotificationPermission | 'unsupported' => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};
