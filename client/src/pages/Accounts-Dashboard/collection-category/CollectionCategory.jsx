
import { CiCirclePlus } from "react-icons/ci";

import { Link } from "react-router-dom";
import CollectionCatModal from "../Components/Modal/CollectionCatModal";
import { useState } from "react";
const CollectionCategory = () => {


    const iconData = [
        { id: 1, icon: 'https://i.ibb.co/Q7KXQYdF/class.png', text: 'ক্লাস তৈরি', link: 'accounts-dashboard/create-class' },
        { id: 2, icon: 'https://i.ibb.co/KpdNGjdP/students.png', text: 'ছাত্র-ছাত্রী', link: 'accounts-dashboard/students' },
        { id: 3, icon: 'https://i.ibb.co/CpTjtbF5/member.png', text: 'সদস্য', link: '#members' },
        { id: 4, icon: 'https://i.ibb.co/8LkJQfxK/collection.png', text: 'কালেকশন', link: 'accounts-dashboard/add-new-collection-entry' },
        { id: 5, icon: 'https://i.ibb.co/fGvLNXKK/collectionreport.png', text: 'কালেকশন রিপোর্ট', link: '#collection-report' },
        { id: 6, icon: 'https://i.ibb.co/Z6cptFwH/studentsfeecollection.png', text: 'ছাত্র-ছাত্রীর কালেকশন', link: '#student-collection' },
        { id: 7, icon: 'https://i.ibb.co/TDm5zFNy/memberfeecollection.png', text: 'সদস্যের কালেকশন', link: '#member-collection' },
        { id: 8, icon: 'https://i.ibb.co/8DM70m4R/salarydue.png', text: 'বেতনের বাকি রিপোর্ট', link: '#salary-due-report' },
        { id: 9, icon: 'https://i.ibb.co/60hZjGww/cost.png', text: 'খরচের খাত', link: '#expense-category' },
        { id: 10, icon: 'https://i.ibb.co/d0HBsHZK/incometype.png', text: 'কালেকশনের খাত', link: 'accounts-dashboard/collection-category' },
        { id: 11, icon: 'https://i.ibb.co/4nWXDjLG/cashreport.png', text: 'ক্যাশ রিপোর্ট', link: '#cash-report' },
        { id: 12, icon: 'https://i.ibb.co/hRwB7RKW/incomeexpense.png', text: 'আয়-ব্যয়', link: '#income-expense' },
       

    ];




    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);

    };


    return (
        <div>
            <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 max-w-7xl mx-auto bg-white rounded-lg ">
                {iconData.map((item) => (
                    // Wrapped the div with an <a> tag and added href
                    <div key={item.id}
                        className="border flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:text-red-500  transition-shadow cursor-pointer no-underline text-inherit" // Added no-underline and text-inherit for styling
                    >

                        <a href={item.link} >
                            {/* You can replace this img with an SVG or a FontAwesome icon component later */}

                            <p className="text-center text-sm font-medium  text-gray-700">{item.text}</p>
                        </a>
                    </div>

                ))}
                <div
                    className=" border flex flex-row items-center justify-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer no-underline text-inherit" // Added no-underline and text-inherit for styling
                >

                    <Link to="" onClick={openModal} className="flex items-center justify-center gap-1">
                        {/* You can replace this img with an SVG or a FontAwesome icon component later */}
                        <CiCirclePlus className="w-6 h-6  text-gray-500" />
                        <button className="text-center text-sm font-medium text-gray-700">Add New </button>
                    </Link>
                    <CollectionCatModal
                        isOpen={isOpen}
                        onClose={closeModal}
                       
                    />

                </div>
            </section>
        </div>
    );
};

export default CollectionCategory;