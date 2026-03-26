/**
 * Unit Tests for FunnelStreams.com Price Plan Calculator Tools
 * Tests all 5 price plan calculator MCP tools
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { PricePlanCalculatorTools, isPricePlanCalculatorTool } from '../../src/tools/price-plan-calculator-tools.js';

describe('PricePlanCalculatorTools', () => {
  let calculator: PricePlanCalculatorTools;

  beforeEach(() => {
    calculator = new PricePlanCalculatorTools();
  });

  describe('getTools', () => {
    it('should return 5 tool definitions', () => {
      const tools = calculator.getTools();
      expect(tools).toHaveLength(5);
    });

    it('should return correct tool names', () => {
      const tools = calculator.getTools();
      const toolNames = tools.map((tool) => tool.name);
      expect(toolNames).toEqual([
        'funnelstreams_get_plans',
        'funnelstreams_get_addons',
        'funnelstreams_calculate_price',
        'funnelstreams_compare_plans',
        'funnelstreams_recommend_plan',
      ]);
    });

    it('should have proper schema definitions for all tools', () => {
      const tools = calculator.getTools();
      tools.forEach((tool) => {
        expect(tool.name).toBeDefined();
        expect(tool.description).toBeDefined();
        expect(tool.inputSchema).toBeDefined();
        expect(tool.inputSchema.type).toBe('object');
      });
    });
  });

  describe('isPricePlanCalculatorTool', () => {
    it('should return true for valid tool names', () => {
      expect(isPricePlanCalculatorTool('funnelstreams_get_plans')).toBe(true);
      expect(isPricePlanCalculatorTool('funnelstreams_get_addons')).toBe(true);
      expect(isPricePlanCalculatorTool('funnelstreams_calculate_price')).toBe(true);
      expect(isPricePlanCalculatorTool('funnelstreams_compare_plans')).toBe(true);
      expect(isPricePlanCalculatorTool('funnelstreams_recommend_plan')).toBe(true);
    });

    it('should return false for invalid tool names', () => {
      expect(isPricePlanCalculatorTool('unknown_tool')).toBe(false);
      expect(isPricePlanCalculatorTool('create_contact')).toBe(false);
    });
  });

  describe('executePricePlanCalculatorTool - error handling', () => {
    it('should throw error for unknown tool', async () => {
      await expect(
        calculator.executePricePlanCalculatorTool('unknown_tool', {})
      ).rejects.toThrow('Unknown price plan calculator tool: unknown_tool');
    });
  });

  // ===== funnelstreams_get_plans =====

  describe('funnelstreams_get_plans', () => {
    it('should return all plans', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_get_plans', {});

      expect(result.success).toBe(true);
      expect(result.plans).toHaveLength(3);
      expect(result.message).toContain('3');
    });

    it('should return plans with correct IDs', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_get_plans', {});
      const planIds = result.plans.map((p: any) => p.id);
      expect(planIds).toEqual(['starter', 'professional', 'enterprise']);
    });

    it('should include pricing details with annual savings', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_get_plans', {});
      const starter = result.plans[0];

      expect(starter.pricing.monthly).toBe(97);
      expect(starter.pricing.annual).toBe(970);
      expect(starter.pricing.annualSavings).toBeGreaterThan(0);
      expect(starter.pricing.annualSavingsPercent).toBeGreaterThan(0);
      expect(starter.pricing.annualMonthlyEquivalent).toBeLessThan(starter.pricing.monthly);
    });

    it('should include features and limits for each plan', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_get_plans', {});

      for (const plan of result.plans) {
        expect(plan.features).toBeDefined();
        expect(Array.isArray(plan.features)).toBe(true);
        expect(plan.features.length).toBeGreaterThan(0);
        expect(plan.limits).toBeDefined();
        expect(plan.limits.contacts).toBeDefined();
        expect(plan.limits.users).toBeDefined();
      }
    });

    it('should show Enterprise plan has more features than Starter', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_get_plans', {});
      const starter = result.plans[0];
      const enterprise = result.plans[2];

      const starterIncluded = starter.features.filter((f: any) => f.included).length;
      const enterpriseIncluded = enterprise.features.filter((f: any) => f.included).length;
      expect(enterpriseIncluded).toBeGreaterThan(starterIncluded);
    });
  });

  // ===== funnelstreams_get_addons =====

  describe('funnelstreams_get_addons', () => {
    it('should return all add-ons', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_get_addons', {});

      expect(result.success).toBe(true);
      expect(result.addOns).toBeDefined();
      expect(result.addOns.length).toBeGreaterThan(0);
    });

    it('should include required fields for each add-on', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_get_addons', {});

      for (const addOn of result.addOns) {
        expect(addOn.id).toBeDefined();
        expect(addOn.name).toBeDefined();
        expect(addOn.monthlyPrice).toBeDefined();
        expect(typeof addOn.monthlyPrice).toBe('number');
        expect(addOn.description).toBeDefined();
      }
    });
  });

  // ===== funnelstreams_calculate_price =====

  describe('funnelstreams_calculate_price', () => {
    it('should calculate basic monthly price for starter plan', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_calculate_price', {
        planId: 'starter',
      });

      expect(result.success).toBe(true);
      expect(result.plan.id).toBe('starter');
      expect(result.billingCycle).toBe('monthly');
      expect(result.totals.monthlyTotal).toBe(97);
    });

    it('should calculate annual pricing with savings', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_calculate_price', {
        planId: 'professional',
        billingCycle: 'annual',
      });

      expect(result.success).toBe(true);
      expect(result.billingCycle).toBe('annual');
      expect(result.totals.annualTotal).toBe(2970);
      expect(result.totals.annualSavings).toBeGreaterThan(0);
      expect(result.totals.monthlyTotal).toBeLessThan(297);
    });

    it('should include add-ons in total price', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_calculate_price', {
        planId: 'starter',
        addOnIds: ['priority_support'],
      });

      expect(result.success).toBe(true);
      expect(result.breakdown.addOns).toHaveLength(1);
      expect(result.breakdown.addOnsTotal).toBe(49);
      expect(result.totals.monthlyTotal).toBe(97 + 49);
    });

    it('should calculate contact overage costs', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_calculate_price', {
        planId: 'starter',
        additionalContacts: 7000,
      });

      expect(result.success).toBe(true);
      expect(result.breakdown.contactOverage).toBeDefined();
      expect(result.breakdown.contactOverage.blocks).toBe(2); // 7000/5000 = 2 blocks
      expect(result.breakdown.contactOverage.total).toBe(50); // 2 * $25
      expect(result.totals.monthlyTotal).toBe(97 + 50);
    });

    it('should calculate user overage costs', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_calculate_price', {
        planId: 'starter',
        additionalUsers: 4,
      });

      expect(result.success).toBe(true);
      expect(result.breakdown.userOverage).toBeDefined();
      expect(result.breakdown.userOverage.blocks).toBe(2); // 4/3 = 2 blocks
      expect(result.breakdown.userOverage.total).toBe(58); // 2 * $29
    });

    it('should combine all cost components', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_calculate_price', {
        planId: 'professional',
        addOnIds: ['priority_support', 'advanced_reporting'],
        additionalContacts: 5000,
        additionalUsers: 3,
      });

      expect(result.success).toBe(true);
      const expected = 297 + 49 + 39 + 25 + 29; // base + priority + reporting + 1 contact block + 1 user block
      expect(result.totals.monthlyTotal).toBe(expected);
    });

    it('should throw error for unknown plan', async () => {
      await expect(
        calculator.executePricePlanCalculatorTool('funnelstreams_calculate_price', {
          planId: 'nonexistent',
        })
      ).rejects.toThrow('Unknown plan: nonexistent');
    });

    it('should throw error for unknown add-on', async () => {
      await expect(
        calculator.executePricePlanCalculatorTool('funnelstreams_calculate_price', {
          planId: 'starter',
          addOnIds: ['nonexistent_addon'],
        })
      ).rejects.toThrow('Unknown add-on: nonexistent_addon');
    });

    it('should show effective limits with overages', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_calculate_price', {
        planId: 'starter',
        additionalContacts: 10000,
        additionalUsers: 6,
      });

      expect(result.effectiveLimits.contacts).toBe(5000 + 10000); // base + 2 blocks * 5000
      expect(result.effectiveLimits.users).toBe(1 + 6); // base + 2 blocks * 3
    });

    it('should return null for overage fields when no overage', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_calculate_price', {
        planId: 'starter',
      });

      expect(result.breakdown.contactOverage).toBeNull();
      expect(result.breakdown.userOverage).toBeNull();
    });
  });

  // ===== funnelstreams_compare_plans =====

  describe('funnelstreams_compare_plans', () => {
    it('should compare all plans when no IDs provided', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_compare_plans', {});

      expect(result.success).toBe(true);
      expect(result.plans).toHaveLength(3);
      expect(result.featureComparison).toBeDefined();
      expect(result.featureComparison.length).toBeGreaterThan(0);
      expect(result.limitsComparison).toBeDefined();
    });

    it('should compare specific plans', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_compare_plans', {
        planIds: ['starter', 'enterprise'],
      });

      expect(result.success).toBe(true);
      expect(result.plans).toHaveLength(2);
      expect(result.plans[0].id).toBe('starter');
      expect(result.plans[1].id).toBe('enterprise');
    });

    it('should include feature comparison matrix', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_compare_plans', {
        planIds: ['starter', 'professional'],
      });

      expect(result.featureComparison.length).toBeGreaterThan(0);

      for (const row of result.featureComparison) {
        expect(row.feature).toBeDefined();
        expect(row.starter).toBeDefined();
        expect(row.professional).toBeDefined();
        expect(typeof row.starter.included).toBe('boolean');
      }
    });

    it('should include limits comparison', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_compare_plans', {});

      expect(result.limitsComparison.contacts).toBeDefined();
      expect(result.limitsComparison.users).toBeDefined();
      expect(result.limitsComparison.funnels).toBeDefined();
      expect(result.limitsComparison.apiAccess).toBeDefined();
    });

    it('should show unlimited as string for unlimited limits', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_compare_plans', {});

      expect(result.limitsComparison.funnels.enterprise).toBe('Unlimited');
      expect(result.limitsComparison.websites.enterprise).toBe('Unlimited');
    });

    it('should throw error for unknown plan ID', async () => {
      await expect(
        calculator.executePricePlanCalculatorTool('funnelstreams_compare_plans', {
          planIds: ['starter', 'nonexistent'],
        })
      ).rejects.toThrow('Unknown plan: nonexistent');
    });
  });

  // ===== funnelstreams_recommend_plan =====

  describe('funnelstreams_recommend_plan', () => {
    it('should recommend starter plan for basic needs', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_recommend_plan', {});

      expect(result.success).toBe(true);
      expect(result.recommendation.planId).toBe('starter');
      expect(result.recommendation.planName).toBe('Starter');
      expect(result.reasons).toBeDefined();
      expect(result.reasons.length).toBeGreaterThan(0);
    });

    it('should recommend professional for workflow needs', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_recommend_plan', {
        needsWorkflows: true,
      });

      expect(result.recommendation.planId).toBe('professional');
    });

    it('should recommend professional for API access', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_recommend_plan', {
        needsApiAccess: true,
      });

      expect(result.recommendation.planId).toBe('professional');
    });

    it('should recommend enterprise for white-label', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_recommend_plan', {
        needsWhiteLabel: true,
      });

      expect(result.recommendation.planId).toBe('enterprise');
    });

    it('should recommend professional for >5000 contacts', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_recommend_plan', {
        expectedContacts: 10000,
      });

      expect(result.recommendation.planId).toBe('professional');
    });

    it('should recommend enterprise for >25000 contacts', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_recommend_plan', {
        expectedContacts: 30000,
      });

      expect(result.recommendation.planId).toBe('enterprise');
    });

    it('should recommend professional for >1 user', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_recommend_plan', {
        expectedUsers: 3,
      });

      expect(result.recommendation.planId).toBe('professional');
    });

    it('should recommend enterprise for >5 users', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_recommend_plan', {
        expectedUsers: 10,
      });

      expect(result.recommendation.planId).toBe('enterprise');
    });

    it('should suggest email add-on when volume exceeds plan limit', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_recommend_plan', {
        monthlyEmailVolume: 100000,
        needsWorkflows: true,
      });

      expect(result.suggestedAddOns).toBeDefined();
      expect(result.suggestedAddOns.some((a: string) => a.includes('extra_emails_25k'))).toBe(true);
    });

    it('should suggest SMS add-on when volume exceeds plan limit', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_recommend_plan', {
        monthlySmsVolume: 5000,
        needsWorkflows: true,
      });

      expect(result.suggestedAddOns).toBeDefined();
      expect(result.suggestedAddOns.some((a: string) => a.includes('extra_sms_1k'))).toBe(true);
    });

    it('should include budget analysis when budget is provided', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_recommend_plan', {
        budget: 500,
      });

      expect(result.budgetAnalysis).toBeDefined();
      expect(result.budgetAnalysis.withinBudget).toBe(true);
    });

    it('should flag when estimated cost exceeds budget', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_recommend_plan', {
        needsWhiteLabel: true,
        budget: 100,
      });

      expect(result.budgetAnalysis).toBeDefined();
      expect(result.budgetAnalysis.withinBudget).toBe(false);
      expect(result.budgetAnalysis.note).toContain('exceeds');
    });

    it('should include annual savings tip', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_recommend_plan', {});

      expect(result.tip).toBeDefined();
      expect(result.tip).toContain('Save');
    });

    it('should provide estimated costs', async () => {
      const result = await calculator.executePricePlanCalculatorTool('funnelstreams_recommend_plan', {
        needsWorkflows: true,
        expectedContacts: 30000,
      });

      expect(result.estimatedMonthlyCost).toBeDefined();
      expect(result.estimatedAnnualCost).toBeDefined();
      expect(typeof result.estimatedMonthlyCost).toBe('number');
      expect(result.estimatedMonthlyCost).toBeGreaterThan(0);
    });
  });
});
