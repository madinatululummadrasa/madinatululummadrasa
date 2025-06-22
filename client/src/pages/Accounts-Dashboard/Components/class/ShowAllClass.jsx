

import useFetchQuery from "../../../../hooks/useFetchQuery";


const ShowAllClass = () => {
    const { data: classes = [], isLoading, error } = useFetchQuery({
        key: ["classes"],
        url: "/classes",
    });
console.log(classes);
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong</p>;

    return (
        <div>
            <h2>All Users</h2>
            <ul>
                {classes.map((user) => (
                    <li key={user._id}>{user.date} - {user.status}</li>
                ))}
            </ul>
        </div>
    );
};
export default ShowAllClass;