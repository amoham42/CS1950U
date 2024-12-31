import React from "react";
import { SectionWrapper } from "../hoc";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import { sections } from "../constants/resources";

const Resources = ({onChange, onSky}) => {
  onChange(true);
  onSky(true);
  return (
    <div
    className={` absolute top-0 left-0 h-screen w-screen z-0 no-scrollbar transition-transform duration-400`}
  >

      <div className=" mx-[20%] relative overflow-y-auto no-scrollbar h-full z-10">
      <section className="mt-[10%] mb-[10%] flex flex-col gap-10 no-scrollbar z-20">
      <section id="resources" className="flex flex-col gap-10">
      <motion.div variants={textVariant()}>
        <h2 className={styles.titleHeadText}>Resources</h2>
      </motion.div>
      <div className="flex flex-col flex-wrap gap-4 md:flex-row">
        {sections.map((section, index) => (
          <div key={index}>
            <h3 className="mt-5 text-2xl font-display ease-out duration-500 neon-text-blue font-normal">{section.title}</h3>
            <hr className="mb-2 border-slate-600" />
            <div className="flex flex-col gap-4">
              {section.links.map((link, linkIndex) => (
                <a
                  key={linkIndex}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit mr-10"
                  href={link.href}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div>
      <h3 className="mt-5 text-2xl font-display ease-out duration-500 neon-text-blue font-normal">Previous Projects</h3>
      <hr className="mb-2 border-slate-600" />
      <iframe width="100%" height="600" src="//www.youtube.com/embed/34tPeh4s24E" frameborder="0" allowfullscreen=""></iframe>

      </div>
      </section>
      </section>
      </div>
    </div>
  );
};

export default Resources;
