import './Social.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
const Social = () => {
    return (
        <div>
            <ul>
                <li>
                    <a href="#">
                        <i className="fab fa-google" aria-hidden="true"></i>
                        <span> - Facebook</span>
                    </a>


                     
                </li>
                <li>
                    <a href="#">
                        <i className="fa fa-twitter" aria-hidden="true"></i>
                        <span> - Twitter</span>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <i className="fa fa-google-plus" aria-hidden="true"></i>
                        <span> - Google</span>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <i className="fa fa-instagram" aria-hidden="true"></i>
                        <span> - Instagram</span>
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Social;