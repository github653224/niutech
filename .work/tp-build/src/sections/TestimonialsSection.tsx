import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: '张明',
    role: '某互联网公司 测试经理',
    avatar: 'TM',
    rating: 5,
    text: '接入TestAgent Pro后，我们的PR测试从原来的2小时缩短到15分钟，而且准确率更高。AI自动发现的几个隐蔽Bug，人工测试很难覆盖到。',
    company: '电商行业'
  },
  {
    name: '李华',
    role: '某金融机构 QA主管',
    avatar: 'LH',
    rating: 5,
    text: '作为金融公司，我们对代码质量要求极高。TestAgent Pro的质量门禁功能帮助我们建立了完善的自动化质量防线，每次提交都有AI把关。',
    company: '金融科技'
  },
  {
    name: '王芳',
    role: '创业公司 CTO',
    avatar: 'WF',
    rating: 5,
    text: '我们团队只有5个开发，质量保障一直是痛点。用了TestAgent Pro之后，相当于多了3个AI测试工程师在24小时工作，性价比太高了。',
    company: 'SaaS创业公司'
  },
  {
    name: '赵强',
    role: '知名游戏公司 技术总监',
    avatar: 'AQ',
    rating: 5,
    text: '以前每次版本发布都要花大量时间做回归测试，现在Agent帮我们自动筛选最关键的业务场景，覆盖了核心流程，节省了大量人力。',
    company: '游戏行业'
  },
  {
    name: '陈静',
    role: '电商平台 测试工程师',
    avatar: 'CJ',
    rating: 5,
    text: '最打动我的是根因分析功能。以前要花时间判断测试失败是环境问题还是真bug，现在AI一秒搞定，还能给出修复建议，效率翻倍。',
    company: '电商行业'
  },
  {
    name: '刘洋',
    role: '某国企 IT部门负责人',
    avatar: 'LY',
    rating: 4,
    text: '企业私有化部署方案很贴合我们的安全需求。数据不出内网，同时享受AI测试的效率提升。技术支持团队也很专业。',
    company: '国有企业'
  }
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium mb-4">
            <Star className="w-4 h-4 mr-2" />
            客户好评
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            他们都在用{' '}
            <span className="gradient-text">TestAgent Pro</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            来自各行业测试专业人士的真实反馈。
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card-hover bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100 relative"
            >
              <Quote className="w-8 h-8 text-blue-200 mb-4" />
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4">
                <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-medium">
                  {testimonial.company}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">活跃企业客户</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">10万+</div>
            <div className="text-gray-600">日均PR审查</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">99.9%</div>
            <div className="text-gray-600">客户满意度</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">50+</div>
            <div className="text-gray-600">行业覆盖</div>
          </div>
        </div>
      </div>
    </section>
  );
}
