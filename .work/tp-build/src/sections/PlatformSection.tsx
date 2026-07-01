import {
  GitPullRequest,
  Network,
  Wand2,
  PlayCircle,
  Search,
  ShieldCheck,
  Webhook,
  Workflow,
  FileCode2,
  Server,
  RefreshCw,
  Radio,
  Gavel,
  FileText,
  ExternalLink,
  Cpu,
} from 'lucide-react';

// 全链路工作流：基于 ai-test-agent 真实执行链路
const workflow = [
  { icon: GitPullRequest, title: 'PR / MR 提交', desc: 'GitHub / GitLab Webhook 自动触发，提交即响应', color: 'from-blue-500 to-cyan-500' },
  { icon: Network, title: '影响分析', desc: 'AI 解析代码变更，精准识别影响范围与受测路径', color: 'from-purple-500 to-pink-500' },
  { icon: Wand2, title: '测试生成', desc: '基于 OpenAPI 自动发现接口，动态生成集成测试脚本', color: 'from-orange-500 to-red-500' },
  { icon: PlayCircle, title: '执行验证', desc: '生成测试 + 真实服务双轨执行，smoke 验证一气呵成', color: 'from-green-500 to-emerald-500' },
  { icon: Search, title: '根因分析', desc: '区分真实 Bug / 环境问题 / 用例问题，定位问题根源', color: 'from-indigo-500 to-purple-500' },
  { icon: ShieldCheck, title: '发布决策', desc: 'AI 给出放行 / 谨慎放行 / 阻断建议与关键证据', color: 'from-pink-500 to-rose-500' },
];

// 平台核心能力：基于 ai-test-agent 已落地能力
const capabilities = [
  { icon: Webhook, title: 'Webhook 自动触发', desc: 'PR / MR 事件实时接入，Celery 异步执行，无需人工干预。', tag: '事件驱动' },
  { icon: Workflow, title: 'Agent 智能编排', desc: 'test_generation / test_execution / self_healing 多 skills 协作编排。', tag: '多 Agent' },
  { icon: FileCode2, title: 'OpenAPI 自动发现', desc: '只提供最小运行配置，接口路径与方法由 OpenAPI 自动识别。', tag: '零配置' },
  { icon: Server, title: '真实服务验证', desc: '动态生成集成测试脚本，真实调用目标服务完成 smoke 验证。', tag: '双轨执行' },
  { icon: RefreshCw, title: '测试自愈', desc: '接口变更后自动修复失效用例，大幅降低用例维护成本。', tag: '自动修复' },
  { icon: Radio, title: '实时进度监控', desc: 'WebSocket 推送 Agent 执行进度，全程可视化透明可追溯。', tag: '实时' },
  { icon: Gavel, title: 'AI 发布建议', desc: '不只是报失败，直接给出「能不能发、为什么、该谁看」。', tag: '决策' },
  { icon: FileText, title: '双轨结果报告', desc: '生成测试与真实服务测试双轨结果，附业务风险结论与角色建议。', tag: '可追溯' },
];

export function PlatformSection() {
  return (
    <section id="platform" className="py-20 md:py-32 bg-gradient-to-b from-white via-blue-50/40 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-medium mb-4">
            <Cpu className="w-4 h-4 mr-2" />
            SaaS 平台 · 核心链路已上线
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            不只是 Demo，是{' '}
            <span className="gradient-text">真实运行的 SaaS 平台</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            从代码提交到发布决策，6 步全链路自主执行。下方每一个能力，都已在平台中落地。
          </p>
        </div>

        {/* Workflow Timeline */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-2">
            {workflow.map((step, index) => (
              <div key={index} className="relative">
                {index < workflow.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[58%] w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200" />
                )}
                <div className="relative bg-white rounded-xl p-5 shadow-md border border-gray-100 card-hover text-center h-full">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-xs font-bold text-blue-500 mb-1">STEP {index + 1}</div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap, index) => (
            <div
              key={index}
              className="card-hover bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <cap.icon className="w-6 h-6 text-white" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                  {cap.tag}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{cap.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA: 进入控制台 */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 md:p-12 text-center text-white shadow-2xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">想亲眼看 Agent 跑一次？</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            进入平台控制台，创建你的第一个测试 Agent，观察 PR 提交后全链路自主执行的实时过程。
          </p>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-white text-blue-600 hover:bg-blue-50 shadow-xl transform hover:-translate-y-1 transition-all"
          >
            进入控制台
            <ExternalLink className="w-5 h-5 ml-2" />
          </a>
          <p className="text-blue-200 text-xs mt-4">本地开发环境 · 平台持续迭代中</p>
        </div>
      </div>
    </section>
  );
}
