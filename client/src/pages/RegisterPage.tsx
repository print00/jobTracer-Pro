import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { z } from 'zod';
import { AuthPageShell } from './AuthPageShell';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const schema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();
  const { pushToast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const parsed = schema.safeParse({ name, email, password });
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) nextErrors[issue.path.join('.')] = issue.message;
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await register(parsed.data);
      pushToast('Account created successfully');
      navigate('/');
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? 'Unable to create account')
        : 'Unable to create account';
      pushToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell title="Create your account" subtitle="Set up your personal job search command center.">
      <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
        <Input placeholder="Full name" value={name} onChange={(event) => setName(event.target.value)} error={errors.name} />
        <Input placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} error={errors.email} />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
        />
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
      <p className="mt-4 text-sm text-textMuted">
        Already have an account?{' '}
        <Link className="text-accent hover:underline" to="/login">
          Sign in
        </Link>
      </p>
    </AuthPageShell>
  );
};
