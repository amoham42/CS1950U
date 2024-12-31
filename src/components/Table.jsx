import React from "react";

const Table = ({ data, lectures = false, projects = false, labs = false }) => {
  const commonClasses = "pb-3 text-[#00CCFF] font-display ease-out duration-500 neon-text-blue font-bold";

  return (
    <table className="w-full mx-auto">
      <thead style={{ borderBottom: "2px solid", color: "#FFFFFF" }}>
        <tr className="table-header">
          {projects ? (
            <>
              <th className={`text-left ${commonClasses}`}>Project</th>
              <th className={`px-5 text-left ${commonClasses}`}>Checkpoint</th>
              <th className={`text-right ${commonClasses}`}>Date Due</th>
              <th className={`text-right ${commonClasses}`}>Link</th>
            </>
          ) : labs ? (
            <>
              <th className={`text-left ${commonClasses}`}>Topic</th>
              <th className={`px-5 text-right ${commonClasses}`}>Date</th>
              <th className={`text-right ${commonClasses}`}>Slides</th>
              <th className={`text-right ${commonClasses}`}>Submission</th>
            </>
          ) : (
            <>
              <th className={`text-left ${commonClasses}`}>Topic</th>
              <th className={`px-5 text-right ${commonClasses}`}>Date</th>
              <th className={`text-right ${commonClasses}`}>Google Slides</th>
              <th className={`text-right ${commonClasses}`}>Code Demos</th>
              <th className={`text-right ${commonClasses}`}>
                {lectures ? "Submission" : "Worksheets"}
              </th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {projects ? (
              <>
                <td className="py-3 text-left">{item.project}</td>
                <td className="px-5 text-left">{item.checkpoint}</td>
                <td className="px-5 text-right">{item.dateDue}</td>
                <td className="text-right">
                  {item.link ? (
                    <a
                      className="hover-glow focus:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={item.link}
                      style={{ color: "#00CCFF", fontWeight: "bold" }}
                    >
                      Link
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </>
            ) : labs ? (
              <>
                <td className="py-3 text-left">{item.topic}</td>
                <td className="px-5 text-right">{item.date}</td>
                <td className="text-right">
                  {item.slides ? (
                    <a
                      className="hover-glow focus:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={item.slides}
                      style={{ color: "#00CCFF", fontWeight: "bold" }}
                    >
                      Slides
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="text-right">
                  {item.submission_folder ? (
                    <a
                      className="hover-glow focus:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={item.submission_folder}
                      style={{ color: "#00CCFF", fontWeight: "bold" }}
                    >
                      Submission
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </>
            ) : (
              <>
                <td className="py-3 text-left">{item.topic}</td>
                <td className="px-5 text-right">{item.date}</td>
                <td className="text-right">
                  {item.googleSlides ? (
                    <a
                      className="hover-glow focus:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={item.googleSlides}
                      style={{ color: "#00CCFF", fontWeight: "bold" }}
                    >
                      Slides
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="text-right">
                  {item.codeDemos ? (
                    <a
                      className="hover-glow focus:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={item.codeDemos}
                      style={{ color: "#00CCFF", fontWeight: "bold" }}
                    >
                      Demo
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                {!lectures ? (
                  <td className="text-right">
                    {item.worksheets ? (
                      <a
                        className="hover-glow focus:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={item.worksheets}
                        style={{ color: "#00CCFF", fontWeight: "bold" }}
                      >
                        Worksheet
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                ) : (
                  <td className="text-right">
                    {item.submission_folder ? (
                      <a
                        className="hover-glow focus:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={item.submission_folder}
                        style={{ color: "#00CCFF", fontWeight: "bold" }}
                      >
                        Submission
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                )}
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
