import React from "react";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";

const About = ({showAbout, onSky}) => {
  onSky(false);
  return (
    <div
          className={` absolute top-0 left-0 w-1/2 h-screen z-0 no-scrollbar transition-transform duration-400 ${
            showAbout ? "transform translate-x-0" : "transform -translate-x-full"
          }`}
        >
      <div
        className="absolute top-0 left-0 w-full h-screen no-scrollbar z-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          maskImage:
            "linear-gradient(to left, transparent, rgba(0, 0, 0, 0.4) 15%, rgba(0, 0, 0, 0.6) 30%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to left, transparent, rgba(0, 0, 0, 0.4) 15%, rgba(0, 0, 0, 0.6) 30%, black 100%)",
        }}
      ></div>
    <div className=" mx-20 relative overflow-y-auto no-scrollbar h-full z-10">
    <section id="About" className="mt-[20%] mb-[20%] flex flex-col gap-10 no-scrollbar z-20">
    
      <h2 className="text-3xl font-semibold md:text-5xl text-[#00ccff]">
      🔮 3D Game Engines 🔮
      </h2>
      <div className="flex flex-col gap-10 md:flex-row">
        <div className="flex flex-col gap-6">
          <p>
          CSCI1950U functions like a group independent study where each student will implement their own 3D game engine in C++. 
          Topics covered include engine architecture and design, collision systems, AI systems, and independently chosen topics
          implemented in a final project such as networking, particles, animation, or rigidbody physics.
          </p>
          <p>
          Class time will be used to review the material and to work on projects with help from the TAs,
          so make sure to bring your laptops to class!
          </p>
        </div>
        <div className="flex flex-row justify-between md:flex-shrink-0 md:flex-col">
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex flex-col">
              <strong className="font-semibold text-[#00ccff]">Course:</strong>
              <a target="_blank" rel="noopener noreferrer" className="underline" href="https://www.coursicle.com/brown/courses/CSCI/1950U/">CSCI 1950U</a>
            </div>
            <div className="flex flex-col">
              <strong className="font-semibold text-[#00ccff]">Professor:</strong>
              <a target="_blank" rel="noopener noreferrer" className="underline" href="https://cs.brown.edu/people/faculty/dritchi1/">Daniel Ritchie</a>
            </div>
            <div className="flex flex-col">
              <strong className="font-semibold text-[#00ccff]">Location:</strong>
              <a target="_blank" rel="noopener noreferrer" className="underline" href="https://maps.app.goo.gl/1xfqYMQZHMA6Jadg9">CIT Center <br /> 506</a>
            </div>
            <div className="flex flex-col">
              <strong className="font-semibold text-[#00ccff]">Time:</strong>
              W 3pm-5:30pm
            </div>
          </div>
          <hr className="my-2 border-t-2 border-[#00ccff]" />
          <div className="flex flex-1 flex-col gap-1">
            <a target="_blank" rel="noopener noreferrer" className="underline" href="https://docs.google.com/presentation/d/1AkrQ-4Rsb-Cc9E9EfWytdsBTO4EtJvfCYi-nU8zFxzI">Syllabus</a>
            <a target="_blank" rel="noopener noreferrer" className="underline" href="https://app.slack.com/client/E04BPDFQBHC/C084F4A4X52?_gl=1*nih4zg*_gcl_au*MTQyNTc0MTg4My4xNzMyNTg1NzMy">Slack</a>
          </div>
        </div>
      </div>
      <h4 className="text-3xl font-semibold md:text-3xl text-[#00ccff]">Hours</h4>
     
      <div 
        className={` flex justify-center items-center`}
      >
        <iframe 
          src="https://calendar.google.com/calendar/embed?src=c_59db87f33e0fef48a0c38c789cb97a8687472d305887dc36092b45f82b95375a%40group.calendar.google.com&ctz=America%2FNew_York" 
          style={{width: "130vh", height: "100vh", maxHeight:"400px", borderRadius: "10px"}} 
          title="Google Calendar"
        ></iframe>      
      </div>

      {/* {Staff} */}
    
      <h4 className="text-3xl font-semibold md:text-3xl text-[#00ccff]">Staff</h4>
        <div>
          <div>
            <b className="font-semibold">Professor: </b>
            <a target="_blank" href="mailto:daniel_ritchie@brown.edu"> daniel_ritchie@brown.edu</a>
          </div>
          <div>
            <b className="font-semibold">Professor and HTAs:</b>
            <a target="_blank" href="mailto:cs1950uheadtas@lists.brown.edu"> cs1950uheadtas@lists.brown.edu</a>
          </div>
          <div className="italic">
            Do not email sensitive information, including Health Services
            &amp; Dean's Notes, to any HTAs, UTAs, or STAs.
          </div>
        </div>
        <div className="xs:grid-cols-2 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 p-16 pb-0">
            <h3 className="text-2xl font-medium">Professor</h3>
            <div className="frosted flex flex-col rounded-lg bg-[#00ccff]">
              <img className="aspect-square w-full rounded-t-lg object-contain" src="../Daniel_Ritchie.jpg" alt="Daniel Ritchie"></img>
              <div className="p-4">
                <div className="text-md font-medium">Daniel Ritchie</div>
                <div className="text-sm font-semibold text-slate-600">dritchi • he/him</div>
                <div className="mt-2 text-sm italic text-white">
                  Has an Erdős number of 4, a Bacon number of 3, and (debatably) an Erdős-Bacon number of 7.
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-16 pb-0">
            <h3 className="text-2xl font-medium">Head TA</h3>
            <div className="frosted flex flex-col rounded-lg bg-[#00ccff]">
              <img className="aspect-square w-full rounded-t-lg object-contain" src="../Arman.png" alt="Arman Mohammadi"></img>
              <div className="p-4">
                <div className="text-md font-medium">Arman Mohammadi</div>
                <div className="text-sm font-semibold text-slate-600">amoham42 • he/him</div>
                <div className="mt-2 text-sm text-white">
                  I love camping, hiking, and playing video games. I'm excited to be a TA for this course!
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xs:grid-cols-2 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 p-16 pb-0">
            <h3 className="text-2xl font-medium">Head TA</h3>
            <div className="frosted flex flex-col rounded-lg bg-[#00ccff]">
              <img className="aspect-square w-full rounded-t-lg object-contain" src="../Feiyue.png" alt="Feiyue Zhang"></img>
              <div className="p-4">
                <div className="text-md font-medium">Feiyue Zhang</div>
                <div className="text-sm font-semibold text-slate-600">fzhang50 • he/him</div>
                <div className="mt-2 text-sm italic text-white">
                 TODO
                </div>
              </div>
            </div>
          </div>
        </div>

    </section>
   
    </div>
    </div>
  );
};

export default About;