import Container from '../Container';
import {
  FaEnvelope,
  FaPhone,
  FaClock,
  FaFacebook,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';

const QuickContact = () => {
  return (
    <div className="bg-white text-black border-b border-gray-200 text-sm font-bengali">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center py-2 gap-2">

          {/* Left: Update Message */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-green-600 text-white px-4 py-1 rounded font-bold">
              আপডেট
            </div>

            {/* Sliding Message */}
            <div className="overflow-hidden h-[24px] w-full">
              <div className="animate-marquee whitespace-nowrap">
                আগামীকাল মহান স্বাধীনতা দিবস উপলক্ষে স্কুল এবং কলেজ বন্ধ থাকবে।
              </div>
            </div>
          </div>

          {/* Right: Contact Info + Socials */}
          <div className="flex flex-col sm:flex-row items-center justify-between w-full md:w-auto gap-2 sm:gap-6 text-gray-700 text-sm">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <div className="flex items-center gap-1">
                <FaPhone />
                <p>+8801717171717</p>
              </div>
              <div className="flex items-center gap-1">
                <FaEnvelope />
                <p>info@madinatululum.com</p>
              </div>
              <div className="flex items-center gap-1">
                <FaClock />
                <p>Sat - Thu: 7:45 - 13:00</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaFacebook className="cursor-pointer hover:text-primary" />
              <FaTwitter className="cursor-pointer hover:text-primary" />
              <FaYoutube className="cursor-pointer hover:text-primary" />
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default QuickContact;
