import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch } from '@client/hooks';
import { useNavigate } from 'react-router-dom';
import { Alert, Checkbox, FormControlLabel } from '@mui/material';
import { signInAsync } from './auth.slice';

interface IFormInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function SignIn() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [error, setError] = React.useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    dispatch(signInAsync({ email: data.email, password: data.password, rememberMe: data.rememberMe, navigate, setError }));
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                inputProps={{ 'data-testid': 'signin-input-email' }}
                error={!!errors.email}
                helperText={errors.email && 'Email is required'}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="password"
                inputProps={{ 'data-testid': 'signin-input-password' }}
                error={!!errors.password}
                helperText={errors.password && 'Password is required'}
              />
            )}
          />
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                {...field}
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    inputProps={{ 'data-testid': 'signin-input-rememberme' } as React.InputHTMLAttributes<HTMLInputElement>}
                  />
                }
                label="Remember me"
              />
            )}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} data-testid="signin-submit-btn">
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              {/* <Link href="#" variant="body2">
                Forgot password?
              </Link> */}
            </Grid>
            <Grid item>
              <Link component="span" onClick={() => navigate('/signup')} variant="body2" data-testid="signin-signup-link">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
        {error && (
          <Box sx={{ mt: 5, width: '100%' }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
      </Box>
    </Container>
  );
}
