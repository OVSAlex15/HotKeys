import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from 'lucide-react';

interface AuthFormProps {
  type: "signin" | "signup";
  onSubmit: (values: any) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, inputRef }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle>{type === 'signin' ? 'Sign In' : 'Sign Up'}</CardTitle>
        <CardDescription>
          {type === 'signin'
            ? 'Enter your email and password to sign in'
            : 'Create an account to get started'}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="email">Email</label>
          <Input
            id="email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            ref={inputRef}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="password">Password</label>
          <div className="relative">
            <Input
              id="password"
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 h-fit p-1.5"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
              <span className="sr-only">
                {showPassword ? 'Hide password' : 'Show password'}
              </span>
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit}>
          {type === 'signin' ? 'Sign In' : 'Sign Up'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
