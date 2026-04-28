import { describe, it, expect } from 'vitest'
import { generateWeeklyPlan } from '../data/workoutPlans'
import type { BodyData } from '../types'

describe('workoutPlans', () => {
  describe('generateWeeklyPlan', () => {
    it('should generate a 7-day plan regardless of frequency', () => {
      const bodyData: BodyData = {
        height: 170,
        weight: 70,
        age: 30,
        gender: 'male',
        goal: 'body-shaping',
        experience: 'beginner',
        frequency: 3
      }
      const plan = generateWeeklyPlan(bodyData)
      expect(plan.days.length).toBe(7)
      
      // 验证其中包含 3 天训练日 (根据新逻辑，训练日 exercises 不为空)
      const workoutDays = plan.days.filter(d => d.exercises.length > 0)
      expect(workoutDays.length).toBe(3)
    })

    it('should generate more workout days for high frequency', () => {
      const bodyData: BodyData = {
        height: 175,
        weight: 75,
        age: 28,
        gender: 'male',
        goal: 'muscle-gain',
        experience: 'intermediate',
        frequency: 5
      }
      const plan = generateWeeklyPlan(bodyData)
      const workoutDays = plan.days.filter(d => d.exercises.length > 0)
      expect(workoutDays.length).toBe(5)
    })

    it('should apply correct parameters for muscle-gain goal', () => {
      const bodyData: BodyData = {
        height: 178,
        weight: 80,
        age: 25,
        gender: 'male',
        goal: 'muscle-gain',
        experience: 'advanced',
        frequency: 5
      }
      const plan = generateWeeklyPlan(bodyData)
      const firstWorkoutDay = plan.days.find(d => d.exercises.length > 1) 
      const exercise = firstWorkoutDay?.exercises.find(ex => ex.id.startsWith('ex-') && !ex.id.includes('warmup') && !ex.id.includes('cardio'))
      
      expect(exercise?.reps).toBe('8-12')
      expect(exercise?.sets).toBe(4)
    })

    it('should apply correct parameters for weight-loss goal', () => {
      const bodyData: BodyData = {
        height: 165,
        weight: 85,
        age: 35,
        gender: 'female',
        goal: 'weight-loss',
        experience: 'beginner',
        frequency: 3
      }
      const plan = generateWeeklyPlan(bodyData)
      const firstWorkoutDay = plan.days.find(d => d.exercises.length > 1)
      const exercise = firstWorkoutDay?.exercises.find(ex => ex.id.startsWith('ex-') && !ex.id.includes('warmup') && !ex.id.includes('cardio'))
      
      expect(exercise?.reps).toBe('15-20')
      expect(exercise?.sets).toBe(3)
      
      // 减脂日应该包含有氧
      const hasCardio = firstWorkoutDay?.exercises.some(ex => 
        ex.name.includes('开合跳') || ex.name.includes('登山者') || ex.name.includes('跳绳')
      )
      expect(hasCardio).toBe(true)
    })

    it('should generate random plans for same body data', () => {
      const bodyData: BodyData = {
        height: 170,
        weight: 70,
        age: 30,
        gender: 'male',
        goal: 'body-shaping',
        experience: 'beginner',
        frequency: 3
      }
      const plan1 = generateWeeklyPlan(bodyData)
      const plan2 = generateWeeklyPlan(bodyData)
      
      // 由于有随机性，动作列表不应该完全一致
      const getNames = (p: any) => p.days.flatMap((d: any) => d.exercises.map((e: any) => e.name)).join(',')
      expect(getNames(plan1)).not.toBe(getNames(plan2))
    })
  })
})