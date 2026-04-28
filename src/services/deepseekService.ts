/**
 * DeepSeek API Service
 * 用于生成健身器材的专业建议和科学锻炼参数
 */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

export interface EquipmentAdvice {
  usage: string[];
  tips: string[];
  scientificData: {
    sets: number;
    reps: number;
    duration?: string;
  };
  visualPrompt: string; // 用于生成简图的 Prompt
}

export const getEquipmentAdvice = async (equipmentName: string): Promise<EquipmentAdvice> => {
  if (!API_KEY) {
    console.warn('DeepSeek API Key is missing. Returning mock data.');
    return getMockAdvice(equipmentName);
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位资深健身教练。请为指定的健身器材提供科学的训练建议。输出格式必须为 JSON，包含 usage (数组), tips (数组), scientificData (对象: sets, reps, duration), visualPrompt (用于生成极简 3D 简图的英文关键词)。',
          },
          {
            role: 'user',
            content: `器材名称: ${equipmentName}`,
          },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content) as EquipmentAdvice;
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    return getMockAdvice(equipmentName);
  }
};

/**
 * 后备 Mock 数据，确保在无网络或无 Key 时应用依然可用
 */
const getMockAdvice = (name: string): EquipmentAdvice => {
  return {
    usage: [`正确调整${name}的初始位置`, `保持核心收紧，缓慢开始`, `注意呼吸节奏`],
    tips: [`建议在专业教练指导下使用`, `注意保护关节`],
    scientificData: {
      sets: 4,
      reps: 12,
      duration: '45s',
    },
    visualPrompt: `minimalist 3D isometric line art of ${name}, white background, blueprint style`,
  };
};
