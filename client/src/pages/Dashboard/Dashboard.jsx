import { Outlet } from "react-router-dom";




const Dashboard = () => {
    return (
        <div className="py-10  min-h-screen">

            <div className="flex">
            
                <div className="flex-1 p-4 bg-gray-100 min-h-screen">
                    <Outlet />
                    

                </div>
            </div>

        </div>
    );
};

export default Dashboard;
