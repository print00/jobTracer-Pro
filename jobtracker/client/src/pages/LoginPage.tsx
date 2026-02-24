import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { AuthPageShell } from './AuthPageShell';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { pushToast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) nextErrors[issue.path.join('.')] = issue.message;
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await login(parsed.data);
      pushToast('Welcome back');
      navigate('/');
    } catch {
      pushToast('Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell title="Welcome to JobTrackr Pro" subtitle="Track every opportunity with confidence.">
      <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
        <Input placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} error={errors.email} />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
        />
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      <p className="mt-4 text-sm text-textMuted">
        New here?{' '}
        <Link className="text-accent hover:underline" to="/register">
          Create an account
        </Link>
      </p>
    </AuthPageShell>
  );
};
