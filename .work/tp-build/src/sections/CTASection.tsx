import { ArrowRight, Rocket, Clock, Shield, Users } from 'lucide-react';
import { Button } from '../components/Button';

export function CTASection() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden gradient-bg p-12 md:p-20 text-center text-white">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <Rocket className="w-16 h-16 mx-auto mb-6 text-white/90" />
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              准备好升级您的测试流程了吗？
            </h2>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              加入 500+ 企业的行列，用 AI 重新定义软件测试。
              <br />
              立即开始，无需信用卡。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-2xl"
              >
                免费开始试用
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <button className="text-white underline hover:no-underline text-lg font-medium">
                预约产品演示
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <div className="font-semibold">5分钟</div>
                <div className="text-sm text-white/70">快速接入</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <Shield className="w-8 h-8 mx-auto mb-2" />
                <div className="font-semibold">零风险</div>
                <div className="text-sm text-white/70">免费试用</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <div className="font-semibold">500+</div>
                <div className="text-sm text-white/70">企业信赖</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <Rocket className="w-8 h-8 mx-auto mb-2" />
                <div className="font-semibold">99.9%</div>
                <div className="text-sm text-white/70">正常运行</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
