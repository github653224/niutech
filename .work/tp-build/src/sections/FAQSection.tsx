import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'TestAgent Pro 支持哪些代码托管平台？',
    answer: '目前支持 GitHub 和 GitLab，可直接通过 Webhook 或 GitHub Action/GitLab CI 集成。企业版还支持自托管的 GitLab CE/EE 和 Bitbucket。'
  },
  {
    question: '接入 TestAgent Pro 需要多长时间？',
    answer: '标准集成只需 5-10 分钟。只需配置 Webhook URL 或添加一行 CI/CD 配置即可开始使用。企业私有化部署可能需要 1-2 周，但我们提供全程技术支持。'
  },
  {
    question: 'AI 测试的准确率如何？',
    answer: '根据我们的实测数据，真实Bug检出率达到 99.9%，误报率低于 2%。AI 会自动区分真实 Bug、环境问题、用例问题，并提供明确的分类标签。'
  },
  {
    question: '数据安全如何保障？',
    answer: '我们采用多层安全防护：API Key 加密存储、数据传输使用 TLS 1.3、测试数据自动脱敏。企业版支持私有化部署，所有数据完全留在您的内网环境。'
  },
  {
    question: '可以自定义 Agent 的工作流程吗？',
    answer: '可以！专业版和企业版支持自定义 Agent 流程编排，包括影响分析策略、测试选择规则、报告模板、通知渠道等。您可以根据团队习惯灵活配置。'
  },
  {
    question: '免费试用期间有限制吗？',
    answer: '免费版永久免费，每月5个PR。专业版提供14天免费试用，期间功能不受限制。试用结束后您可以选择订阅或继续使用免费版。'
  },
  {
    question: '支持哪些编程语言和项目类型？',
    answer: '目前支持 Java、Python、JavaScript/TypeScript、Go、Ruby 等主流语言。无论单体应用还是微服务架构，都可以无缝接入。'
  },
  {
    question: '如果我遇到问题，如何获得支持？',
    answer: '免费版提供社区支持（Forum + 文档）。专业版提供7×12小时工单支持。企业版享有7×24小时专属客户经理和技术顾问，SLA 保障响应时间。'
  },
  {
    question: '如何从其他测试工具迁移过来？',
    answer: '我们提供迁移工具和服务，支持从传统自动化测试工具（如 Selenium、Cypress）一键迁移测试用例到 TestAgent Pro。企业版客户可享受免费迁移服务。'
  },
  {
    question: 'Agent 市场是什么？',
    answer: 'Agent 市场是一个生态系统，测试工程师可以将自己的测试经验和能力封装成 Agent 发布销售。开发者获得80%收入，平台抽成20%。适合有丰富测试经验的专家创造被动收入。'
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-4">
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            常见{' '}
            <span className="gradient-text">问题解答</span>
          </h2>
          <p className="text-xl text-gray-600">
            找不到答案？随时联系我们的销售团队。
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm card-hover"
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">还有其他问题？</p>
          <button className="gradient-text font-bold text-lg hover:underline cursor-pointer">
            联系销售团队 →
          </button>
        </div>
      </div>
    </section>
  );
}
