import { useState } from 'react';
import './siam.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Social from './component/Social';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
// If you're using Font Awesome, make sure to import it correctly
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faGoogle, faFacebookF, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const Login = () => {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const navigate = useNavigate()
    const { createUser, signInWithGoogle, updateUserProfile, loading, setLoading } = useAuth();

    const handleSignUpClick = () => {
        setIsRightPanelActive(true);
    };

    const handleSignInClick = () => {
        setIsRightPanelActive(false);
    };

    // Optional: Prevent form submission for demonstration purposes
    const handleLoginSubmit = (e) => {
        e.preventDefault()
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        console.log(name, email, password);
    };



    const handleSignUpSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        console.log(name, email, password);

       try {
        createUser(email, password)
            .then((result) => {
                const user = result.user;
                console.log(user);

            })
            .then(() => {
                // After creating the user, you can update the user's profile
                return updateUserProfile(name, ''); // You can set a default photo URL or leave it empty
            })
            .then(() => {
                // Optionally, you can navigate to a different page after successful sign-up
                navigate('/');
            })

            .catch((error) => {
                console.error('Error creating user:', error);
            })
            .finally(() => {
                setLoading(false);
            });
        // You can also call updateUserProfile here if you want to set the user's name

        
       } catch (error) {
        console.error('Error during sign-up:', error);
        setLoading(false);  
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
                            <input type="email" placeholder="Email" />
                            <input type="password" placeholder="Password" />
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