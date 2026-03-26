import { Tool } from '@modelcontextprotocol/sdk/types.js';

/**
 * FunnelStreams.com Price Plan Calculator
 *
 * Provides tools to calculate, compare, and recommend pricing plans
 * for FunnelStreams.com services powered by GoHighLevel.
 */

// ===== PLAN DATA =====

export interface PlanTier {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: PlanFeature[];
  limits: PlanLimits;
}

export interface PlanFeature {
  name: string;
  included: boolean;
  details?: string;
}

export interface PlanLimits {
  contacts: number;
  users: number;
  funnels: number;
  websites: number;
  workflows: number;
  emailsPerMonth: number;
  smsCreditsPerMonth: number;
  customDomains: number;
  apiAccess: boolean;
  whiteLabel: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  monthlyPrice: number;
  description: string;
  unit?: string;
}

export interface CalculatorParams {
  planId?: string;
  billingCycle?: 'monthly' | 'annual';
  addOnIds?: string[];
  additionalContacts?: number;
  additionalUsers?: number;
}

export interface CompareParams {
  planIds?: string[];
}

export interface RecommendParams {
  expectedContacts?: number;
  expectedUsers?: number;
  needsFunnels?: boolean;
  needsWebsites?: boolean;
  needsWorkflows?: boolean;
  needsApiAccess?: boolean;
  needsWhiteLabel?: boolean;
  monthlyEmailVolume?: number;
  monthlySmsVolume?: number;
  budget?: number;
}

// Plan definitions for FunnelStreams.com
const PLANS: PlanTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 97,
    annualPrice: 970,
    description: 'Perfect for solopreneurs and small businesses getting started with sales funnels and CRM.',
    features: [
      { name: 'CRM & Contact Management', included: true },
      { name: 'Sales Funnels', included: true, details: 'Up to 3 funnels' },
      { name: 'Website Builder', included: true, details: '1 website' },
      { name: 'Email Marketing', included: true },
      { name: 'SMS Marketing', included: true },
      { name: 'Calendar & Booking', included: true },
      { name: 'Pipeline Management', included: true },
      { name: 'Reputation Management', included: false },
      { name: 'Workflow Automation', included: false },
      { name: 'Membership Sites', included: false },
      { name: 'API Access', included: false },
      { name: 'White Label', included: false },
    ],
    limits: {
      contacts: 5000,
      users: 1,
      funnels: 3,
      websites: 1,
      workflows: 0,
      emailsPerMonth: 10000,
      smsCreditsPerMonth: 500,
      customDomains: 1,
      apiAccess: false,
      whiteLabel: false,
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 297,
    annualPrice: 2970,
    description: 'Ideal for growing businesses that need advanced automation, workflows, and marketing tools.',
    features: [
      { name: 'CRM & Contact Management', included: true },
      { name: 'Sales Funnels', included: true, details: 'Unlimited funnels' },
      { name: 'Website Builder', included: true, details: 'Up to 5 websites' },
      { name: 'Email Marketing', included: true },
      { name: 'SMS Marketing', included: true },
      { name: 'Calendar & Booking', included: true },
      { name: 'Pipeline Management', included: true },
      { name: 'Reputation Management', included: true },
      { name: 'Workflow Automation', included: true, details: 'Up to 25 workflows' },
      { name: 'Membership Sites', included: true, details: 'Up to 3 sites' },
      { name: 'API Access', included: true },
      { name: 'White Label', included: false },
    ],
    limits: {
      contacts: 25000,
      users: 5,
      funnels: -1, // unlimited
      websites: 5,
      workflows: 25,
      emailsPerMonth: 50000,
      smsCreditsPerMonth: 2500,
      customDomains: 5,
      apiAccess: true,
      whiteLabel: false,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 497,
    annualPrice: 4970,
    description: 'Full-featured solution for agencies and large businesses with white-label capabilities and unlimited access.',
    features: [
      { name: 'CRM & Contact Management', included: true },
      { name: 'Sales Funnels', included: true, details: 'Unlimited funnels' },
      { name: 'Website Builder', included: true, details: 'Unlimited websites' },
      { name: 'Email Marketing', included: true },
      { name: 'SMS Marketing', included: true },
      { name: 'Calendar & Booking', included: true },
      { name: 'Pipeline Management', included: true },
      { name: 'Reputation Management', included: true },
      { name: 'Workflow Automation', included: true, details: 'Unlimited workflows' },
      { name: 'Membership Sites', included: true, details: 'Unlimited sites' },
      { name: 'API Access', included: true },
      { name: 'White Label', included: true, details: 'Full white-label with custom branding' },
    ],
    limits: {
      contacts: 100000,
      users: 20,
      funnels: -1, // unlimited
      websites: -1, // unlimited
      workflows: -1, // unlimited
      emailsPerMonth: 200000,
      smsCreditsPerMonth: 10000,
      customDomains: -1, // unlimited
      apiAccess: true,
      whiteLabel: true,
    },
  },
];

const ADD_ONS: AddOn[] = [
  {
    id: 'extra_contacts_5k',
    name: 'Additional 5,000 Contacts',
    monthlyPrice: 25,
    description: 'Add 5,000 more contacts to your plan.',
    unit: '5,000 contacts',
  },
  {
    id: 'extra_users_3',
    name: 'Additional 3 Users',
    monthlyPrice: 29,
    description: 'Add 3 more team member seats.',
    unit: '3 users',
  },
  {
    id: 'extra_emails_25k',
    name: 'Additional 25,000 Emails/Month',
    monthlyPrice: 15,
    description: 'Add 25,000 more emails per month.',
    unit: '25,000 emails',
  },
  {
    id: 'extra_sms_1k',
    name: 'Additional 1,000 SMS Credits',
    monthlyPrice: 10,
    description: 'Add 1,000 more SMS credits per month.',
    unit: '1,000 SMS credits',
  },
  {
    id: 'priority_support',
    name: 'Priority Support',
    monthlyPrice: 49,
    description: 'Get priority phone and chat support with a dedicated account manager.',
  },
  {
    id: 'advanced_reporting',
    name: 'Advanced Reporting & Analytics',
    monthlyPrice: 39,
    description: 'Unlock advanced reporting dashboards, custom reports, and data exports.',
  },
  {
    id: 'hipaa_compliance',
    name: 'HIPAA Compliance',
    monthlyPrice: 79,
    description: 'HIPAA-compliant data handling for healthcare businesses.',
  },
];

// ===== TOOL CLASS =====

export class PricePlanCalculatorTools {
  getTools(): Tool[] {
    return [
      {
        name: 'funnelstreams_get_plans',
        description: 'Get all available FunnelStreams.com pricing plans with features and limits. Returns detailed information about each plan tier (Starter, Professional, Enterprise) including monthly and annual pricing.',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
      },
      {
        name: 'funnelstreams_get_addons',
        description: 'Get all available FunnelStreams.com add-ons that can be added to any plan. Returns pricing and descriptions for additional contacts, users, emails, SMS credits, priority support, advanced reporting, and HIPAA compliance.',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
      },
      {
        name: 'funnelstreams_calculate_price',
        description: 'Calculate the total price for a FunnelStreams.com plan with optional add-ons and extras. Supports monthly and annual billing cycles. Provides a detailed cost breakdown including base plan, add-ons, overage costs, and savings from annual billing.',
        inputSchema: {
          type: 'object',
          properties: {
            planId: {
              type: 'string',
              enum: ['starter', 'professional', 'enterprise'],
              description: 'The plan ID to calculate pricing for',
            },
            billingCycle: {
              type: 'string',
              enum: ['monthly', 'annual'],
              description: 'Billing cycle - monthly or annual (annual saves ~17%). Defaults to monthly.',
            },
            addOnIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of add-on IDs to include (e.g., ["priority_support", "extra_contacts_5k"])',
            },
            additionalContacts: {
              type: 'number',
              description: 'Number of additional contacts needed beyond the plan limit (charged in blocks of 5,000 at $25/block)',
            },
            additionalUsers: {
              type: 'number',
              description: 'Number of additional users needed beyond the plan limit (charged in blocks of 3 at $29/block)',
            },
          },
          required: ['planId'],
          additionalProperties: false,
        },
      },
      {
        name: 'funnelstreams_compare_plans',
        description: 'Compare FunnelStreams.com pricing plans side-by-side. Shows features, limits, and pricing differences between plans. If no specific plan IDs are provided, compares all available plans.',
        inputSchema: {
          type: 'object',
          properties: {
            planIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of plan IDs to compare (e.g., ["starter", "professional"]). If not provided, all plans are compared.',
            },
          },
          additionalProperties: false,
        },
      },
      {
        name: 'funnelstreams_recommend_plan',
        description: 'Get a personalized FunnelStreams.com plan recommendation based on business needs. Analyzes requirements like expected contacts, users, features needed, and budget to suggest the best plan and any recommended add-ons.',
        inputSchema: {
          type: 'object',
          properties: {
            expectedContacts: {
              type: 'number',
              description: 'Expected number of contacts/leads to manage',
            },
            expectedUsers: {
              type: 'number',
              description: 'Number of team members who need access',
            },
            needsFunnels: {
              type: 'boolean',
              description: 'Whether sales funnels are needed (more than 3 requires Professional+)',
            },
            needsWebsites: {
              type: 'boolean',
              description: 'Whether multiple websites are needed',
            },
            needsWorkflows: {
              type: 'boolean',
              description: 'Whether workflow automation is needed (requires Professional+)',
            },
            needsApiAccess: {
              type: 'boolean',
              description: 'Whether API access is needed (requires Professional+)',
            },
            needsWhiteLabel: {
              type: 'boolean',
              description: 'Whether white-label capabilities are needed (requires Enterprise)',
            },
            monthlyEmailVolume: {
              type: 'number',
              description: 'Expected monthly email send volume',
            },
            monthlySmsVolume: {
              type: 'number',
              description: 'Expected monthly SMS volume',
            },
            budget: {
              type: 'number',
              description: 'Maximum monthly budget in USD',
            },
          },
          additionalProperties: false,
        },
      },
    ];
  }

  async executePricePlanCalculatorTool(name: string, params: any): Promise<any> {
    try {
      switch (name) {
        case 'funnelstreams_get_plans':
          return this.getPlans();

        case 'funnelstreams_get_addons':
          return this.getAddOns();

        case 'funnelstreams_calculate_price':
          return this.calculatePrice(params as CalculatorParams);

        case 'funnelstreams_compare_plans':
          return this.comparePlans(params as CompareParams);

        case 'funnelstreams_recommend_plan':
          return this.recommendPlan(params as RecommendParams);

        default:
          throw new Error(`Unknown price plan calculator tool: ${name}`);
      }
    } catch (error) {
      console.error(`Error executing price plan calculator tool ${name}:`, error);
      throw error;
    }
  }

  // ===== TOOL IMPLEMENTATIONS =====

  private getPlans(): any {
    return {
      success: true,
      plans: PLANS.map((plan) => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        pricing: {
          monthly: plan.monthlyPrice,
          annual: plan.annualPrice,
          annualMonthlyEquivalent: Math.round((plan.annualPrice / 12) * 100) / 100,
          annualSavings: plan.monthlyPrice * 12 - plan.annualPrice,
          annualSavingsPercent: Math.round(((plan.monthlyPrice * 12 - plan.annualPrice) / (plan.monthlyPrice * 12)) * 100),
        },
        features: plan.features,
        limits: this.formatLimits(plan.limits),
      })),
      message: `Retrieved ${PLANS.length} FunnelStreams.com pricing plans`,
    };
  }

  private getAddOns(): any {
    return {
      success: true,
      addOns: ADD_ONS.map((addOn) => ({
        id: addOn.id,
        name: addOn.name,
        monthlyPrice: addOn.monthlyPrice,
        description: addOn.description,
        ...(addOn.unit && { unit: addOn.unit }),
      })),
      message: `Retrieved ${ADD_ONS.length} available add-ons`,
    };
  }

  private calculatePrice(params: CalculatorParams): any {
    const plan = PLANS.find((p) => p.id === params.planId);
    if (!plan) {
      throw new Error(`Unknown plan: ${params.planId}. Valid plans: ${PLANS.map((p) => p.id).join(', ')}`);
    }

    const billingCycle = params.billingCycle || 'monthly';
    const isAnnual = billingCycle === 'annual';

    // Base plan cost
    const baseMonthlyPrice = isAnnual
      ? Math.round((plan.annualPrice / 12) * 100) / 100
      : plan.monthlyPrice;

    // Add-ons cost
    let addOnsCost = 0;
    const selectedAddOns: any[] = [];
    if (params.addOnIds && params.addOnIds.length > 0) {
      for (const addOnId of params.addOnIds) {
        const addOn = ADD_ONS.find((a) => a.id === addOnId);
        if (!addOn) {
          throw new Error(`Unknown add-on: ${addOnId}. Valid add-ons: ${ADD_ONS.map((a) => a.id).join(', ')}`);
        }
        addOnsCost += addOn.monthlyPrice;
        selectedAddOns.push({
          id: addOn.id,
          name: addOn.name,
          monthlyPrice: addOn.monthlyPrice,
        });
      }
    }

    // Additional contacts overage
    let contactOverageCost = 0;
    let contactBlocks = 0;
    if (params.additionalContacts && params.additionalContacts > 0) {
      contactBlocks = Math.ceil(params.additionalContacts / 5000);
      contactOverageCost = contactBlocks * 25;
    }

    // Additional users overage
    let userOverageCost = 0;
    let userBlocks = 0;
    if (params.additionalUsers && params.additionalUsers > 0) {
      userBlocks = Math.ceil(params.additionalUsers / 3);
      userOverageCost = userBlocks * 29;
    }

    const totalMonthly = baseMonthlyPrice + addOnsCost + contactOverageCost + userOverageCost;
    const annualTotal = isAnnual
      ? plan.annualPrice + (addOnsCost + contactOverageCost + userOverageCost) * 12
      : totalMonthly * 12;

    const monthlyEquivalentIfAnnual = Math.round((plan.annualPrice / 12 + addOnsCost + contactOverageCost + userOverageCost) * 100) / 100;
    const monthlyTotalIfMonthly = plan.monthlyPrice + addOnsCost + contactOverageCost + userOverageCost;
    const annualSavings = isAnnual ? (monthlyTotalIfMonthly * 12 - annualTotal) : 0;

    return {
      success: true,
      plan: {
        id: plan.id,
        name: plan.name,
      },
      billingCycle,
      breakdown: {
        basePlan: {
          monthlyPrice: baseMonthlyPrice,
          label: `${plan.name} Plan (${billingCycle})`,
        },
        addOns: selectedAddOns,
        addOnsTotal: addOnsCost,
        contactOverage: contactOverageCost > 0
          ? {
              additionalContacts: params.additionalContacts,
              blocks: contactBlocks,
              costPerBlock: 25,
              total: contactOverageCost,
            }
          : null,
        userOverage: userOverageCost > 0
          ? {
              additionalUsers: params.additionalUsers,
              blocks: userBlocks,
              costPerBlock: 29,
              total: userOverageCost,
            }
          : null,
      },
      totals: {
        monthlyTotal: Math.round(totalMonthly * 100) / 100,
        annualTotal: Math.round(annualTotal * 100) / 100,
        ...(isAnnual && {
          annualSavings: Math.round(annualSavings * 100) / 100,
          savingsPercent: Math.round((annualSavings / (monthlyTotalIfMonthly * 12)) * 100),
        }),
      },
      effectiveLimits: {
        contacts: plan.limits.contacts + (contactBlocks * 5000),
        users: plan.limits.users + (userBlocks * 3),
        funnels: plan.limits.funnels === -1 ? 'Unlimited' : plan.limits.funnels,
        websites: plan.limits.websites === -1 ? 'Unlimited' : plan.limits.websites,
        workflows: plan.limits.workflows === -1 ? 'Unlimited' : plan.limits.workflows,
        emailsPerMonth: plan.limits.emailsPerMonth,
        smsCreditsPerMonth: plan.limits.smsCreditsPerMonth,
      },
      message: `${plan.name} plan at $${totalMonthly.toFixed(2)}/month (${billingCycle} billing)`,
    };
  }

  private comparePlans(params: CompareParams): any {
    let plansToCompare = PLANS;

    if (params.planIds && params.planIds.length > 0) {
      plansToCompare = params.planIds.map((id) => {
        const plan = PLANS.find((p) => p.id === id);
        if (!plan) {
          throw new Error(`Unknown plan: ${id}. Valid plans: ${PLANS.map((p) => p.id).join(', ')}`);
        }
        return plan;
      });
    }

    // Build feature comparison matrix
    const allFeatureNames = new Set<string>();
    for (const plan of plansToCompare) {
      for (const feature of plan.features) {
        allFeatureNames.add(feature.name);
      }
    }

    const featureComparison: any[] = [];
    for (const featureName of allFeatureNames) {
      const row: any = { feature: featureName };
      for (const plan of plansToCompare) {
        const feature = plan.features.find((f) => f.name === featureName);
        row[plan.id] = feature
          ? {
              included: feature.included,
              ...(feature.details && { details: feature.details }),
            }
          : { included: false };
      }
      featureComparison.push(row);
    }

    // Build limits comparison
    const limitsComparison: any = {};
    const limitKeys: (keyof PlanLimits)[] = [
      'contacts', 'users', 'funnels', 'websites', 'workflows',
      'emailsPerMonth', 'smsCreditsPerMonth', 'customDomains', 'apiAccess', 'whiteLabel',
    ];
    for (const key of limitKeys) {
      limitsComparison[key] = {};
      for (const plan of plansToCompare) {
        const value = plan.limits[key];
        if (typeof value === 'number') {
          limitsComparison[key][plan.id] = value === -1 ? 'Unlimited' : value;
        } else {
          limitsComparison[key][plan.id] = value;
        }
      }
    }

    return {
      success: true,
      plans: plansToCompare.map((plan) => ({
        id: plan.id,
        name: plan.name,
        monthlyPrice: plan.monthlyPrice,
        annualPrice: plan.annualPrice,
        annualMonthlyEquivalent: Math.round((plan.annualPrice / 12) * 100) / 100,
      })),
      featureComparison,
      limitsComparison,
      message: `Compared ${plansToCompare.length} FunnelStreams.com plans: ${plansToCompare.map((p) => p.name).join(' vs ')}`,
    };
  }

  private recommendPlan(params: RecommendParams): any {
    let recommendedPlanId = 'starter';
    const reasons: string[] = [];
    const suggestedAddOns: string[] = [];

    // Evaluate needs against plan tiers
    if (params.needsWhiteLabel) {
      recommendedPlanId = 'enterprise';
      reasons.push('White-label capabilities require the Enterprise plan');
    }

    if (params.needsApiAccess && recommendedPlanId === 'starter') {
      recommendedPlanId = 'professional';
      reasons.push('API access requires the Professional plan or higher');
    }

    if (params.needsWorkflows && recommendedPlanId === 'starter') {
      recommendedPlanId = 'professional';
      reasons.push('Workflow automation requires the Professional plan or higher');
    }

    if (params.needsFunnels && recommendedPlanId === 'starter') {
      recommendedPlanId = 'professional';
      reasons.push('Unlimited funnels available on Professional plan or higher');
    }

    if (params.needsWebsites && recommendedPlanId === 'starter') {
      recommendedPlanId = 'professional';
      reasons.push('Multiple websites require the Professional plan or higher');
    }

    // Check contact limits
    if (params.expectedContacts) {
      if (params.expectedContacts > 25000 && recommendedPlanId !== 'enterprise') {
        recommendedPlanId = 'enterprise';
        reasons.push(`${params.expectedContacts.toLocaleString()} contacts exceeds Professional plan limit of 25,000`);
      } else if (params.expectedContacts > 5000 && recommendedPlanId === 'starter') {
        recommendedPlanId = 'professional';
        reasons.push(`${params.expectedContacts.toLocaleString()} contacts exceeds Starter plan limit of 5,000`);
      }
    }

    // Check user limits
    if (params.expectedUsers) {
      if (params.expectedUsers > 5 && recommendedPlanId !== 'enterprise') {
        recommendedPlanId = 'enterprise';
        reasons.push(`${params.expectedUsers} users exceeds Professional plan limit of 5`);
      } else if (params.expectedUsers > 1 && recommendedPlanId === 'starter') {
        recommendedPlanId = 'professional';
        reasons.push(`${params.expectedUsers} users exceeds Starter plan limit of 1`);
      }
    }

    // Check email volume
    if (params.monthlyEmailVolume) {
      const plan = PLANS.find((p) => p.id === recommendedPlanId)!;
      if (params.monthlyEmailVolume > plan.limits.emailsPerMonth) {
        const blocksNeeded = Math.ceil((params.monthlyEmailVolume - plan.limits.emailsPerMonth) / 25000);
        suggestedAddOns.push(`extra_emails_25k (x${blocksNeeded})`);
        reasons.push(`Email volume of ${params.monthlyEmailVolume.toLocaleString()} exceeds plan limit of ${plan.limits.emailsPerMonth.toLocaleString()}`);
      }
    }

    // Check SMS volume
    if (params.monthlySmsVolume) {
      const plan = PLANS.find((p) => p.id === recommendedPlanId)!;
      if (params.monthlySmsVolume > plan.limits.smsCreditsPerMonth) {
        const blocksNeeded = Math.ceil((params.monthlySmsVolume - plan.limits.smsCreditsPerMonth) / 1000);
        suggestedAddOns.push(`extra_sms_1k (x${blocksNeeded})`);
        reasons.push(`SMS volume of ${params.monthlySmsVolume.toLocaleString()} exceeds plan limit of ${plan.limits.smsCreditsPerMonth.toLocaleString()}`);
      }
    }

    // Additional contacts overage on recommended plan
    const recommendedPlan = PLANS.find((p) => p.id === recommendedPlanId)!;
    let additionalContactBlocks = 0;
    if (params.expectedContacts && params.expectedContacts > recommendedPlan.limits.contacts) {
      additionalContactBlocks = Math.ceil((params.expectedContacts - recommendedPlan.limits.contacts) / 5000);
      suggestedAddOns.push(`extra_contacts_5k (x${additionalContactBlocks})`);
    }

    // Additional users overage on recommended plan
    let additionalUserBlocks = 0;
    if (params.expectedUsers && params.expectedUsers > recommendedPlan.limits.users) {
      additionalUserBlocks = Math.ceil((params.expectedUsers - recommendedPlan.limits.users) / 3);
      suggestedAddOns.push(`extra_users_3 (x${additionalUserBlocks})`);
    }

    // Calculate estimated monthly cost
    let estimatedMonthlyCost = recommendedPlan.monthlyPrice;
    estimatedMonthlyCost += additionalContactBlocks * 25;
    estimatedMonthlyCost += additionalUserBlocks * 29;

    if (reasons.length === 0) {
      reasons.push('The Starter plan covers your basic needs');
    }

    // Budget check
    let withinBudget = true;
    let budgetNote = '';
    if (params.budget !== undefined) {
      if (estimatedMonthlyCost > params.budget) {
        withinBudget = false;
        budgetNote = `Estimated cost of $${estimatedMonthlyCost}/month exceeds your budget of $${params.budget}/month. Consider annual billing to save ~17%.`;
      } else {
        budgetNote = `Estimated cost of $${estimatedMonthlyCost}/month is within your budget of $${params.budget}/month.`;
      }
    }

    const annualEquivalent = Math.round((recommendedPlan.annualPrice / 12) * 100) / 100;
    const annualSavings = recommendedPlan.monthlyPrice * 12 - recommendedPlan.annualPrice;

    return {
      success: true,
      recommendation: {
        planId: recommendedPlanId,
        planName: recommendedPlan.name,
        monthlyPrice: recommendedPlan.monthlyPrice,
        annualPrice: recommendedPlan.annualPrice,
        annualMonthlyEquivalent: annualEquivalent,
        annualSavings,
      },
      reasons,
      suggestedAddOns: suggestedAddOns.length > 0 ? suggestedAddOns : null,
      estimatedMonthlyCost,
      estimatedAnnualCost: recommendedPlan.annualPrice + (estimatedMonthlyCost - recommendedPlan.monthlyPrice) * 12,
      ...(params.budget !== undefined && {
        budgetAnalysis: { withinBudget, note: budgetNote },
      }),
      tip: `Save $${annualSavings} per year by choosing annual billing!`,
      message: `Recommended plan: ${recommendedPlan.name} at $${estimatedMonthlyCost}/month`,
    };
  }

  // ===== HELPERS =====

  private formatLimits(limits: PlanLimits): any {
    return {
      contacts: limits.contacts.toLocaleString(),
      users: limits.users,
      funnels: limits.funnels === -1 ? 'Unlimited' : limits.funnels,
      websites: limits.websites === -1 ? 'Unlimited' : limits.websites,
      workflows: limits.workflows === -1 ? 'Unlimited' : limits.workflows,
      emailsPerMonth: limits.emailsPerMonth.toLocaleString(),
      smsCreditsPerMonth: limits.smsCreditsPerMonth.toLocaleString(),
      customDomains: limits.customDomains === -1 ? 'Unlimited' : limits.customDomains,
      apiAccess: limits.apiAccess,
      whiteLabel: limits.whiteLabel,
    };
  }
}

// Helper function to check if a tool name belongs to price plan calculator tools
export function isPricePlanCalculatorTool(toolName: string): boolean {
  const pricePlanCalculatorToolNames = [
    'funnelstreams_get_plans',
    'funnelstreams_get_addons',
    'funnelstreams_calculate_price',
    'funnelstreams_compare_plans',
    'funnelstreams_recommend_plan',
  ];

  return pricePlanCalculatorToolNames.includes(toolName);
}
