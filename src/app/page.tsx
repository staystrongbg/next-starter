import { GuestSession } from '@/components/auth/guest-session';
import { NotificationBoard } from '@/components/shared/notification-board';
import { Database, FileCode, Folder, Layers, Rocket, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Authentication',
    description: 'Pre-configured Better Auth with secure session management.',
  },
  {
    icon: Database,
    title: 'Database',
    description: 'Prisma ORM ready with type-safe database operations.',
  },
  {
    icon: Layers,
    title: 'Data Fetching',
    description: 'TanStack Query for powerful server-state management.',
  },
  {
    icon: FileCode,
    title: 'Validation',
    description: 'Zod schema validation for type-safe data handling.',
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'React Compiler enabled for optimal rendering.',
  },
  {
    icon: Rocket,
    title: 'Developer Experience',
    description: 'Prettier, ESLint, and shadcn/ui components included.',
  },
];

const fileTree = [
  { name: 'src/', type: 'folder', indent: 0 },
  { name: 'app/', type: 'folder', indent: 1 },
  { name: '(auth)/', type: 'folder', indent: 2 },
  { name: 'sign-in/page.tsx', type: 'file', indent: 3 },
  { name: 'sign-up/page.tsx', type: 'file', indent: 3 },
  { name: 'reset-password/page.tsx', type: 'file', indent: 3 },
  { name: 'verify-email/page.tsx', type: 'file', indent: 3 },
  { name: 'layout.tsx', type: 'file', indent: 3 },
  { name: 'api/', type: 'folder', indent: 2 },
  { name: 'auth/[...all]/route.ts', type: 'file', indent: 3 },
  { name: 'profile/', type: 'folder', indent: 2 },
  { name: 'page.tsx', type: 'file', indent: 3 },
  { name: 'layout.tsx', type: 'file', indent: 2 },
  { name: 'page.tsx', type: 'file', indent: 2 },
  { name: 'globals.css', type: 'file', indent: 2 },
  { name: 'components/', type: 'folder', indent: 1 },
  { name: 'auth/...', type: 'file', indent: 2 },
  { name: 'navigation/...', type: 'file', indent: 2 },
  { name: 'shared/...', type: 'file', indent: 2 },
  { name: 'user/...', type: 'file', indent: 2 },
  { name: 'ui/...', type: 'file', indent: 2 },
  { name: 'lib/', type: 'folder', indent: 1 },
  { name: 'utils.ts', type: 'file', indent: 2 },
  { name: 'auth.ts', type: 'file', indent: 2 },
  { name: 'auth-client.ts', type: 'file', indent: 2 },
  { name: 'constants.ts', type: 'file', indent: 2 },
  { name: 'prisma.ts', type: 'file', indent: 2 },
  { name: 'require-user-session.ts', type: 'file', indent: 2 },
  { name: 'send-email.ts', type: 'file', indent: 2 },
  { name: 'utils.ts', type: 'file', indent: 2 },
  { name: 'validations.ts', type: 'file', indent: 2 },
  { name: 'helpers/', type: 'folder', indent: 1 },
  { name: 'generate-user-avatar.ts', type: 'file', indent: 2 },
  { name: 'get-pwd-strength.ts', type: 'file', indent: 2 },
  { name: 'types/', type: 'folder', indent: 1 },
  { name: 'index.ts', type: 'file', indent: 2 },
  { name: 'prisma.ts', type: 'file', indent: 1 },
  { name: 'providers.tsx', type: 'file', indent: 1 },
  { name: 'proxy.ts', type: 'file', indent: 1 },
  { name: 'prisma/', type: 'folder', indent: 0 },
  { name: 'schema.prisma', type: 'file', indent: 1 },
  { name: 'public/', type: 'folder', indent: 0 },
  { name: '...', type: 'file', indent: 1 },
  { name: '.prettierrc', type: 'file', indent: 0 },
  { name: '.env.example', type: 'file', indent: 0 },
  { name: '.vscode/', type: 'folder', indent: 0 },
  { name: 'settings.json', type: 'file', indent: 1 },
  { name: 'dev.db', type: 'file', indent: 0 },
];

export default function Home() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-16 px-4 py-12">
      <div className="flex flex-col items-center gap-6 text-center">
        <NotificationBoard type="warning">
          Note that experimental Nextjs <b>AuthInterups</b> feature is enabled for handling
          unauthorized redirections.
        </NotificationBoard>
        <NotificationBoard type="info" message="Start by filling out the .env.example file" />
        <NotificationBoard message="To use Github or any other social authentication, set up the corresponding environment variables and enable the providers in the auth configuration" />
        <NotificationBoard message="To setup your db modify schema.prisma file and run 'bun db:generate' and 'bun db:push'" />
        <div className="flex items-center gap-2 text-sm font-medium">
          <Rocket className="h-4 w-4 text-orange-600" />
          <span className="text-blue-600">Next.js Starter Kit</span>
        </div>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Build faster with a complete foundation
        </h1>
        <p className="max-w-xl text-lg text-gray-600">
          Everything you need to start building production-ready, small-to-medium, applications.
          TypeScript, Tailwind CSS, authentication, and sqlite database — all pre-configured.
        </p>
        <GuestSession />
      </div>

      <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(feature => (
          <div
            key={feature.title}
            className="group flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <feature.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Project Structure</h2>
          <p className="mt-2 text-gray-600">Organized by feature for easy navigation</p>
        </div>
        <div className="h-[50vh] w-full overflow-y-scroll rounded-xl border border-gray-200 bg-blue-950">
          <div className="bg-gray-700 px-4 py-2 text-xs font-medium text-orange-500">
            next-starter/
          </div>
          <div className="p-4">
            <div className="font-mono text-sm">
              {fileTree.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 py-1 text-gray-200"
                  style={{ paddingLeft: `${item.indent * 1.5}rem` }}
                >
                  {item.type === 'folder' ? (
                    <Folder className="h-4 w-4 text-blue-500" />
                  ) : (
                    <FileCode className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={item.type === 'folder' ? 'text-blue-500' : 'text-gray-300'}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
