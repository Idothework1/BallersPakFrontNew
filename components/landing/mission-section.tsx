export default function MissionSection() {
  return (
    <section
      id="mission"
      className="mx-auto max-w-[80rem] px-6 md:px-8 py-20 text-center"
    >
      <h2 className="text-4xl font-semibold text-white mb-6">Our Mission</h2>
      <p className="mx-auto max-w-3xl text-lg text-gray-400 mb-10">
        To elevate the standard of football in Pakistan by providing aspiring
        players—ages <span className="font-semibold text-white">8-18</span>—with
        world-class training, resources, and community. We believe talent is
        everywhere, and with the right support, Pakistani athletes can compete
        on any stage.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold text-white">Grassroots</span>
          <span className="mt-2 text-gray-400">Building from the ground up</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold text-white">Player-First</span>
          <span className="mt-2 text-gray-400">Individual growth &amp; well-being</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold text-white">Pak-Pride</span>
          <span className="mt-2 text-gray-400">Showcase local talent globally</span>
        </div>
      </div>
    </section>
  );
} 