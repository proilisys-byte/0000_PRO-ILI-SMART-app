export function Footer() {
  return (
    <footer className="relative py-16 px-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/imports/그림2.png"
                alt="PRO-ILI Logo"
                className="h-12 w-auto"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent">
                PRO ALI SMART
              </span>
            </div>
            <p className="text-sm text-gray-700">
              제조 품질혁신을 위한<br />투명한 워크플로우 플랫폼
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">제품</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#" className="hover:text-blue-600 transition-colors">핵심 기능</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">통합 기능</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">요금제</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">업데이트</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">리소스</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#" className="hover:text-blue-600 transition-colors">문서</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">가이드</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">블로그</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">지원</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">회사</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#" className="hover:text-blue-600 transition-colors">소개</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">채용</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">파트너</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">연락처</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © 2026 PRO ALI SMART. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-blue-600 transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-blue-600 transition-colors">이용약관</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
