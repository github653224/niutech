import { Mail, MapPin, Phone, MessageCircle, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const footerLinks = {
    产品: ['测试Agent', '数据工厂', '质量门禁', '业务流程测试', 'Agent市场', '企业定制'],
    资源: ['文档中心', 'API参考', '集成指南', '视频教程', '博客', '更新日志'],
    公司: ['关于我们', '联系我们', '加入我们', '合作伙伴', '品牌资源'],
    法律: ['隐私政策', '服务条款', 'Cookie政策', '数据保护']
  };

  const contactInfo = [
    { icon: Mail, text: 'contact@testagent.pro', href: 'mailto:contact@testagent.pro' },
    { icon: Phone, text: '400-888-8888', href: 'tel:+864008888888' },
    { icon: MapPin, text: '北京市海淀区中关村科技园', href: '#' },
    { icon: MessageCircle, text: '在线咨询', href: '#' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="font-bold text-2xl text-white">TestAgent Pro</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              AI驱动的智能测试平台，让软件测试更高效、更智能、更可靠。
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              {contactInfo.map((info, idx) => (
                <a
                  key={idx}
                  href={info.href}
                  className="flex items-center gap-3 text-sm hover:text-white transition-colors"
                >
                  <info.icon className="w-4 h-4" />
                  {info.text}
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <button
                      className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                      onClick={() => scrollToSection(link.toLowerCase().replace(/\s+/g, '-'))}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {currentYear} TestAgent Pro. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>京ICP备XXXXXXXX号</span>
              <span>•</span>
              <span>隐私政策</span>
              <span>•</span>
              <span>服务条款</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
