import img from '../../../../../../public/sided.jpg';
import Container from '../../../../Shared/Container';
import HomepageNotice from '../HomepageNotice/HomepageNotice';

const About = () => {
  return (
    <Container>
      <div className="bg-white  mt-10 md:mt-20 flex flex-col md:flex-row items-center relative gap-6">

        {/* Background image - for desktop only */}
        <img
          src={img}
          alt=""
          className="hidden lg:block absolute left-0 top-0 w-[424px] h-[520px] object-cover z-0 rounded-2xl"
        />

        {/* Left content box */}
        <div className="w-full md:w-3/5 lg:w-4/7 relative z-10">
          <div className="p-4 md:p-6 lg:p-[24px] bg-white bg-opacity-95 rounded-2xl w-full md:w-full lg:w-[470px] md:h-auto lg:h-[358px] mt-0 md:mt-[40px] md:ml-0 lg:ml-[340px] shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-snug">প্রতিষ্ঠান সম্পর্কে</h1>
            <p className="text-gray-700 leading-relaxed tracking-wide font-bengali text-base">
              এক্সওয়াইজেড স্কুল এবং কলেজ এর অতি গৌরবজ্জ্বল বর্তমান প্রেক্ষাপট। ২০০৩ ইংরেজি ২০ জানুয়ারি এক্সওয়াইজেড স্কুল এবং কলেজ এর স্থায়ী ম্যানেজিং অফিসের তত্ত্বাবধানে প্রধান কার্যালয় স্থাপন করা হয়।
              এক্সওয়াইজেডের নিজস্ব প্রতিষ্ঠানে তখন এটা এক্সওয়াইজেড গার্লস স্কুল নামে পরিচিত ছিল। এবং এটি ছিল ৬ তলা সুপরিসর বিদ্যোৎসাহী ব্যক্তিদের একটি উদ্যোগ এবং পরিচালনার দায়িত্ব ছিল।
              এসএসসি অধিভুক্ত বাংলা শিক্ষা বোর্ড করাতে হয় এবং এই বিদ্যালয় চালু করা হয়। ২০২৩ সালের ৫ মে: এক্সওয়াইজেড বিদ্যালয়ে প্রধান শিক্ষক নিয়োগ হয়।
            </p>
            <button className="mt-6 bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition duration-200">
              বিস্তারিত পড়ুন
            </button>
          </div>
        </div>

        {/* Notice Board Section */}
        <div className="w-full md:w-auto lg:w-[350px] lg:ml-[100px] relative z-10 mt-6 lg:mt-0">
          <div className="mx-auto max-w-md">
            <HomepageNotice />
          </div>
        </div>

      </div>
    </Container>
  );
};

export default About;
