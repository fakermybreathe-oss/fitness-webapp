import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useApp } from '../../hooks/useAuth';
import type { User } from '../../types';
import { comparePassword } from '../../utils/password';
import { LogIn, Mail, Lock, Sparkles } from 'lucide-react';
import logger from '../../utils/logger';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const users: User[] = JSON.parse(localStorage.getItem('fitness_users') || '[]');
      const user = users.find((u) => u.email === formData.email);

      if (!user) {
        throw new Error('未找到该账户');
      }

      const isValid = await comparePassword(formData.password, user.password);
      if (!isValid) {
        throw new Error('密码错误');
      }

      handleLoginSuccess(user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (_credentialResponse: CredentialResponse) => {
    logger.info('Google Login Success');
    const users: User[] = JSON.parse(localStorage.getItem('fitness_users') || '[]');
    
    // 我们假设从 Google 获取到了这个静态邮箱（真实环境下应解码 JWT）
    const googleEmail = 'google_user@example.com'; 
    let user = users.find((u) => u.email === googleEmail);

    if (!user) {
      // 首次登录，自动注册
      user = {
        id: `google-${Math.random().toString(36).substr(2, 9)}`,
        email: googleEmail,
        username: 'Google 用户',
        password: '', 
        name: 'Google 用户',
        createdAt: new Date().toISOString(),
      };
      const newUsers = [...users, user];
      localStorage.setItem('fitness_users', JSON.stringify(newUsers));
      logger.info('Auto-registered new Google user');
    }

    handleLoginSuccess(user);
  };

  const handleLoginSuccess = (user: User) => {
    login(user);
    const bodyData = localStorage.getItem('fitness_body_data');
    navigate(bodyData ? '/dashboard' : '/body-data');
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900">
          欢迎 <br />
          <span className="text-brand-primary flex items-center gap-2">
            回来 <Sparkles size={24} />
          </span>
        </h1>
        <p className="text-slate-500 font-medium">继续您的健身之旅</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
            <input
              type="email"
              placeholder="邮箱地址"
              className="w-full h-14 pl-12 pr-4 glass-panel rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
            <input
              type="password"
              placeholder="登录密码"
              className="w-full h-14 pl-12 pr-4 glass-panel rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-red-500 text-xs font-bold text-center"
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-16 bg-slate-900 text-white rounded-3xl font-bold flex items-center justify-center gap-2 shadow-xl hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95"
        >
          {isLoading ? '登录中...' : '立即登录'}
          <LogIn size={20} />
        </button>
      </form>

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">或者</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <div className="flex flex-col gap-4 items-center">
        {import.meta.env.VITE_GOOGLE_CLIENT_ID?.includes('YOUR_GOOGLE') ? (
          <div className="w-full p-4 bg-orange-50 border border-orange-200 rounded-2xl flex flex-col gap-2">
            <p className="text-orange-700 text-xs font-bold flex items-center gap-2">
              ⚠️ Google 登录未配置
            </p>
            <p className="text-orange-600 text-[10px] leading-tight">
              请在 <code>.env</code> 中填入真实的 <code>VITE_GOOGLE_CLIENT_ID</code> 以激活此功能。
            </p>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google 登录失败')}
            text="signin_with"
            shape="circle"
            width="100%"
          />
        )}
      </div>

      <p className="text-center text-slate-500 text-sm font-medium">
        还没有账号?{' '}
        <Link to="/register" className="text-brand-primary font-bold hover:underline underline-offset-4">
          立即注册
        </Link>
      </p>
    </div>
  );
};

export default Login;
