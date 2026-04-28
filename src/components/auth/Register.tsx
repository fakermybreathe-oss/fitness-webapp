import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../hooks/useAuth';
import { hashPassword } from '../../utils/password';
import type { User } from '../../types';
import { UserPlus, Mail, Lock, User as UserIcon, ArrowLeft } from 'lucide-react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import logger from '../../utils/logger';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) newErrors.username = '请输入用户名';
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少6位';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次密码不一致';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      const users: User[] = JSON.parse(localStorage.getItem('fitness_users') || '[]');
      const existingUser = users.find((u) => u.email === formData.email);
      if (existingUser) {
        setErrors({ email: '该邮箱已注册' });
        return;
      }

      const hashedPassword = await hashPassword(formData.password);
      const newUser: User = {
        id: `user-${Date.now()}`,
        username: formData.username,
        name: formData.username,
        email: formData.email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      };

      const newUsers = [...users, newUser];
      localStorage.setItem('fitness_users', JSON.stringify(newUsers));
      login(newUser);
      navigate('/body-data');
    } catch (_err: unknown) {
      setErrors({ submit: '注册失败，请稍后重试' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (_credentialResponse: CredentialResponse) => {
    logger.info('Google Registration/Login Success');
    const users: User[] = JSON.parse(localStorage.getItem('fitness_users') || '[]');
    
    // 静态 mock 邮箱
    const googleEmail = 'google_user@example.com'; 
    let user = users.find((u) => u.email === googleEmail);

    if (!user) {
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
      logger.info('Auto-registered new Google user via Register Page');
    }

    login(user);
    navigate('/body-data');
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
         <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-slate-400">
            <ArrowLeft size={18} />
         </button>
         <Link to="/login" className="text-brand-primary font-bold text-xs uppercase tracking-widest">登录</Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900">
          加入 <br />
          <span className="text-brand-primary">智健助手</span>
        </h1>
        <p className="text-slate-500 font-medium">定制您的专属健身计划</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-4">
          <div className="relative group">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
            <input
              type="text"
              placeholder="您的姓名"
              className={`w-full h-14 pl-12 pr-4 glass-panel rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium ${errors.username ? 'ring-2 ring-red-500/20' : ''}`}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
            <input
              type="email"
              placeholder="邮箱地址"
              className={`w-full h-14 pl-12 pr-4 glass-panel rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium ${errors.email ? 'ring-2 ring-red-500/20' : ''}`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
            <input
              type="password"
              placeholder="创建密码"
              className={`w-full h-14 pl-12 pr-4 glass-panel rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium ${errors.password ? 'ring-2 ring-red-500/20' : ''}`}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
            <input
              type="password"
              placeholder="确认密码"
              className={`w-full h-14 pl-12 pr-4 glass-panel rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium ${errors.confirmPassword ? 'ring-2 ring-red-500/20' : ''}`}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>
        </div>

        {Object.values(errors).map((err, i) => (
          <p key={i} className="text-red-500 text-[10px] font-bold text-center uppercase tracking-wider">{err}</p>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-16 bg-slate-900 text-white rounded-3xl font-bold flex items-center justify-center gap-2 shadow-xl hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95 mt-4"
        >
          {isLoading ? '注册中...' : '开启旅程'}
          <UserPlus size={20} />
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
              ⚠️ 快速注册未配置
            </p>
            <p className="text-orange-600 text-[10px] leading-tight">
              请在 <code>.env</code> 中填入真实的 <code>VITE_GOOGLE_CLIENT_ID</code>。
            </p>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setErrors({ submit: 'Google 注册失败' })}
            text="signup_with"
            shape="circle"
            width="100%"
          />
        )}
      </div>

      <p className="text-center text-slate-400 text-xs px-8 leading-relaxed">
        注册即表示您同意我们的 <span className="text-slate-600 font-bold">服务条款</span> 和 <span className="text-slate-600 font-bold">隐私政策</span>
      </p>
    </div>
  );
};

export default Register;
