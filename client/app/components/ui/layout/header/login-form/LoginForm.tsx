import { useAuth } from '@/hooks/useAuth';
import { useOutside } from '@/hooks/useOutside';
import { AuthService } from '@/services/auth/auth.service';
import Button from '@/ui/button/Button';
import Field from '@/ui/field/Field';
import UserAvatar from '@/ui/user-avatar/UserAvatar';

import { menuAnimation } from '@/utils/animation/fade';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { motion } from 'framer-motion';
import { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaRegUserCircle } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
// import { useMutation } from 'react-query';
import { validEmail } from './login-auth.constants';
import { IAuthFields } from './login-form.interface';

import styles from './LoginForm.module.scss';

interface IErrorMessage {
	error?: string;
	message?: string;
	statusCode?: number;
}

const LoginForm: FC = () => {
	const { ref, setIsShow, isShow } = useOutside(false);

	const [type, setType] = useState<'login' | 'register'>('login');
	const [errorMessage, setErrorMessage] = useState<string>('');

	const {
		register,
		formState: { errors },
		handleSubmit,
		reset
	} = useForm<IAuthFields>({
		mode: 'onChange'
	});

	const { user, setUser } = useAuth();

	const { mutate: loginSync, isError } = useMutation(
		['login'],
		(data: IAuthFields) => AuthService.login(data.email, data.password),
		{
			onSuccess(data) {
				if (setUser) setUser(data.user);
				reset();
				setIsShow(false);
			},
			onError(err: AxiosError) {
				const error = (err.response?.data as IErrorMessage).message;
				setErrorMessage(error === undefined ? '' : error);
			}
		}
	);

	const { mutate: registerSync } = useMutation(
		['register'],
		(data: IAuthFields) => AuthService.register(data.email, data.password),
		{
			onSuccess(data) {
				if (setUser) setUser(data.user);
				reset();
				setIsShow(false);
			}
		}
	);

	const onSubmit: SubmitHandler<IAuthFields> = data => {
		if (type === 'login') loginSync(data);
		else if (type === 'register') registerSync(data);
	};
	return (
		<div className={styles.wrapper} ref={ref}>
			{user ? (
				<UserAvatar
					link='/dashboard'
					title='Перейти в админку'
					avatarPath={user.avatarPath || ''}
				/>
			) : (
				<button onClick={() => setIsShow(!isShow)} className={styles.button}>
					<FaRegUserCircle />
				</button>
			)}

			<motion.div
				initial={false}
				animate={isShow ? 'open' : 'closed'}
				variants={menuAnimation}
			>
				<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
					<Field
						{...register('email', {
							required: 'Email is required',
							pattern: {
								value: validEmail,
								message: 'Please enter a valid email address'
							}
						})}
						placeholder='Email'
						error={errors.email}
					/>
					<Field
						{...register('password', {
							required: 'Password is required',
							minLength: {
								value: 6,
								message: 'Min length should more 6 symbols'
							}
						})}
						placeholder='Password'
						error={errors.password}
						type={'password'}
					/>
					<div className={styles.loginButton}>
						<Button onClick={() => setType('login')}>login</Button>
					</div>
					<span className={styles.error}>{errorMessage}</span>
					<button
						className={styles.register}
						onClick={() => setType('register')}
					>
						Register
					</button>
				</form>
			</motion.div>
			<button
				className={styles.logout}
				onClick={() => {
					AuthService.logout();
					setUser(null);
				}}
			>
				<MdLogout />
			</button>
		</div>
	);
};

export default LoginForm;
