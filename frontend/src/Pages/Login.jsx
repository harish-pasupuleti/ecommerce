import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const Login = () => {
  const navigate = useNavigate();  // Initialize navigate function
  const [currentState, setCurrentState] = useState('Sign Up');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      fetchUserData(parsedUser.userId);
    }
  }, []);

  // Fetch user data from backend if user is already logged in
  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/auth/user/${userId}`);
      setUser(response.data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data.');
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (currentState === 'Sign Up') {
        // Send Sign Up data to the backend
        const response = await axios.post('http://localhost:3001/auth/signup', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        });

        setSuccess(response.data.message);
        setError('');

        // Store user info in sessionStorage
        sessionStorage.setItem('user', JSON.stringify({ userId: response.data.userId, name: formData.name, email: formData.email }));

        // Fetch user data
        fetchUserData(response.data.userId);

        // Redirect to home page after successful signup
        navigate('/');
      } else {
        // Send Login data to the backend
        const response = await axios.post('http://localhost:3001/auth/login', {
          email: formData.email,
          password: formData.password,
        });

        setSuccess(response.data.message);
        setError('');

        // Store user info in sessionStorage
        sessionStorage.setItem('user', JSON.stringify({ userId: response.data.userId, email: formData.email }));

        // Fetch user data
        fetchUserData(response.data.userId);

        // Redirect to home page after successful login
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
      setSuccess('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
    navigate('/login');  // Redirect to login page after logout
  };

  return (
    <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      {user ? (
        <div className="text-center">
          <h2 className="text-xl font-bold">Welcome, {user.name}!</h2>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white px-6 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      ) : (
        <>
          <div className="inline-flex items-center gap-2 mb-2 mt-10">
            <p className="prata-regular text 3x1">{currentState}</p>
            <hr className="border-none h-[1.5px] w-8 bg-gray-800 " />
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <form onSubmit={onSubmitHandler} className="w-full px-3 py-2 flex flex-col gap-4">
            {currentState === 'Sign Up' && (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-880"
                placeholder="Name"
                required
              />
            )}

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-880"
              placeholder="Email"
              required
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-880"
              placeholder="Password"
              required
            />

            {currentState === 'Sign Up' && (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-880"
                placeholder="Phone (optional)"
              />
            )}

            <div className="w-full flex justify-between text-sm mt-[-8px]">
              <p className="cursor-pointer">Forgot your password?</p>
              {currentState === 'Login' ? (
                <p
                  onClick={() => setCurrentState('Sign Up')}
                  className="cursor-pointer"
                >
                  Create Account
                </p>
              ) : (
                <p
                  onClick={() => setCurrentState('Login')}
                  className="cursor-pointer"
                >
                  Login Here
                </p>
              )}
            </div>

            <button className="w-1/2 m-auto bg-black text-white px-8 py-2 mt-4">
              {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Login;
