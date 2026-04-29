import { setRequestLocale, getTranslations } from 'next-intl/server';

export function generateStaticParams() {
  return [{ locale: 'zh' }, { locale: 'en' }];
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Avatar & Name */}
      <div className="text-center mb-10">
        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
          <img src="/images/avatar.svg" alt="Lain" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Lain</h1>
        <p className="text-gray-500 dark:text-gray-400">Developer · Tech Enthusiast</p>
      </div>

      {/* Bio */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="text-blue-500">#</span>
          关于我
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          欢迎来到我的技术博客！这里记录我在学习和工作中遇到的技术问题与思考，涵盖前端开发、后端技术、数据结构、计算机基础等领域。
          希望这些内容能对你有所帮助。
        </p>
      </div>

      {/* Tech Stack */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="text-blue-500">#</span>
          技术栈
        </h2>
        <div className="flex flex-wrap gap-2">
          {['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'C/C++', 'Git', 'Linux'].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 text-sm rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="text-blue-500">#</span>
          链接
        </h2>
        <div className="flex gap-4">
          <a
            href="https://github.com/Lainnevergiveup"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
