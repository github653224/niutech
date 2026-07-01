import { Rocket, Sparkles, ChevronRight, Play, Star } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 mr-2" />
            AI 驱动的智能测试平台 · 全新发布
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight animate-slide-up">
            让 AI Agent{' '}
            <span className="gradient-text">重新定义</span>
            <br />
            软件测试
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '200ms' }}>
            不是工具，是你的 <span className="font-semibold text-blue-600">AI 测试工程师团队</span>。<br/>
            从代码变更到测试报告，全程自主执行，<span className="font-semibold text-purple-600">7×24小时值守</span>。
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <button
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Rocket className="w-5 h-5 mr-2" />
              免费开始试用
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
            <button className="group flex items-center gap-3 text-gray-700 hover:text-blue-600 text-lg font-medium transition-colors">
              <div className="w-12 h-12 rounded-full bg-gray-200 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                <Play className="w-5 h-5 ml-1 text-gray-600 group-hover:text-blue-600" />
              </div>
              观看产品演示
            </button>
          </div>

          {/* Social Proof */}
          <div className="animate-slide-up" style={{ animationDelay: '600ms' }}>
            <div className="flex flex-col items-center gap-4">
              {/* Star Rating */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 text-sm text-gray-600">4.9/5</span>
              </div>
              
              {/* Testimonials Preview */}
              <p className="text-gray-600 text-sm">
                超过 <span className="font-semibold text-gray-900">500+</span> 企业信赖，
                <span className="font-semibold text-gray-900"> 10,000+</span> 测试工程师在用
              </p>

              {/* Logos */}
              <div className="flex items-center gap-8 mt-4 opacity-50 grayscale">
                <div className="text-2xl font-bold text-gray-400">Google</div>
                <div className="text-2xl font-bold text-gray-400">Microsoft</div>
                <div className="text-2xl font-bold text-gray-400">Amazon</div>
                <div className="text-2xl font-bold text-gray-400">Meta</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Dashboard Preview */}
        <div className="mt-20 animate-slide-up" style={{ animationDelay: '800ms' }}>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-sm text-gray-500">TestAgent Pro - Agent 控制台</span>
            </div>
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Agent 工作台</h3>
                <p className="text-gray-600">PR #142 · ✅ 12/12通过 · 刚刚执行完成</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
