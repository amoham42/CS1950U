import React from "react";
import { styles } from "../styles";
import Table from "./Table";
import { lectures } from "../constants/lectures";

const Classes = ({onChange, onSky, onHome}) => {
  onChange(true);
  onSky(true);
  onHome(false);
  return (
    <div
    className={` absolute top-0 left-0 h-screen w-screen z-0 no-scrollbar transition-transform duration-400`}
  >

      <div className=" mx-[20%] relative overflow-y-auto no-scrollbar h-full z-10">
      <section className="mt-[10%] mb-[10%] flex flex-col gap-10 no-scrollbar z-20">
      <div>
        <h2 className={styles.titleHeadText}>Classes</h2>
      </div>

      <p>
      Classes will meet in person in CIT room 506. We recommend taking a look at the code demos accompanying each lecture to see how to implement C++ tips. 
      For some lectures, there are accompanying worksheets to aid in more math heavy topics.
      </p>
    
      <div className=' flex flex-wrap gap-10'>
        <Table data={lectures} lectures={true}/>
      </div>
      </section>
    </div>
    </div>
  );
};

export default Classes;
