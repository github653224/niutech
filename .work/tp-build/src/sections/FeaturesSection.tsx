import { Shield, Zap, Target, Users, BarChart3, Rocket } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: '智能测试Agent',
    description: 'AI自主执行全流程测试，从代码分析到测试执行，再到报告生成，无需人工干预。相当于7×24小时的AI测试工程师。',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Zap,
    title: '影响分析引擎',
    description: '精准识别代码变更的影响范围，智能选择最相关的测试用例，测试时间缩短70%以上。',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Target,
    title: '根因分析',
    description: 'AI自动分析测试失败原因，区分真实Bug、环境问题、用例问题，精准定位问题根源。',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Users,
    title: '多团队协作',
    description: '支持开发、测试、产品经理多角色协同，自动生成面向不同角色的测试报告。',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: BarChart3,
    title: '质量门禁决策',
    description: '多维度质量评估：代码质量、安全性、性能、兼容性、测试覆盖，自动给出合并建议。',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Rocket,
    title: '极速集成',
    description: '5分钟接入GitHub/GitLab，支持Webhook和CI/CD流水线，开箱即用零配置负担。',
    color: 'from-pink-500 to-rose-500'
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            <Zap className="w-4 h-4 mr-2" />
            核心功能
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            为什么选择{' '}
            <span className="gradient-text">TestAgent Pro</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            不止是工具，更是你的AI测试团队。我们重新定义了软件测试的方式。
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-hover bg-white rounded-2xl p-8 shadow-lg border border-gray-100 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">70%</div>
              <div className="text-blue-100">测试时间缩短</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10x</div>
              <div className="text-blue-100">测试执行速度</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">缺陷检出率</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">AI Agent值守</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
