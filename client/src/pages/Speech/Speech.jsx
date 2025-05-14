import { motion } from "framer-motion";
import Container from "../../components/Shared/Container";
import { useEffect, useState } from "react";




const Speech = () => {
  const [speech, setSpeech] = useState([]);

  useEffect(() => {
    fetch('/speech.json')
      .then(res => res.json())
      .then(data => {
        setSpeech(data); // or setTeam(data)
      });
  }, []);
  return (
    <Container>
      <section className="mt-16 px-4 sm:px-8 lg:px-20 py-10 bg-gray-100">
        <div className="flex flex-col gap-16 items-center justify-center">
          {speech.map((speech, index) => (
            <motion.div
              key={index}
              className="w-full max-w-4xl border p-6 sm:p-10 rounded-lg bg-white shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={speech.image}
                  alt="speaker"
                  className="   object-cover"
                />
                <div className="text-center sm:text-left">
                  <img
                    src={speech.quoteIcon}
                    alt="quote icon"
                    className="w-6 mx-auto sm:mx-0 mb-2"
                  />
                  <h1 className="text-2xl font-semibold border-b-2 border-green-500 pb-1">
                    {speech.title}
                  </h1>
                  <h3 className="pt-1 text-lg text-gray-700">{speech.name}</h3>
                </div>
              </div>

              <motion.div
                className="mt-8 text-center sm:text-justify leading-relaxed text-gray-800"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <p>{speech.message}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>
    </Container>
  );
};

export default Speech;
