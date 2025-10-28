import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, MailIcon, LockIcon } from './icons/Icons';
import { toast } from 'sonner';

interface LoginPageProps {
  onLoginSuccess: (isAdmin: boolean) => void;
  onClose: () => void;
}

export function LoginPage({ onLoginSuccess, onClose }: LoginPageProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerData, setRegisterData] = useState({
    email: '',
    username: '',
    password: '',
    fullName: '',
  });

  const { login, loginWithGoogle, register } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(loginEmail, loginPassword);
    
    if (success) {
      // Check if admin or user
      const isAdmin = loginEmail === 'Admin2025' && loginPassword === 'MappleMofu0711';
      
      if (isAdmin) {
        toast.success('Welcome Admin!', {
          description: 'Redirecting to Admin Panel...',
        });
        onLoginSuccess(true);
      } else {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        toast.success(`Welcome back, ${user.fullName || user.username}! 👋`, {
          description: 'Great to see you again!',
        });
        onLoginSuccess(false);
      }
    } else {
      toast.error('Invalid Login or Password', {
        description: 'Please check your credentials and try again',
      });
    }
  };

  const handleGoogleLogin = async () => {
    const success = await loginWithGoogle();
    
    if (success) {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      toast.success(`Welcome, ${user.fullName}! 🎉`, {
        description: 'Signed in with Google successfully',
      });
      onLoginSuccess(false);
    } else {
      toast.error('Google sign-in failed');
    }
  };

  const validatePassword = (password: string): { isValid: boolean; message: string } => {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    return { isValid: true, message: 'Password is strong' };
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.email || !registerData.username || !registerData.password || !registerData.fullName) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(registerData.password);
    if (!passwordValidation.isValid) {
      toast.error('Password requirements not met', {
        description: passwordValidation.message,
        duration: 5000,
      });
      return;
    }

    const success = await register(registerData);
    
    if (success) {
      toast.success(`Welcome to Bobby Hobby, ${registerData.fullName}! 🎊`, {
        description: 'Your account has been created successfully',
      });
      onLoginSuccess(false);
    } else {
      toast.error('Registration failed', {
        description: 'Username or email already exists',
      });
    }
  };

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#d3d6e6' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#FF6B8B' }}>
              <UserIcon className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-4xl mb-2" style={{ fontFamily: 'Berkshire Swash, cursive', color: '#2D2D2D' }}>
              Bobby Hobby
            </CardTitle>
            <CardDescription className="text-base">
              Welcome! Sign in to continue your collection journey
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Username or Email</Label>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#5A5A5A' }} />
                      <Input
                        id="login-email"
                        type="text"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Enter your username or email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#5A5A5A' }} />
                      <Input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-white py-6 rounded-full mt-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{ backgroundColor: '#FF6B8B' }}
                  >
                    Sign In
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white" style={{ color: '#5A5A5A' }}>
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleGoogleLogin}
                    variant="outline"
                    className="w-full py-6 rounded-full border-2"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign in with Google
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-fullname">Full Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#5A5A5A' }} />
                      <Input
                        id="register-fullname"
                        name="fullName"
                        type="text"
                        value={registerData.fullName}
                        onChange={handleRegisterInputChange}
                        placeholder="Enter your full name"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-username">Username</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#5A5A5A' }} />
                      <Input
                        id="register-username"
                        name="username"
                        type="text"
                        value={registerData.username}
                        onChange={handleRegisterInputChange}
                        placeholder="Choose a username"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#5A5A5A' }} />
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        value={registerData.email}
                        onChange={handleRegisterInputChange}
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#5A5A5A' }} />
                      <Input
                        id="register-password"
                        name="password"
                        type="password"
                        value={registerData.password}
                        onChange={handleRegisterInputChange}
                        placeholder="Create a password"
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs" style={{ color: '#5A5A5A' }}>
                      Must be 8+ characters with uppercase, lowercase, and number
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-white py-6 rounded-full mt-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{ backgroundColor: '#FF6B8B' }}
                  >
                    Create Account
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white" style={{ color: '#5A5A5A' }}>
                        Or sign up with
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleGoogleLogin}
                    variant="outline"
                    className="w-full py-6 rounded-full border-2"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign up with Google
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <button
                onClick={onClose}
                className="text-sm hover:underline"
                style={{ color: '#5A5A5A' }}
              >
                Continue as guest
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
