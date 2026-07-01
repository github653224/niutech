import { Bot, Database, ShieldCheck, Layers, BrainCircuit, Globe } from 'lucide-react';

const products = [
  {
    icon: Bot,
    title: '测试Agent - 自主执行测试的AI员工',
    subtitle: '核心产品 · Phase 1',
    description: 'AI Agent围绕PR/MR自动完成代码分析→影响评估→智能选测试→执行→失败分析→报告→创建Issue。相当于一个7×24小时的AI测试工程师。',
    features: [
      'PR自动审查与评论回写',
      '代码影响范围分析',
      '智能测试用例选择',
      '失败根因AI分析',
      'Jira/飞书自动创建Issue',
      'WebSocket实时进度监控'
    ],
    customers: '测试工程师、测试经理、CTO',
    pricing: '免费版 ¥0/月起 | 专业版 ¥5/PR | 企业版 ¥9,999/月'
  },
  {
    icon: Database,
    title: '测试数据工厂 - AI生成真实可用数据',
    subtitle: '即将推出 · Phase 2',
    description: '粘贴建表SQL或连接数据库，AI自动推断业务规则，一键生成真实可用的测试数据。支持百万级批量生成和自动脱敏。',
    features: [
      'DDL智能解析与规则推断',
      '10+数据类型自动生成',
      '一键导出SQL/CSV/JSON',
      '敏感字段自动脱敏',
      '百万级批量生成',
      '生产数据学习与复刻'
    ],
    customers: '测试工程师、QA团队',
    pricing: '免费版 ¥0/100条 | 按量 ¥0.1/条 | 订阅 ¥5,000/月'
  },
  {
    icon: ShieldCheck,
    title: 'AI质量门禁 - 代码提交前的质量守门员',
    subtitle: '即将推出 · Phase 3',
    description: 'PR提交后，AI自动进行5维并行检查（代码质量/安全/性能/兼容性/测试覆盖），给出允许合并/需要审查/禁止合并决策。',
    features: [
      '5维度自动质量审查',
      '代码质量评分0-100',
      '安全漏洞智能检测',
      '性能瓶颈预警',
      'CI/CD一键集成',
      '自动修复建议'
    ],
    customers: '技术负责人、CTO、QA经理',
    pricing: '免费版 ¥0/10 PR | 团队版 ¥2,000/月 | 企业版 ¥50,000/年'
  },
  {
    icon: Layers,
    title: '业务流程测试 - 基于知识图谱的端到端验证',
    subtitle: '探索中 · Phase 4',
    description: '上传业务文档，AI自动构建知识图谱，生成端到端测试场景。不说"接口500"，说"用户无法完成支付，影响营收¥50,000"。',
    features: [
      '业务文档AI解析',
      '知识图谱可视化',
      '端到端场景自动生成',
      '异常路径智能发现',
      '业务风险量化报告',
      '金融行业模板'
    ],
    customers: '测试经理、业务分析师',
    pricing: '按场景 ¥5,000/场景 | 行业方案 ¥50,000/年起'
  },
  {
    icon: BrainCircuit,
    title: 'Agent SDK - 开发者工具箱',
    subtitle: '开放平台',
    description: '10行代码创建专属测试Agent，发布到Agent市场。测试工程师可将5年经验封装成Agent卖钱，平台抽成20%，开发者拿80%。',
    features: [
      'Python SDK快速开发',
      '装饰器声明Agent能力',
      'Agent市场发布',
      '开发者收益面板',
      '沙箱安全隔离',
      '企业私有部署支持'
    ],
    customers: '测试工具开发者、独立开发者',
    pricing: '平台抽成20% | 认证服务 ¥10,000/次'
  },
  {
    icon: Globe,
    title: '企业定制解决方案',
    subtitle: '高端服务',
    description: '针对大型企业量身定制的AI测试解决方案，包含私有化部署、定制化Agent、专属培训、SLA保障等一站式服务。',
    features: [
      '私有化部署方案',
      '定制化测试Agent开发',
      '企业级安全防护',
      '专属技术顾问',
      '7×24小时SLA保障',
      '定期培训与升级'
    ],
    customers: '大型科技企业、金融机构、政府单位',
    pricing: '根据企业规模和需求定制报价'
  }
];

export function ProductsSection() {
  return (
    <section id="products" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
            <Layers className="w-4 h-4 mr-2" />
            产品矩阵
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            完整的产品方案，覆盖{' '}
            <span className="gradient-text">测试全链路</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            从代码变更到测试执行，从数据生成到质量门禁，我们提供一站式AI测试解决方案。
          </p>
        </div>

        {/* Products List */}
        <div className="space-y-12">
          {products.map((product, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 md:p-12 shadow-xl border transition-all hover:shadow-2xl ${
                product.subtitle.includes('核心') 
                  ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200' 
                  : product.subtitle.includes('开放')
                  ? 'bg-gradient-to-br from-green-50 to-teal-50 border-green-200'
                  : product.subtitle.includes('企业')
                  ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column - Icon & Info */}
                <div className="md:w-1/3">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                    product.subtitle.includes('核心')
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                      : product.subtitle.includes('开放')
                      ? 'bg-gradient-to-br from-green-500 to-teal-500'
                      : product.subtitle.includes('企业')
                      ? 'bg-gradient-to-br from-orange-500 to-red-500'
                      : 'bg-gray-100'
                  }`}>
                    <product.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </h3>
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-blue-100 text-blue-700">
                    {product.subtitle}
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {product.description}
                  </p>
                  <div className="text-sm text-gray-500 mb-2">
                    <span className="font-semibold">目标客户：</span>{product.customers}
                  </div>
                  <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-lg inline-block mt-2">
                    {product.pricing}
                  </div>
                </div>

                {/* Right Column - Features */}
                <div className="md:w-2/3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-4 rounded-lg bg-white/60 border border-gray-100"
                      >
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
