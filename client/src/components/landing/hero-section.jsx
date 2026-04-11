// src/components/landing/hero-section.jsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Heart, Star, CheckSquare } from "lucide-react";
import image from "@/assets/imgg.png"; //
import { MacbookScroll } from "@/components/landing/macbook-scroll";

export default function HeroSection() {
  const navigate = (path) => {
    window.location.href = path; // Standard navigation for landing
  };

  return (
    <section className="relative bg-black pt-20">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 text-center px-4">
        {/* <Badge className="mb-4 bg-blue-600 border-blue-600 text-white px-3 py-1">
          <Star className="mr-1 h-3 w-3" />
          Completely Free Forever
        </Badge> */}

        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
          Organize your tasks. <span className="text-blue-400">Boost productivity.</span>
        </h1>

        <p className="max-w-[700px] mt-4 text-gray-400 text-lg">
          PrompTool helps you manage your daily tasks, set priorities, and achieve your goals 
          with a beautiful and intuitive interface. No hidden costs.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/signup')}>
            Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="border-gray-700 text-white" onClick={() => navigate('/about')}>
            Learn More
          </Button>
        </div>

        {/* Stats Row */}
        <div className="flex gap-8 text-sm text-gray-500 mt-10">
          <div><span className="text-white font-bold">69K+</span> Active Users</div>
          <div><span className="text-white font-bold">69M+</span> Tasks Completed</div>
          <div><span className="text-white font-bold">69%</span> Free Forever</div>
        </div>
      </div>

      {/* The Macbook Scroll Effect Section */}
      <div className="w-full bg-black mt-10">
        <MacbookScroll
          src={image} //
          showGradient={false}
          title={
            <span className="text-white text-2xl md:text-4xl">
              Modern Task Management. <br /> Built for speed.
            </span>
          }
          badge={
            <div className="h-12 w-12 flex items-center justify-center bg-blue-600 rounded-full border-2 border-white">
               <CheckSquare className="text-white w-6 h-6" />
            </div>
          }
        />
      </div>
    </section>
  );
}