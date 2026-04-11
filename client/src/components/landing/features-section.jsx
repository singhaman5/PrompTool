import React from 'react';
import { CheckCircle2, Zap, Users, BarChart3 } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: <CheckCircle2 className="h-6 w-6" />,
      title: 'Task Management',
      description: 'Organize and prioritize your tasks with ease. Stay on top of your work.',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Lightning Fast',
      description: 'Built for speed and efficiency. Get things done faster than ever.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Team Collaboration',
      description: 'Work together seamlessly. Invite team members and collaborate in real-time.',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Progress Tracking',
      description: 'Visualize your progress with beautiful charts and insights.',
    },
  ];

  return (
    <section className="py-20 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything you need to stay productive
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            PrompTool provides all the tools you need to manage tasks, projects, and teams efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50 hover:bg-gray-900 transition-all hover:border-gray-700"
            >
              <div className="mb-4 text-blue-400">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
