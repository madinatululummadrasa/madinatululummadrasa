/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios';
import './siam.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { imageUpload } from '../../assets/utility';
import { toast } from 'react-hot-toast'




const Login = () => {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const navigate = useNavigate()
    const { createUser, signInWithGoogle, signIn, updateUserProfile, loading, setLoading } = useAuth();
 

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const getJwt = async (email) => {
        const res = await axios.post(`${API_URL}/jwt`, { email }, { withCredentials: true });
        const { token } = res.data;
        localStorage.setItem("newUserToken", token); // ✅ Store it manually
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set it in Axios header
        console.log('JWT set in localStorage and Axios header:', token);
        // You can also set it in a context or state if needed
        return token; // Return the token if needed

    };


    const handleSignUpClick = () => {
        setIsRightPanelActive(true);
    };
    const handleSignInClick = () => {
        setIsRightPanelActive(false);
    };


    const handleLoginSubmit = async (e) => {
        e.preventDefault()
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        console.log(name, email, password);

        try {
            setLoading(true);
            await signIn(email, password);
            await getJwt(email); // ✅ Get JWT
            toast.success('User logged in successfully');
            navigate('/');
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error(error.message);
        }
    };
    // const handleSignUpSubmit = async (e) => {
    //     e.preventDefault();
    //     const form = e.target;
    //     const name = form.name.value;
    //     const email = form.email.value;
    //     const password = form.password.value;
    //     const image = form.image.files[0];

    //     try {
    //         setLoading(true);
    //         const data = await imageUpload(image);
    //         const result = await createUser(email, password);
    //         await updateUserProfile(name, data);

    //         const response = await axios.post(`${API_URL}/users`, {
    //             name,
    //             email,
    //             image: data,
    //             role: 'guest'
    //         }, { withCredentials: true });
    //         console.log(response.data);
    //        await axios.post(`${API_URL}/jwt`, { email }, { withCredentials: true });
    //         // ✅ Get JWT after signup
    //         localStorage.setItem("newUserToken", response.data.token); // Store it manually
    //         axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`; // Set it in Axios header
    //         console.log('JWT set in localStorage and Axios header:', response.data.token);
          
    //         // await getJwt(email); // ✅ Get JWT after signup
    //         toast.success('User created successfully');
    //         navigate('/');
    //         setLoading(false);
    //     } catch (error) {
    //         console.log(error);
    //         setLoading(false);
    //         toast.error(error.message);
    //     }
    // }
const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const image = form.image.files[0];

    try {
        setLoading(true);
        const data = await imageUpload(image);
        const result = await createUser(email, password);
        await updateUserProfile(name, data);

        // 1. Save user to MongoDB
        await axios.post(`${API_URL}/users`, {
            name,
            email,
            image: data,
            role: 'guest'
        }, { withCredentials: true });

        // 2. Get JWT after signup
        const jwtRes = await axios.post(`${API_URL}/jwt`, { email }, { withCredentials: true });
        const { token } = jwtRes.data;

        // 3. Save and set token
        localStorage.setItem("newUserToken", token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('JWT set in localStorage and Axios header:', token);

        toast.success('User created successfully');
        navigate('/');
        setLoading(false);
    } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error(error.message);
    }
}



    return (
        // Apply the class to the outermost container for responsive adjustments
        <div className={`siam-login ${isRightPanelActive ? 'right-panel-active' : ''}`}>
            <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">



                {/* Sign Up Form Panel */}
                <div className="form-container sign-up-container">
                    <form onSubmit={handleSignUpSubmit}>
                        <h1>Create Account</h1>
                        <div className="social-container">
                            <a href="#" className="social"><i className="fab fa-google"></i></a>
                            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="social"><i className="fab fa-github"></i></a>
                            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>

                            {/* <Social></Social> */}
                            {/* Using FontAwesomeIcon if you install it:
                            <a href="#" className="social"><FontAwesomeIcon icon={faGoogle} /></a>
                            */}
                        </div>
                        <span>or use your email for registration</span>
                        <input name='name' type="text" placeholder="Name" />
                        <input name='email' type="email" placeholder="Email" />
                        <input name='password' type="password" placeholder="Password" />
                        <input required type='file' id='image' name='image' accept='image/*' />
                        <button type="submit">Sign Up</button>
                    </form>
                </div>







                {/* Sign In Form Panel */}
                <div className="form-container sign-in-container">
                    <form onSubmit={handleLoginSubmit}>
                        <h1>Sign in</h1>
                        <div className="social-container">
                            <a href="#" className="social"><i className="fab fa-google"></i></a>
                            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="social"><i className="fab fa-github"></i></a>
                            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                        <span>or use your account</span>
                        <input name='email' type="email" placeholder="Email" />
                        <input name='password' type="password" placeholder="Password" />
                        <a href="#">Forgot your password?</a>
                        <button type="submit">Sign In</button>
                    </form>
                </div>




                {/* Overlay Panel (The purple animated part for desktop) */}
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost" onClick={handleSignInClick}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start journey with us</p>
                            <button className="ghost" onClick={handleSignUpClick}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Toggler Buttons (visible on mobile/tablet) */}
            <div className="mobile-toggler">
                <button
                    className={!isRightPanelActive ? 'active' : ''}
                    onClick={handleSignInClick}
                >
                    Sign In
                </button>
                <button
                    className={isRightPanelActive ? 'active' : ''}
                    onClick={handleSignUpClick}
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default Login;