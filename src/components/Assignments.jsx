import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import Table from "./Table";
import { projects } from "../constants/projects";

const Assignments = ({onChange, onSky}) => {
  onChange(true);
  onSky(true);
  return (
    <div
    className={`absolute top-0 left-0 h-screen w-screen z-0 no-scrollbar`}
  >

      <div className=" mx-[20%] relative overflow-y-auto no-scrollbar h-full z-10">
      <section className="mt-[10%] mb-[10%] flex flex-col gap-2 no-scrollbar z-20">

      <motion.div variants={textVariant()}>
        <h2 className={styles.titleHeadText}>Assignments</h2>
      </motion.div>

      <p>All assignments (except for the final) are due at 3pm of the day listed and will be checked for completion in person. </p>
      <br></br>
      <p>The link to sign up for times is here.
      The final is due on Friday, May 11 at 9am where you present your work to the class.</p>
      <br></br>
      <p> The stencil code template can be found here.. </p>

      <div className='flex flex-wrap gap-10'>
        <Table data={projects} projects={true}/>
      </div>
      </section>
      </div>
    </div>
  );
};

export default Assignments;