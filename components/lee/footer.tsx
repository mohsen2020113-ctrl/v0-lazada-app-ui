'use client'

import { useI18n } from '@/lib/i18n-context'

export function Footer() {
  const { isRTL } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <footer className={`bg-background border-t border-border py-8 mt-16 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">4LEEE</h3>
            <p className="text-sm text-muted-foreground">
              {isRTL ? 'منصة تسوق عبر الإنترنت موثوقة من الإمارات العربية المتحدة' : 'Your trusted online shopping platform based in United Arab Emirates.'}
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {isRTL ? 'خدمة العملاء' : 'Customer Service'}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">{isRTL ? 'الاتصال بنا' : 'Contact Us'}</a></li>
              <li><a href="#" className="hover:text-foreground">{isRTL ? 'الأسئلة الشائعة' : 'FAQ'}</a></li>
              <li><a href="#" className="hover:text-foreground">{isRTL ? 'شرح السياسة' : 'Policies'}</a></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {isRTL ? 'حول' : 'About'}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">{isRTL ? 'عن 4LEEE' : 'About 4LEEE'}</a></li>
              <li><a href="#" className="hover:text-foreground">{isRTL ? 'الوظائف' : 'Careers'}</a></li>
              <li><a href="#" className="hover:text-foreground">{isRTL ? 'المدونة' : 'Blog'}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {isRTL ? 'قانوني' : 'Legal'}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">{isRTL ? 'شروط الخدمة' : 'Terms'}</a></li>
              <li><a href="#" className="hover:text-foreground">{isRTL ? 'سياسة الخصوصية' : 'Privacy'}</a></li>
              <li><a href="#" className="hover:text-foreground">{isRTL ? 'سياسة الاسترجاع' : 'Returns'}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center ${isRTL ? 'text-right' : 'text-left'}`}>
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {currentYear} 4LEEE. {isRTL ? 'جميع الحقوق محفوظة. تقع في دبي، الإمارات العربية المتحدة.' : 'All rights reserved. Based in Dubai, United Arab Emirates.'}
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">{isRTL ? 'تويتر' : 'Twitter'}</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">{isRTL ? 'فيسبوك' : 'Facebook'}</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">{isRTL ? 'إنستجرام' : 'Instagram'}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
