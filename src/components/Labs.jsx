import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import Table from "./Table";
import { labs } from "../constants/labs";

const Labs = ({onChange, onSky}) => {
  onChange(true);
  onSky(true);
  return (
    <div
    className={` absolute top-0 left-0 h-screen w-screen z-0 no-scrollbar transition-transform duration-400`}
  >

      <div className=" mx-[20%] relative overflow-y-auto no-scrollbar h-full z-10">
      <section className="mt-[10%] mb-[10%] flex flex-col gap-10 no-scrollbar z-20">
      <motion.div variants={textVariant()}>
        <h2 className={styles.titleHeadText}>Labs</h2>
      </motion.div>

      <p
        className="mt-10"
      >
        There are 6 labs in total in this class. Each will take 2-3 hours to complete.
      </p>

      <div className='mt-10 flex flex-wrap gap-10'>
        <Table data={labs} labs={true}/>
      </div>
      </section>
      </div>
    </div>
  );
};

export default Labs;
