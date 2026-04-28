import { describe, it, expect } from 'vitest'
import { calculateBMI, getBMICategory, recommendEquipment } from '../utils/recommendations'
import type { BodyData } from '../types'

describe('recommendations utils', () => {
  describe('calculateBMI', () => {
    it('should calculate BMI correctly for normal weight', () => {
      const bmi = calculateBMI(170, 65)
      expect(bmi).toBeCloseTo(22.5, 1)
    })

    it('should calculate BMI correctly for overweight', () => {
      const bmi = calculateBMI(170, 85)
      expect(bmi).toBeCloseTo(29.4, 1)
    })

    it('should calculate BMI correctly for underweight', () => {
      const bmi = calculateBMI(175, 55)
      expect(bmi).toBeCloseTo(18.0, 1)
    })

    it('should handle edge cases for height', () => {
      const bmi1 = calculateBMI(100, 50)
      expect(bmi1).toBeGreaterThan(0)

      const bmi2 = calculateBMI(250, 100)
      expect(bmi2).toBeLessThan(100)
    })
  })

  describe('getBMICategory', () => {
    it('should return 偏瘦 for BMI < 18.5', () => {
      expect(getBMICategory(15)).toBe('偏瘦')
      expect(getBMICategory(18.4)).toBe('偏瘦')
    })

    it('should return 正常 for BMI 18.5-24', () => {
      expect(getBMICategory(18.5)).toBe('正常')
      expect(getBMICategory(22)).toBe('正常')
      expect(getBMICategory(23.99)).toBe('正常')
    })

    it('should return 偏胖 for BMI 24-28', () => {
      expect(getBMICategory(24)).toBe('偏胖')
      expect(getBMICategory(26)).toBe('偏胖')
      expect(getBMICategory(27.99)).toBe('偏胖')
    })

    it('should return 肥胖 for BMI >= 28', () => {
      expect(getBMICategory(28.1)).toBe('肥胖')
      expect(getBMICategory(35)).toBe('肥胖')
    })
  })

  describe('recommendEquipment', () => {
    it('should recommend cardio equipment for weight-loss goal', () => {
      const bodyData: BodyData = {
        height: 170,
        weight: 80,
        age: 30,
        gender: 'male',
        goal: 'weight-loss',
        experience: 'beginner',
      }
      const equipment = recommendEquipment(bodyData)
      expect(equipment.length).toBeGreaterThan(0)
      expect(equipment.length).toBeLessThanOrEqual(6)
    })

    it('should recommend strength equipment for muscle-gain goal', () => {
      const bodyData: BodyData = {
        height: 175,
        weight: 65,
        age: 25,
        gender: 'male',
        goal: 'muscle-gain',
        experience: 'intermediate',
      }
      const equipment = recommendEquipment(bodyData)
      expect(equipment.length).toBeGreaterThan(0)
      const strengthCount = equipment.filter(eq => eq.category === 'strength').length
      expect(strengthCount).toBeGreaterThan(0)
    })

    it('should recommend cardio for high BMI (obese)', () => {
      const bodyData: BodyData = {
        height: 170,
        weight: 95,
        age: 35,
        gender: 'male',
        goal: 'weight-loss',
        experience: 'beginner',
      }
      const equipment = recommendEquipment(bodyData)
      const cardioCount = equipment.filter(eq => eq.category === 'cardio').length
      expect(cardioCount).toBe(equipment.length)
    })

    it('should recommend strength for low BMI (underweight)', () => {
      const bodyData: BodyData = {
        height: 180,
        weight: 60,
        age: 22,
        gender: 'male',
        goal: 'muscle-gain',
        experience: 'beginner',
      }
      const equipment = recommendEquipment(bodyData)
      const strengthCount = equipment.filter(eq => eq.category === 'strength').length
      expect(strengthCount).toBeGreaterThan(0)
    })

    it('should filter by difficulty for beginner', () => {
      const bodyData: BodyData = {
        height: 170,
        weight: 70,
        age: 40,
        gender: 'female',
        goal: 'body-shaping',
        experience: 'beginner',
      }
      const equipment = recommendEquipment(bodyData)
      const advancedCount = equipment.filter(eq => eq.difficulty === 'advanced').length
      expect(advancedCount).toBe(0)
    })

    it('should filter by difficulty for intermediate', () => {
      const bodyData: BodyData = {
        height: 170,
        weight: 70,
        age: 30,
        gender: 'female',
        goal: 'body-shaping',
        experience: 'intermediate',
      }
      const equipment = recommendEquipment(bodyData)
      const advancedCount = equipment.filter(eq => eq.difficulty === 'advanced').length
      expect(advancedCount).toBe(0)
    })

    it('should include advanced for experienced users', () => {
      const bodyData: BodyData = {
        height: 175,
        weight: 80,
        age: 28,
        gender: 'male',
        goal: 'muscle-gain',
        experience: 'advanced',
      }
      const equipment = recommendEquipment(bodyData)
      expect(equipment.length).toBeGreaterThan(0)
    })

    it('should return at most 6 equipment', () => {
      const bodyData: BodyData = {
        height: 175,
        weight: 75,
        age: 25,
        gender: 'male',
        goal: 'muscle-gain',
        experience: 'advanced',
      }
      const equipment = recommendEquipment(bodyData)
      expect(equipment.length).toBeLessThanOrEqual(6)
    })
  })
})