import { test, expect } from '@playwright/test';

test.describe('器材库功能测试', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('fitness_user', JSON.stringify({ id: 'u1', name: '测试员', username: 'testuser' }));
      localStorage.setItem('fitness_body_data', JSON.stringify({ height: 170, weight: 65, goal: 'muscle-gain', experience: 'beginner', age: 25, gender: 'male' }));
    });
  });

  test('1. 器材库页面加载并显示所有器材', async ({ page }) => {
    await page.goto('/equipment');
    await expect(page.locator('h1')).toContainText('器材库');
    const countText = await page.getByTestId('equipment-count').textContent() || '';
    const count = parseInt(countText, 10);
    expect(count).toBeGreaterThan(0);
  });

  test('2. 按力量分类筛选', async ({ page }) => {
    await page.goto('/equipment');
    await page.getByTestId('cat-strength').click();
    await expect(page.getByTestId('equipment-count')).toContainText(/^\d+/);
  });

  test('3. 按有氧分类筛选', async ({ page }) => {
    await page.goto('/equipment');
    await page.getByTestId('cat-cardio').click();
    await expect(page.getByTestId('equipment-count')).toContainText(/^\d+/);
  });

  test('4. 搜索器材 - 按中文名称', async ({ page }) => {
    await page.goto('/equipment');
    const searchInput = page.getByTestId('equipment-search');
    await searchInput.fill('杠铃');
    await page.waitForTimeout(300);
    await expect(page.getByTestId('equipment-count')).toContainText(/^\d+/);
    await expect(page.getByTestId('equipment-card').first()).toBeVisible();
  });

  test('5. 搜索器材 - 按英文名称', async ({ page }) => {
    await page.goto('/equipment');
    const searchInput = page.getByTestId('equipment-search');
    await searchInput.fill('dumbbell');
    await page.waitForTimeout(300);
    await expect(page.getByTestId('equipment-card').first()).toBeVisible();
  });

  test('6. 查看器材详情', async ({ page }) => {
    await page.goto('/equipment');
    await page.getByTestId('equipment-card').first().click();
    await expect(page.getByTestId('equipment-modal')).toBeVisible();
    await expect(page.getByTestId('equipment-modal-name')).toBeVisible();
    await expect(page.getByTestId('equipment-usage-section')).toBeVisible();
    await expect(page.getByTestId('equipment-tips-section')).toBeVisible();
  });

  test('7. 关闭器材详情弹窗', async ({ page }) => {
    await page.goto('/equipment');
    await page.getByTestId('equipment-card').first().click();
    await expect(page.getByTestId('equipment-modal')).toBeVisible();
    await page.getByTestId('equipment-modal-close').click();
    await expect(page.getByTestId('equipment-modal')).not.toBeVisible();
  });

  test('8. 推荐器材区显示', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('fitness_equipment', JSON.stringify([
        { id: 'eq1', name: '哑铃', nameEn: 'Dumbbells', category: 'strength', targetMuscles: ['手臂'], difficulty: 'beginner', imageUrl: '/images/equipment/dumbbells_clean.svg', usage: ['test'], tips: ['test'], recommendedFor: ['muscle-gain'] },
        { id: 'eq2', name: '杠铃', nameEn: 'Barbell', category: 'strength', targetMuscles: ['全身'], difficulty: 'intermediate', imageUrl: '/images/equipment/barbell_clean.svg', usage: ['test'], tips: ['test'], recommendedFor: ['muscle-gain'] },
      ]));
    });
    await page.goto('/equipment');
    await expect(page.getByTestId('recommended-section')).toBeVisible();
  });

  test('9. 无搜索结果时显示空状态', async ({ page }) => {
    await page.goto('/equipment');
    const searchInput = page.getByTestId('equipment-search');
    await searchInput.fill('xyz不存在的器材123');
    await page.waitForTimeout(300);
    await expect(page.getByTestId('equipment-empty')).toBeVisible();
  });
});
