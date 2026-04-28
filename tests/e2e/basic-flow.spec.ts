import { test, expect } from '@playwright/test';

test.describe('健身项目核心流程验证', () => {

  test('1. 首页加载与 UI 验证', async ({ page }) => {
    await page.goto('/');

    // 验证移动端容器
    const wrapper = page.locator('.mobile-wrapper');
    await expect(wrapper).toBeVisible();

    // 验证文字内容 (暖色调设计确认)
    await expect(page.locator('h1')).toContainText('重塑你的');
    await expect(page.locator('h1')).toContainText('完美身形');
  });

  test('2. 登录与保护路由跳转', async ({ page }) => {
    // 预注入模拟登录成功状态
    await page.addInitScript(() => {
      localStorage.setItem('fitness_user', JSON.stringify({
        id: 'test-user',
        username: 'testuser',
        name: '测试员',
        email: 'test@example.com'
      }));
      localStorage.setItem('fitness_body_data', JSON.stringify({ height: 170, weight: 65, goal: 'muscle-gain', experience: 'beginner', age: 25, gender: 'male' }));
    });

    await page.goto('/dashboard');
    // 使用 data-testid 选择器验证用户名
    await expect(page.getByTestId('dashboard-username')).toContainText('测试员');
    await expect(page.getByText('早上好,')).toBeVisible();
  });

  test('3. 底部导航与动效切换', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('fitness_user', JSON.stringify({ id: 'u1', name: '王小美', username: 'xiaomei' }));
      localStorage.setItem('fitness_body_data', JSON.stringify({ height: 170, weight: 65, goal: 'muscle-gain', experience: 'beginner', age: 25, gender: 'male' }));
    });

    await page.goto('/dashboard');

    // 点击"计划"导航 (使用更直接的 text 定位)
    await page.locator('nav').getByText('计划').click();

    // 验证页面切换时应进入 Plan 页面
    await expect(page.locator('h1')).toContainText('每周计划');

    // 验证动效容器
    const motionDiv = page.locator('main .px-6.pt-8');
    await expect(motionDiv).toBeVisible();
  });

  test('4. 健身器材库验证', async ({ page }) => {
     await page.addInitScript(() => {
       localStorage.setItem('fitness_user', JSON.stringify({ id: 'u1', name: '王小美', username: 'xiaomei' }));
       localStorage.setItem('fitness_body_data', JSON.stringify({ height: 170, weight: 65, goal: 'muscle-gain', experience: 'beginner', age: 25, gender: 'male' }));
       localStorage.setItem('fitness_equipment', JSON.stringify([
         {
           id: 'eq1',
           name: '哑铃',
           nameEn: 'Dumbbells',
           category: 'strength',
           targetMuscles: ['手臂', '肩膀'],
           difficulty: 'beginner',
           imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f',
           usage: ['训练手臂力量'],
           tips: ['保持正确姿势'],
           recommendedFor: ['muscle-gain']
         }
       ]));
     });

     await page.goto('/equipment');
     await expect(page.locator('h1')).toContainText('器材库');
     // 使用更精确的选择器，因为页面可能有多个"哑铃"文本
     await expect(page.getByRole('heading', { name: '哑铃' })).toBeVisible();
  });

  test('5. 进度页面验证', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('fitness_user', JSON.stringify({ id: 'u1', name: '王小美', username: 'xiaomei' }));
      localStorage.setItem('fitness_body_data', JSON.stringify({ height: 170, weight: 65, goal: 'muscle-gain', experience: 'beginner', age: 25, gender: 'male' }));
      localStorage.setItem('fitness_weight_history', JSON.stringify([
        { id: 'w1', userId: 'u1', weight: 65, date: '2024-01-01', bmi: 22.5 },
        { id: 'w2', userId: 'u1', weight: 64, date: '2024-01-08', bmi: 22.1 }
      ]));
      localStorage.setItem('fitness_training_logs', JSON.stringify([
        { id: 't1', userId: 'u1', date: '2024-01-15', planId: 'p1', dayIndex: 0, exercises: [], duration: 45, caloriesBurned: 300, completed: true }
      ]));
    });

    await page.goto('/progress');
    await expect(page.locator('h1')).toContainText('训练进度');
    // 验证进度页面的打卡入口
    await expect(page.getByText('今日打卡').or(page.getByText('今日已打卡'))).toBeVisible();
  });

  test('6. 打卡页面验证', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('fitness_user', JSON.stringify({ id: 'u1', name: '王小美', username: 'xiaomei' }));
      localStorage.setItem('fitness_body_data', JSON.stringify({ height: 170, weight: 65, goal: 'muscle-gain', experience: 'beginner', age: 25, gender: 'male' }));
      localStorage.setItem('fitness_plan', JSON.stringify({
        id: 'plan-1',
        userId: 'u1',
        name: 'Test Plan',
        frequency: 3,
        days: [
          { dayName: '周一', focus: 'chest', exercises: [
            { exerciseId: 'eq1', name: '哑铃卧推', sets: 3, reps: 12, rest: 60 }
          ]}
        ]
      }));
    });

    await page.goto('/checkin');
    // 验证打卡页面元素存在
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // 验证快速打卡按钮存在 (使用精确的 role 选择器)
    await expect(page.getByRole('heading', { name: '快速打卡' })).toBeVisible();
    // 验证详细训练打卡选项存在
    await expect(page.getByText('详细训练打卡')).toBeVisible();
  });

  test('6.1 快速打卡功能验证', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('fitness_user', JSON.stringify({ id: 'u1', name: '王小美', username: 'xiaomei' }));
      localStorage.setItem('fitness_body_data', JSON.stringify({ height: 170, weight: 65, goal: 'muscle-gain', experience: 'beginner', age: 25, gender: 'male' }));
      localStorage.setItem('fitness_plan', JSON.stringify({
        id: 'plan-1',
        userId: 'u1',
        name: 'Test Plan',
        frequency: 3,
        days: [
          { dayName: '周一', focus: 'chest', exercises: [{ exerciseId: 'eq1', name: '哑铃卧推', sets: 3, reps: 12, rest: 60 }]},
          { dayName: '周二', focus: 'back', exercises: [{ exerciseId: 'eq2', name: '引体向上', sets: 3, reps: 10, rest: 90 }]}
        ]
      }));
    });

    await page.goto('/checkin');

    // 使用 data-testid 点击快速打卡按钮
    await page.getByTestId('quick-checkin-btn').click();

    // 验证确认弹窗出现 (使用精确的 role 选择器)
    await expect(page.getByRole('heading', { name: '确认打卡' })).toBeVisible();
    await expect(page.getByText('标记今日训练完成?')).toBeVisible();

    // 确认打卡
    await page.getByRole('button', { name: '确认打卡' }).click();

    // 验证打卡成功弹窗
    await expect(page.getByText('打卡成功!')).toBeVisible();
  });

  test('6.2 Dashboard打卡状态显示', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('fitness_user', JSON.stringify({ id: 'u1', name: '王小美', username: 'xiaomei' }));
      localStorage.setItem('fitness_body_data', JSON.stringify({ height: 170, weight: 65, goal: 'muscle-gain', experience: 'beginner', age: 25, gender: 'male' }));
      localStorage.setItem('fitness_training_logs', JSON.stringify([
        { id: 't1', userId: 'u1', date: new Date().toISOString().split('T')[0], planId: 'p1', dayIndex: 0, exercises: [], duration: 45, caloriesBurned: 300, completed: true }
      ]));
    });

    await page.goto('/dashboard');

    // 验证已打卡状态显示
    await expect(page.getByText('已打卡')).toBeVisible();
  });

  test('7. 设置页面验证', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('fitness_user', JSON.stringify({ id: 'u1', name: '王小美', username: 'xiaomei' }));
      localStorage.setItem('fitness_body_data', JSON.stringify({ height: 170, weight: 65, goal: 'muscle-gain', experience: 'beginner', age: 25, gender: 'male' }));
      localStorage.setItem('fitness_reminders', JSON.stringify([
        { id: 'r1', userId: 'u1', enabled: true, time: '08:00', days: [1,2,3,4,5], message: '时间到啦，该锻炼了！', soundEnabled: true }
      ]));
    });

    await page.goto('/settings');
    await expect(page.locator('h1')).toContainText('设置');

    // 验证打卡提醒设置可见
    await expect(page.getByText('打卡提醒')).toBeVisible();
  });

  test('8. 导航完整性测试', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('fitness_user', JSON.stringify({ id: 'u1', name: '王小美', username: 'xiaomei' }));
      localStorage.setItem('fitness_body_data', JSON.stringify({ height: 170, weight: 65, goal: 'muscle-gain', experience: 'beginner', age: 25, gender: 'male' }));
    });

    await page.goto('/dashboard');

    // 测试所有导航项
    const navItems = ['计划', '进度', '器材', '我的'];

    for (const item of navItems) {
      await page.locator('nav').getByText(item).click();
      await page.waitForTimeout(500);
    }

    // 最后回到首页
    await page.locator('nav').getByText('首页').click();
    await expect(page.getByTestId('dashboard-username')).toContainText('王小美');
  });

  test('9. Dashboard 日历图标导航测试', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('fitness_user', JSON.stringify({ id: 'u1', name: '王小美', username: 'xiaomei' }));
      localStorage.setItem('fitness_body_data', JSON.stringify({ height: 170, weight: 65, goal: 'muscle-gain', experience: 'beginner', age: 25, gender: 'male' }));
      localStorage.setItem('fitness_plan', JSON.stringify({
        id: 'plan-1',
        userId: 'u1',
        name: 'Test Plan',
        frequency: 3,
        days: [{ dayName: '周一', focus: 'chest', exercises: [{ exerciseId: 'eq1', name: '哑铃卧推', sets: 3, reps: 12, rest: 60 }]}]
      }));
    });

    await page.goto('/dashboard');

    // 点击日历图标
    await page.getByTestId('calendar-icon').click();

    // 验证跳转到打卡页面
    await expect(page).toHaveURL('/checkin');
    await expect(page.getByRole('heading', { name: '快速打卡' })).toBeVisible();
  });

  test('10. Progress 打卡入口测试', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('fitness_user', JSON.stringify({ id: 'u1', name: '王小美', username: 'xiaomei' }));
      localStorage.setItem('fitness_body_data', JSON.stringify({ height: 170, weight: 65, goal: 'muscle-gain', experience: 'beginner', age: 25, gender: 'male' }));
      localStorage.setItem('fitness_plan', JSON.stringify({
        id: 'plan-1',
        userId: 'u1',
        name: 'Test Plan',
        frequency: 3,
        days: [{ dayName: '周一', focus: 'chest', exercises: [{ exerciseId: 'eq1', name: '哑铃卧推', sets: 3, reps: 12, rest: 60 }]}]
      }));
    });

    await page.goto('/progress');

    // 点击今日打卡按钮
    await page.getByRole('button', { name: '今日打卡' }).click();

    // 验证跳转到打卡页面
    await expect(page).toHaveURL('/checkin');
  });
});