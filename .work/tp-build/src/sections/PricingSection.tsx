import { Check } from 'lucide-react';
import { useState } from 'react';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  target: string;
}

const tiers: PricingTier[] = [
  {
    name: '免费版',
    price: '¥0',
    period: '/月',
    description: '个人开发者尝鲜',
    target: '适合个人测试工程师体验AI测试能力',
    features: [
      '5个PR/月自动审查',
      '基础测试报告',
      '社区支持',
      'GitHub/GitLab集成',
      'Webhook触发',
      'WebSocket实时进度'
    ],
    cta: '立即开始',
    highlighted: false
  },
  {
    name: '专业版',
    price: '¥5',
    period: '/PR',
    description: '成长型团队首选',
    target: '适合中小型团队的敏捷测试需求',
    features: [
      '无限PR自动审查',
      'AI根因分析',
      'Jira/飞书自动创建Issue',
      'PR评论回写',
      '影响范围分析',
      '7×12小时技术支持',
      '高级报告导出',
      '自定义Agent流程'
    ],
    cta: '免费试用14天',
    highlighted: true
  },
  {
    name: '企业版',
    price: '¥9,999',
    period: '/月',
    description: '大规模团队与企业定制',
    target: '适合大型企业的质量保障需求',
    features: [
      '无限PR + 无限Agent',
      '私有化部署选项',
      '多Agent并行协作',
      '质量门禁决策',
      'SLA 99.9%保障',
      '7×24专属技术支持',
      '定制训练专属Agent',
      'Agent市场优先发布',
      '审计日志与合规报告'
    ],
    cta: '联系销售',
    highlighted: false
  }
];

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <section id="pricing" className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
            <Check className="w-4 h-4 mr-2" />
            灵活定价
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            选择最适合你的{' '}
            <span className="gradient-text">套餐方案</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            从个人到企业，按需付费。无隐藏费用，随时升级或降级。
          </p>
          
          {/* Billing Toggle (未来可扩展) */}
          <div className="mt-8 inline-flex items-center bg-white rounded-full p-1 shadow-lg border border-gray-200">
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              按月付费
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'annual'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setBillingCycle('annual')}
            >
              按年付费
              <span className="ml-1 text-xs">(省20%)</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`card-hover rounded-2xl p-8 border-2 transition-all ${
                tier.highlighted
                  ? 'border-blue-500 shadow-2xl bg-white scale-105 z-10'
                  : 'border-gray-200 bg-white shadow-lg'
              }`}
            >
              {tier.highlighted && (
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    最受欢迎
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-sm text-gray-500">{tier.target}</p>
              </div>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">{tier.price}</span>
                <span className="text-gray-500 ml-2">{tier.period}</span>
              </div>
              
              <p className="text-gray-600 mb-6 text-sm">{tier.description}</p>
              
              <div className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  tier.highlighted
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">需要更大规模的定制方案？</p>
          <button className="text-blue-600 font-semibold hover:text-blue-700 underline">
            联系我们讨论企业定制方案 →
          </button>
        </div>
      </div>
    </section>
  );
}
